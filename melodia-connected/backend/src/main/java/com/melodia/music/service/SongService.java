package com.melodia.music.service;

import com.melodia.album.entity.Album;
import com.melodia.album.repository.AlbumRepository;
import com.melodia.exception.ApiException;
import com.melodia.genre.entity.Genre;
import com.melodia.genre.repository.GenreRepository;
import com.melodia.music.dto.SongRequest;
import com.melodia.music.dto.SongResponse;
import com.melodia.music.entity.Song;
import com.melodia.music.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final AlbumRepository albumRepository;
    private final GenreRepository genreRepository;

    public SongService(SongRepository songRepository, AlbumRepository albumRepository, GenreRepository genreRepository) {
        this.songRepository = songRepository;
        this.albumRepository = albumRepository;
        this.genreRepository = genreRepository;
    }

    @Transactional
    public SongResponse create(SongRequest request) {
        Album album = albumRepository.findById(request.albumId())
                .orElseThrow(() -> ApiException.notFound("ALBUM_NOT_FOUND", "Album not found"));

        Genre genre = null;
        if (request.genreId() != null) {
            genre = genreRepository.findById(request.genreId())
                    .orElseThrow(() -> ApiException.notFound("GENRE_NOT_FOUND", "Genre not found"));
        }

        Song song = Song.builder()
                .album(album)
                .genre(genre)
                .title(request.title())
                .durationSeconds(request.durationSeconds())
                .audioObjectKey(request.audioObjectKey())
                .trackNumber(request.trackNumber())
                .build();

        return SongResponse.from(songRepository.save(song));
    }

    public SongResponse get(UUID id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("SONG_NOT_FOUND", "Song not found"));
        return SongResponse.from(song);
    }

    public Song getEntity(UUID id) {
        return songRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("SONG_NOT_FOUND", "Song not found"));
    }
}
