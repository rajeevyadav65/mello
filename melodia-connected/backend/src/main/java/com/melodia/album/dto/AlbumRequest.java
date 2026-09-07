package com.melodia.album.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record AlbumRequest(
        @NotNull UUID artistId,
        @NotBlank String title,
        LocalDate releaseDate,
        String coverObjectKey
) {}
