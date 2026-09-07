package com.melodia.streaming.controller;

import com.melodia.exception.ApiException;
import com.melodia.music.entity.Song;
import com.melodia.music.service.SongService;
import com.melodia.streaming.service.StreamingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Serves audio with HTTP Range support so browsers/ExoPlayer can seek without
 * downloading the whole file. Never returns a raw storage URL - every byte is
 * proxied through this endpoint so entitlement can be checked on every request,
 * not just at "download start".
 *
 * This is intentionally shaped so a future move to segmented HLS delivery
 * (.m3u8 + .ts chunks) would only change what happens inside this controller,
 * not the public contract the clients call.
 */
@RestController
@RequestMapping("/api/v1/songs")
public class StreamingController {

    private static final Pattern RANGE_PATTERN = Pattern.compile("bytes=(\\d*)-(\\d*)");
    private static final long DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB if no end given

    private final SongService songService;
    private final StreamingService streamingService;

    public StreamingController(SongService songService, StreamingService streamingService) {
        this.songService = songService;
        this.streamingService = streamingService;
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<InputStreamResource> stream(@PathVariable UUID id, HttpServletRequest request) {
        Song song = songService.getEntity(id);

        // TODO: validate subscription/ownership entitlement here before serving bytes.

        try {
            long fileSize = streamingService.getObjectSize(song.getAudioObjectKey());
            String rangeHeader = request.getHeader(HttpHeaders.RANGE);

            long start = 0;
            long end = fileSize - 1;

            if (rangeHeader != null) {
                Matcher matcher = RANGE_PATTERN.matcher(rangeHeader);
                if (matcher.matches()) {
                    String startGroup = matcher.group(1);
                    String endGroup = matcher.group(2);

                    start = startGroup.isEmpty() ? 0 : Long.parseLong(startGroup);
                    end = endGroup.isEmpty()
                            ? Math.min(start + DEFAULT_CHUNK_SIZE - 1, fileSize - 1)
                            : Long.parseLong(endGroup);
                } else {
                    throw ApiException.badRequest("INVALID_RANGE", "Malformed Range header");
                }
            }

            if (start > end || end >= fileSize) {
                return ResponseEntity.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
                        .header(HttpHeaders.CONTENT_RANGE, "bytes */" + fileSize)
                        .build();
            }

            long contentLength = end - start + 1;
            InputStreamResource resource = new InputStreamResource(
                    streamingService.getObjectRange(song.getAudioObjectKey(), start, contentLength));

            HttpStatus status = rangeHeader != null ? HttpStatus.PARTIAL_CONTENT : HttpStatus.OK;

            return ResponseEntity.status(status)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.valueOf("audio/mpeg").toString())
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(contentLength))
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + fileSize)
                    .body(resource);

        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to stream song " + id, e);
        }
    }
}
