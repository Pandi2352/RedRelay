# 03 Tech stack (free only)

Rule: every runtime service has a free tier or is self-hostable; every library is open source.
Free-tier limits change — check the provider's pricing page before relying on a number below.

## Frontend

| Need | Choice |
|---|---|
| Build | Vite + React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 with our token theme (`shared/styles/theme.css`) |
| Variants | `class-variance-authority`, `clsx`, `tailwind-merge` |
| Accessible primitives | Radix UI |
| Icons | `lucide-react` |
| State + data | Redux Toolkit + RTK Query |
| Routing | React Router (data router) |
| Forms | react-hook-form + zod |
| API types | `openapi-typescript` from the backend Swagger JSON |
| Maps | Leaflet + react-leaflet + OpenStreetMap tiles (respect the OSM tile usage policy; add attribution) |
| Geocoding | Nominatim (1 request/second limit — debounce the address picker) |
| Realtime | `socket.io-client` |
| PWA | `vite-plugin-pwa` (Workbox) |
| Fonts | `@fontsource-variable/public-sans`, `@fontsource-variable/archivo` |
| Tests | Vitest, Testing Library, MSW, Playwright |

## Backend

| Need | Choice |
|---|---|
| Framework | NestJS + TypeScript (strict) |
| Database | MongoDB via `@nestjs/mongoose` |
| Validation | `class-validator`, `class-transformer`; env via zod |
| Docs | `@nestjs/swagger` (CLI plugin) at `/docs` and `/docs-json` |
| Auth | `@nestjs/jwt`, `passport-jwt`, `passport-google-oauth20`, `argon2` for hashing |
| Rate limiting | `@nestjs/throttler` with Redis storage |
| Cache | `ioredis` + small cache-aside service in `infra/redis` |
| Queues | `@nestjs/bullmq` + BullMQ |
| Realtime | `@nestjs/websockets` + Socket.io + `@socket.io/redis-adapter` |
| Events | `@nestjs/event-emitter` |
| Security | `helmet`, CORS allow-list, `cookie-parser`, Mongo sanitization |
| Logging | `nestjs-pino` |
| Tests | Jest, Supertest, `mongodb-memory-server`; k6 for load |

## Services

| Need | Service | Note |
|---|---|---|
| Database | MongoDB Atlas M0 | 512 MB, shared cluster, supports transactions |
| API hosting | Render free web service | Sleeps after ~15 min idle; cold start ~30–60 s |
| Frontend hosting | Vercel Hobby | Non-commercial use |
| Redis | Docker locally; for deploy see below | |
| Email | Resend or Brevo free | Daily caps — use for verification, reset, and fallback alerts only |
| Push | Web Push with VAPID keys | No provider needed |
| Files | Cloudinary free | Hospital verification documents, avatars |
| Payments | Razorpay test mode | No real money |
| Login | Google OAuth | Free |
| Errors | Sentry Developer plan | |
| CI | GitHub Actions | Free minutes for public repos |
| Uptime ping | cron-job.org or UptimeRobot free | Keeps Render awake during demos |

## Free-tier caveats that affect the design

- **BullMQ on a request-metered Redis.** BullMQ issues Redis commands continuously (polling, heartbeats).
  Upstash's free tier has a monthly command cap that BullMQ can burn through quickly. Options:
  Render's free Key Value (Redis-compatible, small, not persistent) in the same region as the API, or
  Upstash for cache/rate-limit only with BullMQ tuned (`drainDelay`, fewer workers). Decide in an ADR
  once you measure command usage.
- **Render sleeps.** While the service sleeps, delayed wave jobs don't fire. Acceptable for a portfolio
  demo; mitigate with an uptime ping. On wake, the worker processes overdue delayed jobs.
- **No SMS.** Push + email only.
- **Atlas M0** has connection and throughput limits — use one connection pool, lean queries, proper indexes.

## Adding a dependency

1. Check `shared/` / `common/` already covers it.
2. Must be maintained, typed, MIT/Apache-like license, and free.
3. Prefer one well-known library over several small ones. Record big choices as an ADR.
