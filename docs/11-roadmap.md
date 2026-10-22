# 11 Roadmap (~17 weeks)

Build and deploy each phase before starting the next. Each phase ends with: docs updated, tests green, deployed.

| # | Weeks | Phase | Deliverables |
|---|---|---|---|
| 1 | 1–2 | Foundations | Repo, Docker Compose (Mongo + Redis), Nest skeleton with `common/` kit (config, filter, envelope interceptor, base repository, pagination, Swagger), Vite skeleton with `shared/` kit (theme, UI primitives, baseApi, router, layouts). Hospital + BloodRequest CRUD. CI lint/typecheck/test |
| 2 | 3–4 | Auth and roles | JWT + rotating refresh cookie, Google OAuth, email verification, password reset, four roles, memberships, hospital document upload (Cloudinary), platform admin approval |
| 3 | 5 | Donor profile and eligibility | Blood group, GeoJSON location, availability, history; `donors.rules.ts` eligibility + compatibility with full unit tests |
| 4 | 6 | Geo matching | 2dsphere indexes, `$geoNear` search, Leaflet map, address picker (Nominatim, debounced), distance sorting |
| 5 | 7–8 | Dispatch engine | State machine, waves with delayed BullMQ jobs, atomic accept, decline exclusion, concurrency test |
| 6 | 9–10 | Realtime | Authenticated sockets, rooms, live board, en-route marker (throttled, Redis latest-only), request chat with unread counts, missed-event recovery |
| 7 | 11 | Notifications | Web Push (VAPID), email fallback, in-app center, quiet hours, preferences, daily cap |
| 8 | 12 | Caching and rate limiting | Cache-aside for hospitals and compatibility, Redis throttler on request/OTP/login with `Retry-After`; k6 before/after numbers in README |
| 9 | 13–14 | Webhooks in and out | Outgoing signed events with backoff, delivery log, resend; Razorpay test-mode fund with raw-body signature check and idempotent handlers |
| 10 | 15 | Dashboards | Hospital (response time, fulfillment, units), platform (demand heatmap, retention, active hospitals), audit log UI |
| 11 | 16–17 | Production | Helmet, CORS, sanitization, Sentry, `/health`, Dockerfile, deploy (Vercel + Render + Atlas), Playwright "post → accept → fulfilled", PWA, README with architecture diagram |

## Changes from the original plan

- Express → **NestJS** (modules, DI, guards, Swagger built in).
- TanStack Query → **Redux Toolkit + RTK Query** (same caching model, plus global client state).
- Zod on the backend → **class-validator DTOs** (Swagger reads them); zod stays for env and frontend forms.
- Project renamed LifeLine → **RedRelay**.

## Stretch ideas

Blood bank stock summaries, donor badges/streaks, multilingual UI (i18next), SMS when a free route exists.
