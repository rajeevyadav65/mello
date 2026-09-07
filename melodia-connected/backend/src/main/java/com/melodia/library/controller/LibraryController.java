package com.melodia.library.controller;

import com.melodia.library.entity.Follow;
import com.melodia.library.entity.Like;
import com.melodia.library.repository.FollowRepository;
import com.melodia.library.repository.LikeRepository;
import com.melodia.music.dto.SongResponse;
import com.melodia.music.repository.SongRepository;
import com.melodia.security.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/library")
public class LibraryController {

    private final LikeRepository likeRepository;
    private final FollowRepository followRepository;
    private final SongRepository songRepository;

    public LibraryController(LikeRepository likeRepository, FollowRepository followRepository,
                              SongRepository songRepository) {
        this.likeRepository = likeRepository;
        this.followRepository = followRepository;
        this.songRepository = songRepository;
    }

    @PostMapping("/likes/{songId}")
    public ResponseEntity<Void> like(@PathVariable UUID songId) {
        UUID userId = CurrentUser.id();
        if (likeRepository.findByUserIdAndSongId(userId, songId).isEmpty()) {
            likeRepository.save(Like.builder().userId(userId).songId(songId).build());
        }
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/likes/{songId}")
    public ResponseEntity<Void> unlike(@PathVariable UUID songId) {
        likeRepository.deleteByUserIdAndSongId(CurrentUser.id(), songId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/liked-songs")
    public List<SongResponse> likedSongs() {
        return likeRepository.findByUserId(CurrentUser.id()).stream()
                .map(like -> songRepository.findById(like.getSongId()))
                .filter(java.util.Optional::isPresent)
                .map(opt -> SongResponse.from(opt.get()))
                .toList();
    }

    @PostMapping("/follows/{artistId}")
    public ResponseEntity<Void> follow(@PathVariable UUID artistId) {
        UUID userId = CurrentUser.id();
        followRepository.save(Follow.builder().userId(userId).artistId(artistId).build());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/follows/{artistId}")
    public ResponseEntity<Void> unfollow(@PathVariable UUID artistId) {
        followRepository.deleteByUserIdAndArtistId(CurrentUser.id(), artistId);
        return ResponseEntity.noContent().build();
    }
}
