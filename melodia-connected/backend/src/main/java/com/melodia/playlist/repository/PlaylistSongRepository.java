package com.melodia.playlist.repository;

import com.melodia.playlist.entity.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, UUID> {
    List<PlaylistSong> findByPlaylistIdOrderByPosition(UUID playlistId);
    void deleteByPlaylistIdAndSongId(UUID playlistId, UUID songId);
}
