package com.melodia.artist.dto;

import com.melodia.artist.entity.Artist;

import java.util.UUID;

public record ArtistResponse(
        UUID id,
        String name,
        String bio,
        String imageObjectKey,
        boolean verified
) {
    public static ArtistResponse from(Artist artist) {
        return new ArtistResponse(
                artist.getId(),
                artist.getName(),
                artist.getBio(),
                artist.getImageObjectKey(),
                artist.isVerified()
        );
    }
}
