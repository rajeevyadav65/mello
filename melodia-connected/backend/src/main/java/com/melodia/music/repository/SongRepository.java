package com.melodia.music.repository;

import com.melodia.music.entity.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SongRepository extends JpaRepository<Song, UUID> {
    Page<Song> findByAlbumId(UUID albumId, Pageable pageable);
    Page<Song> findByTitleContainingIgnoreCase(String title, Pageable pageable);
}
