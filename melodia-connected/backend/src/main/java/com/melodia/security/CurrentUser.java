package com.melodia.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.UUID;

/**
 * The JwtAuthFilter sets the authenticated principal to the user's UUID
 * (see JwtAuthFilter), so every controller that needs "the current user"
 * reads it from here instead of re-parsing the token.
 */
public final class CurrentUser {

    private CurrentUser() {}

    public static UUID id() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user in context");
        }
        return (UUID) auth.getPrincipal();
    }
}
