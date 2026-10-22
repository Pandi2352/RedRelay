# 13 Sprint plan

18 one-week sprints: 17 build sprints that follow the phases in [11 Roadmap](11-roadmap.md), plus one buffer.
The plan assumes one developer working with AI agents.

| | |
|---|---|
| Start | Monday 26 Oct 2026 |
| End | Sunday 28 Feb 2027 (buffer included) |
| Sprint length | 1 week (Monday → Sunday) |
| Planned capacity | ~20 story points per sprint. Re-check after Sprint 2 and adjust |
| Points scale | 1 = under an hour · 2 = half a day · 3 = a day · 5 = two days · 8 = split it |

## How each sprint runs

| Day | Ritual |
|---|---|
| Monday | **Planning**: re-read the sprint section below, move stories to "In progress", read the related docs |
| Daily | Work one story at a time. Run the quality gate before each commit. Use `/review` or the reviewer subagents |
| Saturday | **Demo**: deploy, then click through the demo script on the live URL |
| Sunday | **Retro**: tick off completed items, record actual points, move unfinished stories forward, update docs and ADRs |

Story IDs are `S<sprint>-<n>`. Tags: **BE** backend · **FE** frontend · **OPS** infra/CI · **DOC** docs · **QA** tests.

## Definition of done (every story)

- [ ] Follows `AGENTS.md`: reuse first, nothing generic left inside a feature or module, files under 250 lines, no magic values
- [ ] Backend: DTO validation, Swagger documented, guards and roles applied, tenant-scoped
- [ ] Frontend: tokens only, `rounded-md`, no shadows, tight spacing, loading/empty/error states, keyboard focus works
- [ ] Unit tests for logic; e2e/integration test for new endpoints
- [ ] `lint`, `typecheck`, and `test` pass in the app that changed, and CI is green
- [ ] Related doc in `docs/` updated
- [ ] Deployed (from Sprint 2 onward) and included in the Saturday demo

## Skeleton already delivered (22 Oct 2026)

These are done, so Sprints 1 and 2 have spare capacity. Pull in work from the next sprint.

| Story | Status |
|---|---|
| S1-1 | Done except `git init` and commit conventions |
| S1-2, S1-3, S1-4, S1-6 | Done |
| S1-5 | Done (`BaseRepository`, `baseSchemaOptions`, pagination DTOs and utils) |
| S1-8 | Test helpers and health e2e done; hospitals e2e comes with S1-7 |
| S2-1 | Done (`cn`, theme, fonts, lint boundaries) |
| S2-2 | Done (Button, IconButton, Input, Select, Textarea, Field, Card, Badge, Skeleton, EmptyState, ErrorState, Spinner, PageHeader) |
| S2-3, S2-4 | Done (store, router, providers, AppShell, theme toggle, `api:types`) |
| S2-6 | Done (Hospitals and requests features: list, create, and detail pages using RTK Query) |
| S2-7 | CI workflow and Dockerfile done; deploy still to do |

## Milestones

| Milestone | After sprint | Proof |
|---|---|---|
| M1 Skeleton live | S2 | Hospital + request CRUD on Vercel + Render |
| M2 Real users | S4 | Login, roles, hospital approval |
| M3 Matching | S6 | Map shows eligible donors near a hospital |
| M4 Dispatch engine (MVP core) | S8 | Waves fire, accept race is safe |
| M5 Live system | S10 | Realtime board, en-route marker, chat |
| M6 Complete platform | S15 | Notifications, caching, webhooks, payments, dashboards |
| M7 Production | S17 | Hardened, PWA, Playwright flow, README |

---

## Sprint 1 — Foundations: backend kit and repo (26 Oct – 1 Nov)

