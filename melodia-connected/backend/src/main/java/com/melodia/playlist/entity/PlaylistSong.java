package com.melodia.playlist.entity;

import com.melodia.music.entity.Song;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Deliberately a first-class entity (not a bare @ManyToMany) because playlists
 * need ordering (`position`) - a plain join table can't carry that column
 * cleanly through JPA.
 */
@Entity
@Table(name = "playlist_songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlaylistSong {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(nullable = false)
    private int position;
}
