package com.melodia.artist.controller;

import com.melodia.artist.dto.ArtistRequest;
import com.melodia.artist.dto.ArtistResponse;
import com.melodia.artist.entity.Artist;
import com.melodia.artist.repository.ArtistRepository;
import com.melodia.exception.ApiException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/artists")
public class ArtistController {

    private final ArtistRepository artistRepository;

    public ArtistController(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @GetMapping
    public Page<ArtistResponse> list(Pageable pageable) {
        return artistRepository.findAll(pageable).map(ArtistResponse::from);
    }

    @GetMapping("/{id}")
    public ArtistResponse get(@PathVariable UUID id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("ARTIST_NOT_FOUND", "Artist not found"));
        return ArtistResponse.from(artist);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArtistResponse> create(@Valid @RequestBody ArtistRequest request) {
        Artist artist = Artist.builder()
                .name(request.name())
                .bio(request.bio())
                .imageObjectKey(request.imageObjectKey())
                .build();
        artist = artistRepository.save(artist);
        return ResponseEntity.status(HttpStatus.CREATED).body(ArtistResponse.from(artist));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ArtistResponse update(@PathVariable UUID id, @Valid @RequestBody ArtistRequest request) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("ARTIST_NOT_FOUND", "Artist not found"));
        artist.setName(request.name());
        artist.setBio(request.bio());
        artist.setImageObjectKey(request.imageObjectKey());
        return ArtistResponse.from(artistRepository.save(artist));
    }
}
