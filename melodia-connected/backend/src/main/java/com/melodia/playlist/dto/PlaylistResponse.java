package com.melodia.playlist.dto;

import com.melodia.music.dto.SongResponse;
import com.melodia.playlist.entity.Playlist;

import java.util.List;
import java.util.UUID;

public record PlaylistResponse(
        UUID id,
        String title,
        boolean isPublic,
        List<SongResponse> songs
) {
    public static PlaylistResponse from(Playlist playlist, List<SongResponse> songs) {
        return new PlaylistResponse(playlist.getId(), playlist.getTitle(), playlist.isPublic(), songs);
    }
}
