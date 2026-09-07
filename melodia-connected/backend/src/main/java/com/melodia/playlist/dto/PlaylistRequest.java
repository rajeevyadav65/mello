package com.melodia.playlist.dto;

import jakarta.validation.constraints.NotBlank;

public record PlaylistRequest(
        @NotBlank String title,
        boolean isPublic
) {}
