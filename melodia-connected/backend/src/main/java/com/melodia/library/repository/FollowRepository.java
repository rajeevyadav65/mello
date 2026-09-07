package com.melodia.library.repository;

import com.melodia.library.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, UUID> {
    List<Follow> findByUserId(UUID userId);
    void deleteByUserIdAndArtistId(UUID userId, UUID artistId);
}
