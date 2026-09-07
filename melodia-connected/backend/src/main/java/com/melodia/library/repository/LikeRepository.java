package com.melodia.library.repository;

import com.melodia.library.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LikeRepository extends JpaRepository<Like, UUID> {
    List<Like> findByUserId(UUID userId);
    Optional<Like> findByUserIdAndSongId(UUID userId, UUID songId);
    void deleteByUserIdAndSongId(UUID userId, UUID songId);
}
