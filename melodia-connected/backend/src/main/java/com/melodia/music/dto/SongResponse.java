package com.melodia.music.dto;

import com.melodia.music.entity.Song;

import java.util.UUID;

public record SongResponse(
        UUID id,
        String title,
        int durationSeconds,
        UUID albumId,
        String albumTitle,
        UUID artistId,
        String artistName,
        String genreName,
        Integer trackNumber
) {
    public static SongResponse from(Song song) {
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getDurationSeconds(),
                song.getAlbum().getId(),
                song.getAlbum().getTitle(),
                song.getAlbum().getArtist().getId(),
                song.getAlbum().getArtist().getName(),
                song.getGenre() != null ? song.getGenre().getName() : null,
                song.getTrackNumber()
        );
    }
}
