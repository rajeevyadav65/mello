package com.melodia.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Placeholder for the "Automatic New Music Updates" pipeline described in the
 * architecture doc: Authorized Catalog -> Sync Service -> Validate -> Store ->
 * Index -> Notify. Wire an actual catalog client into syncNow() once a licensed
 * source is chosen; the scheduled job and manual trigger are already in place.
 */
@RestController
@RequestMapping("/api/v1/admin/catalog")
@Component
public class CatalogSyncController {

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> syncNow() {
        runSync();
        return ResponseEntity.accepted().body("Catalog sync triggered");
    }

    @Scheduled(cron = "0 0 3 * * *") // nightly at 3am - adjust once a real catalog source is wired in
    public void scheduledSync() {
        runSync();
    }

    private void runSync() {
        // TODO: fetch new releases from an authorized catalog/API, validate metadata,
        // persist Song/Album/Artist records, index into Elasticsearch, then notify
        // followers via the notification module.
    }
}
