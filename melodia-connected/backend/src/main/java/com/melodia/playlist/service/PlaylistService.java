package com.melodia.playlist.service;

import com.melodia.exception.ApiException;
import com.melodia.music.dto.SongResponse;
import com.melodia.music.entity.Song;
import com.melodia.music.repository.SongRepository;
import com.melodia.playlist.dto.PlaylistRequest;
import com.melodia.playlist.dto.PlaylistResponse;
import com.melodia.playlist.entity.Playlist;
import com.melodia.playlist.entity.PlaylistSong;
import com.melodia.playlist.repository.PlaylistRepository;
import com.melodia.playlist.repository.PlaylistSongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;

    public PlaylistService(PlaylistRepository playlistRepository,
                            PlaylistSongRepository playlistSongRepository,
                            SongRepository songRepository) {
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
    }

    @Transactional
    public PlaylistResponse create(UUID userId, PlaylistRequest request) {
        Playlist playlist = Playlist.builder()
                .userId(userId)
                .title(request.title())
                .isPublic(request.isPublic())
                .build();
        playlist = playlistRepository.save(playlist);
        return PlaylistResponse.from(playlist, List.of());
    }

    @Transactional(readOnly = true)
    public List<PlaylistResponse> listForUser(UUID userId) {
        return playlistRepository.findByUserId(userId).stream()
                .map(playlist -> get(playlist.getId()))
                .toList();
    }

    public PlaylistResponse get(UUID playlistId) {
        Playlist playlist = requirePlaylist(playlistId);
        List<SongResponse> songs = playlistSongRepository.findByPlaylistIdOrderByPosition(playlistId)
                .stream().map(ps -> SongResponse.from(ps.getSong())).toList();
        return PlaylistResponse.from(playlist, songs);
    }

    @Transactional
    public PlaylistResponse update(UUID playlistId, UUID userId, PlaylistRequest request) {
        Playlist playlist = requirePlaylist(playlistId);
        assertOwner(playlist, userId);
        playlist.setTitle(request.title());
        playlist.setPublic(request.isPublic());
        playlistRepository.save(playlist);
        return get(playlistId);
    }

    @Transactional
    public void delete(UUID playlistId, UUID userId) {
        Playlist playlist = requirePlaylist(playlistId);
        assertOwner(playlist, userId);
        playlistRepository.delete(playlist);
    }

    @Transactional
    public void addSong(UUID playlistId, UUID userId, UUID songId) {
        Playlist playlist = requirePlaylist(playlistId);
        assertOwner(playlist, userId);

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> ApiException.notFound("SONG_NOT_FOUND", "Song not found"));

        int nextPosition = playlistSongRepository.findByPlaylistIdOrderByPosition(playlistId).size();

        PlaylistSong playlistSong = PlaylistSong.builder()
                .playlist(playlist)
                .song(song)
                .position(nextPosition)
                .build();
        playlistSongRepository.save(playlistSong);
    }

    @Transactional
    public void removeSong(UUID playlistId, UUID userId, UUID songId) {
        Playlist playlist = requirePlaylist(playlistId);
        assertOwner(playlist, userId);
        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
    }

    private Playlist requirePlaylist(UUID id) {
        return playlistRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("PLAYLIST_NOT_FOUND", "Playlist not found"));
    }

    private void assertOwner(Playlist playlist, UUID userId) {
        if (!playlist.getUserId().equals(userId)) {
            throw ApiException.forbidden("NOT_PLAYLIST_OWNER", "You do not own this playlist");
        }
    }
}