**Goal:** a NestJS API with the reusable `common/` kit and Hospital CRUD running locally.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S1-1 | OPS | Git repo, `.gitignore`, `.editorconfig`, conventional commits, `docker-compose.yml` (Mongo replica set + Redis) | 2 |
| S1-2 | BE | Nest scaffold, strict tsconfig, ESLint + Prettier, path aliases, `nestjs-pino` logging | 2 |
| S1-3 | BE | `config/`: zod env schema, `registerAs` namespaces, `.env.example`, fail fast on bad env | 2 |
| S1-4 | BE | `common/`: `AllExceptionsFilter`, `ResponseEnvelopeInterceptor`, error codes, `ParseObjectIdPipe` | 3 |
| S1-5 | BE | `common/database`: `BaseRepository<T>`, base schema options (timestamps, `id` instead of `_id`), pagination DTOs | 3 |
| S1-6 | BE | Swagger setup (CLI plugin, `/docs`, `/docs-json`), `@ApiStandardErrors`, `@ApiPaginatedResponse` | 2 |
| S1-7 | BE | Hospitals module: schema + 2dsphere index, repository, service, DTOs, CRUD controller | 3 |
| S1-8 | QA | Jest + `mongodb-memory-server` helper in `common/testing`; e2e test for hospitals CRUD | 3 |

**Total 20** · **Demo:** `docker compose up`, create and list hospitals in Swagger UI; an invalid body returns the standard error format.

## Sprint 2 — Foundations: frontend kit, requests, deploy (2 – 8 Nov)

**Goal:** Vite app with the shared UI kit, BloodRequest CRUD end to end, and both apps deployed. → **M1**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S2-1 | FE | Vite + React + TS strict, Tailwind v4, copy `theme.css`, fonts, `cn()`, ESLint with import boundaries | 2 |
| S2-2 | FE | `shared/ui` set 1: Button, IconButton, Input, Select, Textarea, Field, Card, Badge, Skeleton, EmptyState, ErrorState, Spinner | 5 |
| S2-3 | FE | `app/`: store, typed hooks, router, providers; `shared/api/baseApi`; `env.ts`; `ROUTES` constants; AppShell layout with dark mode toggle | 3 |
| S2-4 | FE | `npm run api:types` (openapi-typescript) wired to backend Swagger | 1 |
| S2-5 | BE | Requests module: schema, `requests.rules.ts` state machine plus transition tests, CRUD | 3 |
| S2-6 | FE | Hospitals and requests features: list, create, and detail pages using RTK Query | 3 |
| S2-7 | OPS | GitHub Actions CI (lint, typecheck, test, build for both apps); backend Dockerfile; deploy to Render + Vercel + Atlas M0 | 3 |

**Total 20** · **Demo:** on the live URL, create a hospital and post a request. Check light and dark mode at 360px wide.

## Sprint 3 — Auth core (9 – 15 Nov)

**Goal:** email/password and Google login with secure sessions.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S3-1 | BE | Users module; argon2 hashing; register and login | 2 |
| S3-2 | BE | JWT access token (15 min) + rotating refresh cookie with reuse detection; `/auth/refresh`, `/auth/logout` | 5 |
| S3-3 | BE | `JwtAuthGuard` global, `@Public`, `@CurrentUser` in `common/` | 2 |
| S3-4 | BE | Email verification + password reset with tokens; `infra/mail` interface + Resend/Brevo adapter | 3 |
| S3-5 | BE | Google OAuth (passport) linked to an existing email | 3 |
| S3-6 | FE | Auth feature: login, register, verify, forgot/reset pages; `baseQueryWithReauth`; `RequireAuth` guard | 5 |

**Total 20** · **Demo:** register, verify email, log in, refresh the page and stay logged in, log out. Then sign in with Google.

## Sprint 4 — Roles, tenants, hospital verification (16 – 22 Nov)

