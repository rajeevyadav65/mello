package com.melodia.album.controller;

import com.melodia.album.dto.AlbumRequest;
import com.melodia.album.dto.AlbumResponse;
import com.melodia.album.entity.Album;
import com.melodia.album.repository.AlbumRepository;
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
@RequestMapping("/api/v1/albums")
public class AlbumController {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    public AlbumController(AlbumRepository albumRepository, ArtistRepository artistRepository) {
        this.albumRepository = albumRepository;
        this.artistRepository = artistRepository;
    }

    @GetMapping
    public Page<AlbumResponse> list(Pageable pageable) {
        return albumRepository.findAll(pageable).map(AlbumResponse::from);
    }

    @GetMapping("/{id}")
    public AlbumResponse get(@PathVariable UUID id) {
        Album album = albumRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("ALBUM_NOT_FOUND", "Album not found"));
        return AlbumResponse.from(album);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AlbumResponse> create(@Valid @RequestBody AlbumRequest request) {
        Artist artist = artistRepository.findById(request.artistId())
                .orElseThrow(() -> ApiException.notFound("ARTIST_NOT_FOUND", "Artist not found"));

        Album album = Album.builder()
                .artist(artist)
                .title(request.title())
                .releaseDate(request.releaseDate())
                .coverObjectKey(request.coverObjectKey())
                .build();
        album = albumRepository.save(album);
        return ResponseEntity.status(HttpStatus.CREATED).body(AlbumResponse.from(album));
    }
}
