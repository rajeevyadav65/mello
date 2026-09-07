package com.melodia.search.controller;

import com.melodia.music.dto.SongResponse;
import com.melodia.music.repository.SongRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Search the licensed songs already present in Melodia's catalogue. */
@RestController
@RequestMapping("/api/v1/search")
public class SearchController {
    private final SongRepository songRepository;

    public SearchController(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @GetMapping
    public List<SongResponse> songs(@RequestParam(defaultValue = "") String q,
                                    @RequestParam(defaultValue = "25") int limit) {
        if (q.isBlank()) return List.of();
        int pageSize = Math.min(Math.max(limit, 1), 100);
        return songRepository.findByTitleContainingIgnoreCase(q.trim(), PageRequest.of(0, pageSize))
                .map(SongResponse::from)
                .getContent();
    }
}
