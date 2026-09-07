package com.melodia.admin.controller;

import com.melodia.genre.entity.Genre;
import com.melodia.genre.repository.GenreRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/genres")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public record GenreRequest(@NotBlank String name) {}

    @GetMapping
    public List<Genre> list() {
        return genreRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Genre> create(@RequestBody GenreRequest request) {
        Genre genre = Genre.builder().name(request.name()).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(genreRepository.save(genre));
    }
}
