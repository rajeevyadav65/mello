# Melodia — System Architecture (Phase 0)

Ad-free music streaming platform: Spring Boot modular monolith + React web + Kotlin/Compose Android. Built strictly around legally authorized/licensed content — no DRM circumvention, no scraping.

---

## A. System Architecture (Conceptual)

```
                     ┌───────────────┐        ┌──────────────────┐
                     │   React Web   │        │  Kotlin Android   │
                     └───────┬───────┘        └────────┬──────────┘
                             │                          │
                             └────────────┬─────────────┘
                                          ▼
                                 ┌──────────────────┐
                                 │   API Gateway /   │
                                 │   Reverse Proxy   │  (rate limiting, TLS, routing)
                                 └────────┬──────────┘
                                          ▼
                        ┌──────────────────────────────────┐
                        │      Spring Boot Modular Monolith  │
                        │  auth · user · music · artist ·    │
                        │  album · playlist · library ·      │
                        │  streaming · search · voice ·      │
                        │  recommendation · lyrics ·          │
                        │  notification · subscription ·      │
                        │  analytics · admin                  │
                        └───┬──────────┬───────────┬─────────┘
                            ▼          ▼           ▼
                     ┌───────────┐┌──────────┐┌────────────┐
                     │PostgreSQL ││ MongoDB  ││Elasticsearch│
                     │(core data)││(events)  ││  (search)   │
                     └───────────┘└──────────┘└────────────┘
                            │
                            ▼
                        ┌────────┐        ┌────────────────┐
                        │ Redis  │        │ S3 / MinIO      │
                        │(cache) │        │ (audio, images) │
                        └────────┘        └────────┬────────┘
                                                    ▼
                                              CDN / Audio Delivery
```

Cross-cutting: Kafka (future event bus for catalog sync/analytics), scheduled jobs (catalog sync, notifications), Actuator + Prometheus/Grafana for observability.

---

## B. Module Breakdown

| Module | Responsibility |
|---|---|
| `auth` | Registration, login, JWT/refresh tokens, OAuth2, password reset, email verification |
| `user` | Profile, preferences, devices |
| `music` | Song entity, metadata, genres |
| `artist` | Artist profiles, follows |
| `album` | Album metadata, song grouping |
| `playlist` | CRUD, reordering, public/private, sharing |
| `library` | Liked songs, saved albums/playlists, recently played |
| `streaming` | Range-request audio delivery, signed URLs, access validation |
| `search` | Elasticsearch integration, autocomplete, fuzzy matching |
| `voice` | STT abstraction, intent classification, command dispatch |
| `recommendation` | Deterministic → weighted → pluggable ML scoring |
| `lyrics` | Timestamped lyric lines, sync with playback |
| `notification` | New releases, playlist updates, subscription events |
| `subscription` | Plans, payment integration, entitlements |
| `analytics` | Event capture (play/skip/like/search) into MongoDB |
| `admin` | Catalog management, user management, moderation |
| `common` / `config` / `security` / `exception` | Shared DTOs, mappers, global config, JWT filters, `@RestControllerAdvice` |

Each module: `controller → service → repository → entity/dto/mapper`, internal package-private where possible to keep monolith boundaries honest for a future microservice split.

---

## C. ER Diagram (Core Relational Model)

```
User ──1:N── Playlist ──1:N── PlaylistSong ──N:1── Song
 │                                                     │
 ├─1:N── Like ─────────────────────────────────N:1────┘
 ├─1:N── Follow ───────────────────────────N:1── Artist
 ├─1:N── ListeningHistory(ref, Mongo) ─────N:1── Song
 ├─1:1── Subscription
 ├─1:N── Device
 └─N:M── Role (via user_roles)

Artist ──1:N── Album ──1:N── Song ──N:1── Genre
Song ──1:1── Lyrics ──1:N── LyricLine
```

Key notes:
- `Song` is the hub entity: linked to `Album`, `Artist` (via album), `Genre`, `Lyrics`, and referenced by `PlaylistSong`, `Like`, `ListeningHistory`.
- `PlaylistSong` is a join entity carrying `position` (for ordering) — not a bare many-to-many.
- `ListeningHistory` lives conceptually per-user/song but is stored in MongoDB, not Postgres (see D/E rationale).

---

## D. PostgreSQL Schema (Core/Transactional)

```sql
users(id, email UNIQUE, password_hash, display_name, created_at, is_verified)
roles(id, name)                         -- USER, ADMIN, ARTIST
user_roles(user_id FK, role_id FK)

artists(id, name, bio, image_object_key, verified)
albums(id, artist_id FK, title, release_date, cover_object_key)
genres(id, name)
songs(id, album_id FK, genre_id FK, title, duration_seconds,
      audio_object_key, track_number, created_at)

playlists(id, user_id FK, title, is_public, created_at)
playlist_songs(id, playlist_id FK, song_id FK, position)

likes(id, user_id FK, song_id FK, created_at, UNIQUE(user_id, song_id))
follows(id, user_id FK, artist_id FK, created_at, UNIQUE(user_id, artist_id))

subscriptions(id, user_id FK, plan, status, current_period_end)
payments(id, subscription_id FK, amount, status, provider_ref, created_at)
devices(id, user_id FK, device_type, push_token, last_seen_at)

lyrics(id, song_id FK UNIQUE)
lyric_lines(id, lyrics_id FK, timestamp_ms, text, line_order)
```