**Goal:** four roles, hospital memberships, and platform approval before a hospital can post. → **M2**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S4-1 | BE | `@Roles` + `RolesGuard`; memberships module (invite, accept, remove); `X-Hospital-Id` tenant resolution | 5 |
| S4-2 | BE | Tenant scoping in `BaseRepository` (`scoped(hospitalId)`); a request from another tenant returns 404 | 3 |
| S4-3 | BE | `infra/storage` Cloudinary adapter; verification document upload; admin approve/reject endpoints | 3 |
| S4-4 | BE | Only verified hospitals can post requests (guard + test) | 1 |
| S4-5 | FE | Hospital onboarding: create hospital, upload docs, show status; staff invite screen | 3 |
| S4-6 | FE | Platform admin: pending hospitals queue, review documents, approve/reject; `RequireRole` | 3 |
| S4-7 | FE | `shared/ui` set 2: Table, Dialog, Drawer, Tabs, DropdownMenu, Toast | 2 |

**Total 20** · **Demo:** a hospital admin signs up and uploads documents. Posting is blocked until the platform admin approves. Then staff post a request.

## Sprint 5 — Donor profile and eligibility (23 – 29 Nov)

**Goal:** donor profiles and fully tested server-side eligibility rules.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S5-1 | BE | Donor profile schema (GeoJSON location, blood group, availability, preferences), CRUD for own profile | 3 |
| S5-2 | BE | `donors.rules.ts`: compatibility map (all 64 pairs tested), `isEligible()` returning reasons, 90-day boundary tests | 5 |
| S5-3 | BE | Donations module (history), sets `lastDonationAt` | 2 |
| S5-4 | BE | Response DTOs never return the home location (privacy test) | 1 |
| S5-5 | FE | Donor onboarding: blood group, date of birth, weight, availability toggle, notification preferences | 3 |
| S5-6 | FE | Donor home: eligibility card ("eligible again on …" with reasons), donation history | 3 |
| S5-7 | FE | `shared/hooks`: useGeolocation, useDisclosure, useDebounce, useMediaQuery, plus tests | 3 |

**Total 20** · **Demo:** a donor registers with location. Recording a donation flips them to "not eligible until …".

## Sprint 6 — Geospatial matching and maps (30 Nov – 6 Dec)

**Goal:** find eligible donors near a hospital and show them on a map. → **M3**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S6-1 | BE | Dispatch module: `findCandidates()` using `$geoNear` + compatibility + eligibility filter, sorted by distance and exact match | 5 |
| S6-2 | BE | Endpoint for staff: count of eligible donors per radius band (no identities) | 2 |
| S6-3 | FE | `shared/ui` Map wrapper (react-leaflet, OSM attribution, token-styled markers) | 3 |
| S6-4 | FE | Address picker: Nominatim search, debounced to 1 request per second, click map to set point | 3 |
| S6-5 | FE | Request detail: hospital marker, radius rings, eligible donor counts per ring | 3 |
| S6-6 | QA | Seed script: 500 fake donors around a city for demos and tests | 2 |
| S6-7 | DOC | Update the data model doc and ADR: Redis hosting choice, after measuring command usage | 2 |

**Total 20** · **Demo:** with seeded data, open a request and see "12 eligible donors within 5 km, 31 within 10 km".

## Sprint 7 — Dispatch engine part 1: waves (7 – 13 Dec)

**Goal:** posting a request starts timed waves that widen the radius.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S7-1 | BE | `infra/queue`: BullMQ module, queue name constants, worker flag | 2 |
| S7-2 | BE | DispatchWave + DonorResponse schemas and repositories | 2 |
| S7-3 | BE | Wave processor: find candidates, record wave, mark donors alerted, emit `dispatch.wave_sent`, schedule the next wave (deterministic jobId) | 5 |
| S7-4 | BE | Stop on terminal states, remove pending jobs; `MAX_WAVES` escalation event; request expiry job | 3 |
| S7-5 | BE | Domain events with EventEmitter2: `request.created`, `request.updated`, `dispatch.*` | 2 |
| S7-6 | QA | Wave tests: idempotent rerun, stops when fulfilled, excludes donors already alerted | 3 |
| S7-7 | FE | Request detail: wave timeline (wave number, radius, sent and timeout times) | 3 |

**Total 20** · **Demo:** post a request with a 1-minute test timeout and watch waves 1→2→3 appear on the timeline.

