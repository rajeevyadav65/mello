package com.melodia.music.entity;

import com.melodia.album.entity.Album;
import com.melodia.genre.entity.Genre;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "songs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "album_id", nullable = false)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;

    @Column(nullable = false)
    private String title;

    @Column(name = "duration_seconds", nullable = false)
    private int durationSeconds;

    @Column(name = "audio_object_key", nullable = false)
    private String audioObjectKey;

    @Column(name = "track_number")
    private Integer trackNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