Indexing priorities: `songs(album_id)`, `songs(genre_id)`, composite `(user_id, song_id)` uniques on `likes`/`follows`, `playlist_songs(playlist_id, position)` for ordered reads.

---

## E. MongoDB Collections (High-Volume/Event Data)

```
listening_history { userId, songId, playedAt, msPlayed, completed, device }
search_history    { userId, query, resultsCount, timestamp, source: TEXT|VOICE }
recommendation_events { userId, songId, source, servedAt, clicked }
analytics_events  { userId, eventType, entityId, metadata, timestamp }
```

**Why Mongo here and not Postgres:** these are high write-throughput, append-mostly, schema-flexible event streams that are queried in bulk (aggregation, time windows) rather than joined transactionally against relational entities. Forcing them into Postgres would bloat core tables and hurt OLTP performance on the actual transactional data (users, playlists, payments) that genuinely needs ACID guarantees and joins.

---

## F. Redis Caching Strategy

| Key pattern | Purpose | TTL |
|---|---|---|
| `song:{id}` | Hot song metadata | 1h |
| `trending:global` / `trending:{genre}` | Precomputed trending lists (refreshed by scheduled job) | 15m |
| `recs:{userId}` | Cached recommendation output | 30m |
| `session:{refreshTokenId}` | Refresh token/session metadata | token lifetime |
| `ratelimit:{userId}:{endpoint}` | Sliding-window counters | 1m window |
| `recent:{userId}` | Recently played ring buffer | 24h |

Cache-aside pattern throughout: read cache → miss → read DB → populate cache. Invalidate `song:{id}` on admin metadata updates.

---

## G. API Endpoint Specification (v1, representative)

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/songs/{id}
GET    /api/v1/songs/{id}/stream        (Range-aware)
GET    /api/v1/albums/{id}
GET    /api/v1/artists/{id}

GET    /api/v1/search?q=
GET    /api/v1/search/autocomplete?q=

POST   /api/v1/playlists
GET    /api/v1/playlists/{id}
PUT    /api/v1/playlists/{id}
DELETE /api/v1/playlists/{id}
POST   /api/v1/playlists/{id}/songs/{songId}
DELETE /api/v1/playlists/{id}/songs/{songId}

POST   /api/v1/library/likes/{songId}
GET    /api/v1/library/liked-songs
POST   /api/v1/follows/{artistId}

POST   /api/v1/voice/query          (audio or transcript in)
GET    /api/v1/recommendations

Admin (ROLE_ADMIN only):
POST   /api/v1/admin/songs
PUT    /api/v1/admin/songs/{id}
POST   /api/v1/admin/catalog/sync
```

All responses are DTOs — entities never serialize directly. Errors follow the `@RestControllerAdvice` shape already specified (timestamp/status/error/message/path).

---

## H. Voice Search Architecture

```
Audio/Text Input
      │
      ▼
Speech-to-Text Adapter (interface — provider swappable)
      │
      ▼
Normalized Transcript
      │
      ▼
Intent Classifier  →  Intent Enum (SEARCH, PLAY_SONG, PAUSE, NEXT, ...)
      │
      ▼
Slot Extraction (song/artist/playlist name, volume delta)
      │
      ▼
Command Dispatcher → routes to Search / Player / Library services
```

The STT provider sits behind a `SpeechToTextProvider` interface (Adapter pattern) so any vendor can be swapped without touching the intent layer. Intent classification starts as rule/keyword-based for MVP (deterministic, testable) with a clear seam to swap in an NLU model later.

---

## I. Music Streaming Architecture

```
Client → GET /songs/{id}/stream (Range: bytes=...)
   → Streaming Controller validates auth + entitlement
   → Resolves object storage key
   → Requests byte range from S3/MinIO
   → Returns 206 Partial Content with Content-Range headers
```

Security considerations:
- Never expose raw object-storage URLs; stream through the backend or issue short-lived signed URLs.
- Validate the requester's entitlement (subscription/ownership) before every stream, not just at first request.
- Rate-limit stream endpoint per user/device to deter scraping.
- Design the response path so HLS (segmented `.m3u8` + `.ts`) can replace direct range-streaming later without changing the public API contract.

---

## J. Recommendation Architecture

```
Stage 1 (MVP): Deterministic — frequency counts over listening history
   → most-played artists/genres → candidate songs → dedupe against liked

