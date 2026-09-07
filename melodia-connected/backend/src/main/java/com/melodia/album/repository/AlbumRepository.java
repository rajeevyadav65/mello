package com.melodia.album.repository;

import com.melodia.album.entity.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AlbumRepository extends JpaRepository<Album, UUID> {
    Page<Album> findByArtistId(UUID artistId, Pageable pageable);
}
