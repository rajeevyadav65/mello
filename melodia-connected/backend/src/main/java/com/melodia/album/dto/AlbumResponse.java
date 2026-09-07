package com.melodia.album.dto;

import com.melodia.album.entity.Album;

import java.time.LocalDate;
import java.util.UUID;

public record AlbumResponse(
        UUID id,
        UUID artistId,
        String artistName,
        String title,
        LocalDate releaseDate,
        String coverObjectKey
) {
    public static AlbumResponse from(Album album) {
        return new AlbumResponse(
                album.getId(),
                album.getArtist().getId(),
                album.getArtist().getName(),
                album.getTitle(),
                album.getReleaseDate(),
                album.getCoverObjectKey()
        );
    }
}