## Sprint 8 — Dispatch engine part 2: accept race (14 – 20 Dec)

**Goal:** donors accept or decline, and exactly the needed units are confirmed. → **M4 (MVP core)**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S8-1 | BE | Accept endpoint: atomic `$inc` with conditions inside a transaction; status update; standby for late acceptors (409 `REQUEST_FULL`) | 5 |
| S8-2 | BE | Decline endpoint; declined donors excluded from later waves | 1 |
| S8-3 | QA | Concurrency test: 10 parallel accepts on a 2-unit request → exactly 2 confirmed | 3 |
| S8-4 | BE | Contact details revealed only to confirmed donors and their hospital (response DTO + test) | 2 |
| S8-5 | BE | Mark arrived / donation complete → Donation record, `lastDonationAt`, eligibility reminder job | 3 |
| S8-6 | FE | Donor alert screen: blood group, distance, hospital, urgency; "Accept and get directions" / "Decline" (44px buttons) | 3 |
| S8-7 | FE | Request status strip component (signature element): unit segments, blood group, minutes since posting | 3 |

**Total 20** · **Demo:** from two browsers, three donors accept a 2-unit request. Two are confirmed and one gets the "already covered" message.

## Sprint 9 — Realtime part 1: sockets and live board (21 – 27 Dec) · holiday week, lower capacity

**Goal:** authenticated sockets and a live hospital board.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S9-1 | BE | `infra/realtime`: Socket.io gateway on `/rt`, `WsAuthGuard`, Redis adapter | 3 |
| S9-2 | BE | Room authorization on every join (`user:`, `hospital:`, `request:`) + hijack test | 3 |
| S9-3 | BE | Event bridge: domain events → socket emits | 2 |
| S9-4 | FE | `SocketProvider`, `useSocketEvent`, token refresh on reconnect | 3 |
| S9-5 | FE | Live board: socket events patch the RTK Query cache; new rows animate in (reduced motion respected) | 3 |

**Total 14** · **Demo:** a donor accepts on a phone and the hospital board updates without a reload.

## Sprint 10 — Realtime part 2: en route, chat, recovery (28 Dec – 3 Jan) · holiday week

**Goal:** live donor location, request chat, and recovery of missed events. → **M5**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S10-1 | BE | `donor.location`: throttled, latest position only in Redis with TTL, cleared on completion | 3 |
| S10-2 | FE | Donor "I'm on my way" toggle; sends position every 10 s or after 50 m of movement; hospital map marker | 3 |
| S10-3 | BE | Chat module: messages, read markers, unread counts | 3 |
| S10-4 | FE | Request chat panel with unread badge | 3 |
| S10-5 | BE/FE | Event `seq` per room, replay buffer, refetch fallback; reconnecting warning bar | 3 |

**Total 15** · **Demo:** a donor walks with a phone and the marker moves. Chat messages arrive both ways. Turn Wi-Fi off and on and the board catches up.

## Sprint 11 — Notifications (4 – 10 Jan)

**Goal:** donors are reliably alerted, without being spammed.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S11-1 | BE | `infra/push`: VAPID keys, subscription storage, send through the notifications queue | 3 |
| S11-2 | BE | Notifications module: in-app rows, channel choice, email fallback | 3 |
| S11-3 | BE | Rules: quiet hours (critical urgency overrides), daily cap, preferences + tests | 3 |
| S11-4 | FE | Service worker push handling (`vite-plugin-pwa` injectManifest); permission prompt after onboarding, not on page load | 3 |
| S11-5 | FE | Notification center: bell with count, list, mark as read | 3 |
| S11-6 | FE | Notification settings page | 2 |
| S11-7 | QA | Tests: cap reached → no alert; quiet hours → deferred; push failure → email sent | 3 |

**Total 20** · **Demo:** close the browser, post a request, and the phone receives a push. The fourth alert of the day is not sent.

## Sprint 12 — Caching and rate limiting (11 – 17 Jan)