Stage 2: Weighted scoring
   score = w1*artistSimilarity + w2*genreSimilarity + w3*likeWeight
         + w4*playFrequency + w5*recency + w6*popularity

Stage 3: Pluggable ML service
   RecommendationStrategy interface → JavaHeuristicStrategy (default)
                                    → MLServiceStrategy (calls external Python service)
```

Strategy pattern lets Stage 3 be introduced by adding an implementation, not rewriting callers.

---

## K. React Architecture

- **Vite + TypeScript** app shell, **Tailwind** for styling with an original Melodia visual identity (not Spotify's).
- **TanStack Query** for server state (songs, playlists, search) with cache invalidation on mutations.
- **Zustand** for client/player state (current track, queue, playback position) — kept separate from server state.
- **React Router** for page navigation: Login, Register, Home, Search, Artist, Album, Playlist, Library, Liked Songs, Recently Played, Recommendations, Profile, Settings, Subscription.
- Player is a persistent component outside route transitions (survives navigation).

---

## L. Android Architecture

```
Compose UI → ViewModel (StateFlow) → Repository → Retrofit → Spring Boot API
                                            │
                                            ▼
                                        Room (offline cache/downloads)

Playback: Compose UI → ViewModel → Media3/ExoPlayer → Streaming API
```

Hilt for DI; Coroutines/Flow for async; Room stores downloaded-track metadata and drives offline playback; sync of listening history to backend happens on reconnect via a WorkManager job.

---

## M. Security Architecture

- Passwords: bcrypt/Argon2 hashing, never stored plain.
- JWT access tokens (short-lived) + refresh tokens (rotated, stored hashed server-side) — access tokens stay stateless for scaling; refresh tokens are revocable, closing the main weakness of pure stateless JWT.
- Spring Security filter chain for role-based authorization (`USER`/`ADMIN`/`ARTIST`).
- CORS locked to known frontend origins; CSRF not needed for stateless JWT APIs but documented for any cookie-based flows.
- Input validation via Bean Validation on all DTOs.
- Rate limiting (Redis-backed) on auth and streaming endpoints.
- Signed/short-lived URLs or backend-proxied streaming for object storage — never public bucket access to audio.
- Secrets via environment variables / secret manager, never in source.

---

## N. Docker Architecture

`docker-compose.yml` services for local dev: `app` (Spring Boot), `postgres`, `mongo`, `redis`, `elasticsearch` (or `opensearch`), `minio`. Each with named volumes for persistence and a shared network. Spring profiles (`local`, `docker`, `prod`) swap connection endpoints (e.g., MinIO in dev vs. cloud object storage in prod) without code changes.

---

## O. Development Roadmap (Phases)

1. **Phase 1 — Foundation**: project skeleton, Postgres schema, `auth` module (register/login/JWT), global exception handling, Docker Compose baseline.
2. **Phase 2 — Core Music Domain**: `music`/`artist`/`album`/`genre` CRUD, admin endpoints, object storage integration for artwork/audio metadata.
3. **Phase 3 — Streaming**: range-request streaming, entitlement checks, MinIO integration.
4. **Phase 4 — Playlist & Library**: playlists, likes, follows, recently played.
5. **Phase 5 — Search**: Elasticsearch indexing + query APIs, autocomplete.
6. **Phase 6 — Voice**: STT adapter interface, intent classifier, command dispatch.
7. **Phase 7 — Recommendations**: deterministic engine, then weighted scoring.
8. **Phase 8 — Frontend (React)**: auth flow, player, search, library pages.
9. **Phase 9 — Android**: Compose UI, ExoPlayer integration, offline downloads.
10. **Phase 10 — Notifications, Subscriptions, Analytics, Admin Panel polish.**
11. **Phase 11 — Observability, CI/CD, performance hardening, security review.**

---

## P. Recommended Git Repository Structure

```
melodia/
├── backend/            (Spring Boot modular monolith)
│   └── src/main/java/com/melodia/{auth,user,music,...}
├── frontend-web/        (React + Vite)
├── android/             (Kotlin/Compose)
├── infra/
│   ├── docker-compose.yml
│   └── .github/workflows/
└── docs/
    ├── architecture.md
    └── api-spec.yaml
```

Commit style: `feat(auth): implement JWT authentication`, `feat(streaming): add range-request support`, etc., grouped per module/phase.

---

## Q. MVP vs Advanced Features

**MVP (Phases 1–5, 8):**
Auth, song/artist/album/genre CRUD, streaming with range requests, playlists, likes/follows, text search with autocomplete, basic React web client, admin CRUD.

**Advanced (later phases):**
Voice search/commands, weighted + ML-based recommendations, offline downloads with encryption, lyrics sync, notifications (push/email), subscriptions/payments, Kafka-based catalog sync, Android app, full observability stack (Prometheus/Grafana), HLS streaming.

---

*End of Phase 0. No implementation code has been written. Say **"Start Phase 1"** to begin the `auth` module and foundational setup.*
