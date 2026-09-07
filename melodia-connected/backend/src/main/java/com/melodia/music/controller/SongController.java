package com.melodia.music.controller;

import com.melodia.music.dto.SongRequest;
import com.melodia.music.dto.SongResponse;
import com.melodia.music.repository.SongRepository;
import com.melodia.music.service.SongService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/songs")
public class SongController {

    private final SongService songService;
    private final SongRepository songRepository;

    public SongController(SongService songService, SongRepository songRepository) {
        this.songService = songService;
        this.songRepository = songRepository;
    }

    @GetMapping
    public Page<SongResponse> list(Pageable pageable) {
        return songRepository.findAll(pageable).map(SongResponse::from);
    }

    @GetMapping("/{id}")
    public SongResponse get(@PathVariable UUID id) {
        return songService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SongResponse> create(@Valid @RequestBody SongRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(songService.create(request));
    }
}
