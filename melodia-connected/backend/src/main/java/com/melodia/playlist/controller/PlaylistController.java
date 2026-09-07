package com.melodia.playlist.controller;

import com.melodia.playlist.dto.PlaylistRequest;
import com.melodia.playlist.dto.PlaylistResponse;
import com.melodia.playlist.service.PlaylistService;
import com.melodia.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping
    public List<PlaylistResponse> listMine() {
        return playlistService.listForUser(CurrentUser.id());
    }

    @PostMapping
    public ResponseEntity<PlaylistResponse> create(@Valid @RequestBody PlaylistRequest request) {
        PlaylistResponse response = playlistService.create(CurrentUser.id(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public PlaylistResponse get(@PathVariable UUID id) {
        return playlistService.get(id);
    }

    @PutMapping("/{id}")
    public PlaylistResponse update(@PathVariable UUID id, @Valid @RequestBody PlaylistRequest request) {
        return playlistService.update(id, CurrentUser.id(), request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        playlistService.delete(id, CurrentUser.id());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/songs/{songId}")
    public ResponseEntity<Void> addSong(@PathVariable UUID id, @PathVariable UUID songId) {
        playlistService.addSong(id, CurrentUser.id(), songId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/songs/{songId}")
    public ResponseEntity<Void> removeSong(@PathVariable UUID id, @PathVariable UUID songId) {
        playlistService.removeSong(id, CurrentUser.id(), songId);
        return ResponseEntity.noContent().build();
    }
}
