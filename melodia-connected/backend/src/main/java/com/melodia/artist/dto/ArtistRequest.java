package com.melodia.artist.dto;

import jakarta.validation.constraints.NotBlank;

public record ArtistRequest(
        @NotBlank String name,
        String bio,
        String imageObjectKey
) {}
