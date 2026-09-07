package com.melodia.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record SongRequest(
        @NotNull UUID albumId,
        UUID genreId,
        @NotBlank String title,
        @Positive int durationSeconds,
        @NotBlank String audioObjectKey,
        Integer trackNumber
) {}