**Goal:** faster reads, abuse protection, and measured numbers.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S12-1 | QA | k6 baseline: list requests, nearby counts, accept burst. Record p95 and RPS | 3 |
| S12-2 | BE | `infra/redis` cache-aside helper (get/set/invalidate by tag) | 3 |
| S12-3 | BE | Cache hospitals, compatibility inverse map, nearby counts; invalidate on change | 3 |
| S12-4 | BE | Throttler with Redis storage: request creation, OTP/reset, login; 429 + `Retry-After` | 3 |
| S12-5 | FE | Shared 429 handling: toast with wait time, button cooldown | 2 |
| S12-6 | QA | k6 rerun; before/after table in the README | 2 |
| S12-7 | BE | Mongo indexes reviewed with `explain()`; any collection scans fixed | 2 |

**Total 18** · **Demo:** k6 before/after table; the sixth request within 10 minutes is blocked with a clear message.

## Sprint 13 — Outgoing webhooks (18 – 24 Jan)

**Goal:** hospitals receive signed events with retries and a delivery log.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S13-1 | BE | HospitalWebhook CRUD, secret generated and encrypted at rest, event selection | 3 |
| S13-2 | BE | `common/utils` HMAC signing + `retryWithBackoff`; deliver processor with backoff (1m to 12h) | 5 |
| S13-3 | BE | WebhookDelivery log, manual resend endpoint | 2 |
| S13-4 | FE | Webhooks settings: add endpoint, show secret once, event checkboxes, delivery log table, resend | 5 |
| S13-5 | QA | Signature test; retry schedule test; receiver test using a local endpoint | 3 |
| S13-6 | DOC | Webhook consumer guide (verifying signatures) in the API docs | 2 |

**Total 20** · **Demo:** register a test receiver URL, post a request, and see `request.created` arrive signed. Break the receiver and watch the retries.

## Sprint 14 — Incoming webhooks and medical fund (25 – 31 Jan)

**Goal:** Razorpay test-mode donations with safe, idempotent webhook handling.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S14-1 | BE | `infra/payments` Razorpay adapter; create order endpoint | 3 |
| S14-2 | BE | Raw body for the webhook route; signature check; `WebhookEvent` idempotency store | 5 |
| S14-3 | BE | Handle `payment.captured` / `payment.failed` → Payment status; heavy work queued | 3 |
| S14-4 | FE | Medical fund page: amount, Razorpay checkout, success/failure states, receipt | 3 |
| S14-5 | QA | Duplicate event = one effect; bad signature = 400; out-of-order events handled | 3 |
| S14-6 | BE | Audit module: log the sensitive actions listed in the security doc | 3 |

**Total 20** · **Demo:** donate ₹500 in test mode. Resending the same webhook doesn't create a duplicate.

## Sprint 15 — Dashboards and analytics (1 – 7 Feb)

**Goal:** operational metrics for hospitals and the platform. → **M6**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S15-1 | BE | Analytics aggregations: average response time, fulfillment rate, units collected per hospital | 5 |
| S15-2 | BE | Platform: demand by area and blood group, donor retention, active hospitals; nightly report job | 3 |
| S15-3 | FE | `shared/ui` Stat + chart wrapper (token colors) | 2 |
| S15-4 | FE | Hospital dashboard | 3 |
| S15-5 | FE | Platform dashboard with demand heatmap (Leaflet heat layer) | 3 |
| S15-6 | FE | Audit log viewer for the platform admin (filter, paginate) | 2 |
| S15-7 | QA | Aggregation tests with fixed seed data | 2 |

**Total 20** · **Demo:** dashboards with seeded data; the heatmap shows O− demand clusters.

## Sprint 16 — Production hardening (8 – 14 Feb)

**Goal:** secure, observable, production-ready deployment.

