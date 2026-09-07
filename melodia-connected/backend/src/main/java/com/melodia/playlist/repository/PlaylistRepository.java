package com.melodia.playlist.repository;

import com.melodia.playlist.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {
    List<Playlist> findByUserId(UUID userId);
}
