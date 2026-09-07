package com.melodia.auth.service;

import com.melodia.auth.dto.AuthResponse;
import com.melodia.auth.dto.LoginRequest;
import com.melodia.auth.dto.RegisterRequest;
import com.melodia.exception.ApiException;
import com.melodia.security.JwtService;
import com.melodia.user.entity.RefreshToken;
import com.melodia.user.entity.Role;
import com.melodia.user.entity.User;
import com.melodia.user.repository.RefreshTokenRepository;
import com.melodia.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                        RefreshTokenRepository refreshTokenRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw ApiException.conflict("EMAIL_ALREADY_IN_USE", "An account with this email already exists");
        }

        User user = User.builder()
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(request.displayName())
                .verified(false)
                .roles(Set.of(Role.USER))
                .build();

        user = userRepository.save(user);
        return issueTokens(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> ApiException.unauthorized("INVALID_CREDENTIALS", "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("INVALID_CREDENTIALS", "Invalid email or password");
        }

        return issueTokens(user);
    }

    @Transactional
    public AuthResponse refresh(String rawRefreshToken) {
        if (!jwtService.isTokenValid(rawRefreshToken)) {
            throw ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
        }

        String tokenHash = hash(rawRefreshToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Refresh token not recognized"));

        if (stored.isRevoked() || stored.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.unauthorized("INVALID_REFRESH_TOKEN", "Refresh token has been revoked or expired");
        }

        // Rotate: revoke the old refresh token and issue a fresh pair.
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "User no longer exists"));

        return issueTokens(user);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        String tokenHash = hash(rawRefreshToken);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(stored -> {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
        });
    }

    private AuthResponse issueTokens(User user) {
        List<String> roles = user.getRoles().stream().map(Enum::name).toList();
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getId());

        RefreshToken entity = RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(hash(refreshToken))
                .expiresAt(Instant.now().plusMillis(7L * 24 * 60 * 60 * 1000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(entity);

        return new AuthResponse(user.getId(), user.getDisplayName(), accessToken, refreshToken);
    }

    /**
     * We never store the raw refresh token - only a SHA-256 hash - so a DB read
     * doesn't hand an attacker a usable session token (same principle as password
     * hashing, applied to session tokens).
     */
    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value.getBytes());
            return Base64.getEncoder().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