| ID | Tag | Story | Pts |
|---|---|---|---|
| S16-1 | BE | Helmet, CORS allow-list, Mongo sanitization, `trust proxy`, cookie flags review | 3 |
| S16-2 | OPS | Sentry on both apps (source maps); pino log levels | 2 |
| S16-3 | BE | `/health` liveness + readiness (Mongo, Redis) | 1 |
| S16-4 | OPS | Production Docker image, Render deploy from CI, uptime ping, env checklist | 3 |
| S16-5 | QA | Security pass: go through the security doc's pitfalls table, one test per pitfall where missing | 5 |
| S16-6 | FE | Accessibility pass: keyboard-only walkthrough, contrast check, labels, 360px check on every screen | 3 |
| S16-7 | FE | Error boundary per route, 404 page, offline page | 3 |

**Total 20** · **Demo:** the Sentry dashboard shows a triggered error, `/health` is green, and a keyboard-only run through the core flow works.

## Sprint 17 — E2E, PWA, launch (15 – 21 Feb)

**Goal:** a polished, installable, documented portfolio project. → **M7**

| ID | Tag | Story | Pts |
|---|---|---|---|
| S17-1 | QA | Playwright: post request → donor accepts → arrived → fulfilled (two browser contexts) | 5 |
| S17-2 | FE | PWA: manifest, icons, install prompt, offline shell | 3 |
| S17-3 | QA | Final k6 run against production; numbers in the README | 2 |
| S17-4 | DOC | README: pitch, architecture diagram, screenshots, tech stack, k6 table, local setup, demo accounts | 3 |
| S17-5 | DOC | 2-minute demo video script and recording | 3 |
| S17-6 | QA | Bug bash: run every sprint demo script again on production | 3 |

**Total 19** · **Demo:** install the PWA on a phone and run the full flow live.

## Sprint 18 — Buffer (22 – 28 Feb)

Reserved for work that slipped, bugs found in the bug bash, and polish. If it is not needed, pick from
the stretch list in [11 Roadmap](11-roadmap.md) (blood stock summaries, donor badges, i18n).

---

## Dependencies

```
S1 kit → S2 CRUD + deploy → S3 auth → S4 roles/tenants → S5 donors → S6 geo → S7 waves → S8 accept
                                                                               ↓
                              S9–S10 realtime → S11 notifications → S12 cache/limits → S13–S14 webhooks → S15 dashboards → S16–S17 production
```

Notifications (S11) can start before realtime if S9 slips: waves already emit `dispatch.wave_sent`.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Free Redis command limits hit by BullMQ | Waves stop in production | Decide hosting in S6 (ADR) after measuring; tune `drainDelay`; Docker Redis locally |
| Render free tier sleeps | Delayed wave jobs fire late | Uptime ping during demos; document the limit honestly in the README |
| Transactions on Atlas M0 / memory server | Accept flow tests fail | Use the replica-set memory server from S1 |
| Web Push on iOS needs an installed PWA | Some donors get no push | Email fallback (S11); prompt to install |
| Nominatim / OSM usage policies | Blocked geocoding | Debounce, cache results, attribution, custom user agent |
| Scope creep | Late finish | Stretch items only in the buffer sprint |
| Holiday weeks (S9, S10) | Lower velocity | Already planned at 14–15 points |

## Tracking

Copy each sprint's stories into GitHub Issues (one milestone per sprint, labels `be`/`fe`/`ops`/`doc`/`qa`)
and a GitHub Projects board: Backlog → This sprint → In progress → Review → Done. Record actual points
in the retro notes below.

| Sprint | Planned | Done | Notes |
|---|---|---|---|
| S1 | 20 | | |
| S2 | 20 | | |
| S3 | 20 | | |
| S4 | 20 | | |
| S5 | 20 | | |
| S6 | 20 | | |
| S7 | 20 | | |
| S8 | 20 | | |
| S9 | 14 | | |
| S10 | 15 | | |
| S11 | 20 | | |
| S12 | 18 | | |
| S13 | 20 | | |
| S14 | 20 | | |
| S15 | 20 | | |
| S16 | 20 | | |
| S17 | 19 | | |
