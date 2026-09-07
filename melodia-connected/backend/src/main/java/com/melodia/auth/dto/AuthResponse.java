package com.melodia.auth.dto;

import java.util.UUID;

public record AuthResponse(
        UUID userId,
        String displayName,
        String accessToken,
        String refreshToken
) {}
