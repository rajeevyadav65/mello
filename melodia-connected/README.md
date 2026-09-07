# Melodia

Ad-free, full-stack music streaming platform: Spring Boot modular monolith backend,
React mobile web client. Built strictly around
legally authorized/licensed content — no DRM circumvention, no scraping.

This repository is a **working scaffold**, not the complete feature set described
in the master architecture doc (voice search, ML recommendations, notifications,
subscriptions/payments, full Elasticsearch/Kafka wiring, offline downloads, etc.
are stubbed or left as clearly marked `TODO`s). What's implemented actually runs
end-to-end: register → login → browse artists/albums/songs → build playlists →
like songs/follow artists → stream audio with seeking.

See `docs/architecture.md` (from the earlier planning pass) for the full target
design and phased roadmap. This scaffold covers roughly Phases 1–4.

---

## What's implemented

**Backend (`/backend`)**
- JWT auth (access + rotating/revocable refresh tokens), BCrypt password hashing
- Role-based authorization (`USER`, `ARTIST`, `ADMIN`) via Spring Security
- Artist / Album / Genre / Song CRUD (public reads, admin-protected writes)
- Playlists: create/update/delete, add/remove songs with ordering, ownership checks
- Library: like/unlike songs, follow/unfollow artists, liked-songs list
- Audio streaming with real HTTP Range support (206 Partial Content, seeking) via MinIO/S3
- Centralized error handling (`@RestControllerAdvice`) with a consistent JSON error shape
- OpenAPI/Swagger UI, Spring Actuator health endpoint
- A scheduled + manually-triggerable catalog-sync stub (wire in a licensed catalog source later)

**Frontend (`/frontend-web`)**
- Vite + React + TypeScript + Tailwind, original (non-Spotify) visual identity
- Axios client with JWT attach + automatic refresh-token retry on 401
- Zustand player store (queue, shuffle, repeat, play/pause/next/prev)
- Login, Register, Home pages; persistent player bar; React Router wired up
- Installable PWA metadata and an offline app shell for a phone-friendly experience

**Not implemented yet** (left as TODOs, matching the roadmap phases): Elasticsearch
search/autocomplete, voice search/commands, weighted/ML recommendations, lyrics,
notifications, subscriptions/payments, full offline music downloads,
CI/CD, and most tests beyond the context-load smoke test.

---

## Project structure

```
melodia/
├── backend/            Spring Boot modular monolith (Maven)
├── frontend-web/        Installable React mobile web app (Maven build module)
└── docker-compose.yml   Postgres, MongoDB, Redis, Elasticsearch, MinIO, backend
```

---

## Running it

### 1. Infrastructure + backend (Docker)

```bash
cd melodia
docker compose up --build
```

This starts Postgres, MongoDB, Redis, Elasticsearch, MinIO, and the Spring Boot
backend on **http://localhost:8082**.

- Swagger UI: http://localhost:8082/api/v1/swagger-ui.html
- Health check: http://localhost:8082/actuator/health
- MinIO console: http://localhost:9001 (user/pass: `minioadmin` / `minioadmin`)

**Before streaming will work**, create the MinIO bucket named `melodia-media`
(via the console at :9001, or `mc mb local/melodia-media`) and upload an audio
file, then reference its object key when creating a `Song` via the admin API.

To run the backend without Docker:

```bash
cd melodia
mvn spring-boot:run -pl backend
```
(requires Postgres/Mongo/Redis/MinIO reachable at the hosts in `application.yml`,
or override via the `DB_HOST`, `MONGO_HOST`, `REDIS_HOST`, `MINIO_ENDPOINT` env vars)

### 2. Build the mobile web app with Maven

```bash
cd melodia
mvn package
```

This Maven command builds the Java 21 backend and the installable mobile web app.
The web build is written to `frontend-web/dist`. Serve it over HTTPS (or localhost),
then choose **Install app** in the phone browser.

The project uses Maven only and targets Java 21. The former native Android module
is intentionally excluded from this Maven-only delivery: Android APKs require
Google's Gradle-based build system.

## Frontend API connection

The React client in `frontend-web/mello---global-music-streaming` calls the Spring
Boot API at `http://localhost:8082/api/v1`. Its catalog, search, sign-in, likes,
and playlists are connected to the backend. Copy `.env.example` to `.env.local`
to override that address for another environment.

---

## Trying the API directly

```bash
# Register
curl -X POST http://localhost:8082/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123","displayName":"You"}'

# Login (returns accessToken + refreshToken)
curl -X POST http://localhost:8082/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"password123"}'

# Create an artist (requires an ADMIN-role JWT - promote a user's role directly
# in the `user_roles` table for local testing)
curl -X POST http://localhost:8082/api/v1/artists \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Artist","bio":"..."}'
```

---

## Next steps (suggested order)

1. Wire Elasticsearch indexing into Song create/update and add `/search` endpoints.
2. Add the `voice` module: an STT provider interface + rule-based intent classifier.
3. Build out the recommendation module (Stage 1 deterministic scoring first).
4. Flesh out remaining React pages (Search, Artist, Album, Library, Profile, etc.).
5. Add JUnit/Mockito service+controller tests and a GitHub Actions CI pipeline.
