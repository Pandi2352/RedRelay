# 02 Architecture

## System

```mermaid
flowchart LR
  subgraph Client
    WEB[React PWA<br/>Vite · Redux Toolkit · RTK Query]
    SW[Service worker<br/>Web Push]
  end
  subgraph API[NestJS on Render]
    HTTP[REST controllers<br/>Swagger /docs]
    WS[Socket.io gateway]
    WK[BullMQ workers]
    EV[(EventEmitter2<br/>domain events)]
  end
  DB[(MongoDB Atlas M0)]
  R[(Redis<br/>cache · rate limit · queues · socket adapter)]
  EXT[Resend/Brevo · Cloudinary · Razorpay · Google OAuth]
  HOOK[Hospital webhook endpoints]

  WEB -- HTTPS --> HTTP
  WEB <-- WSS --> WS
  SW -. push .- WK
  HTTP --> DB
  HTTP --> R
  HTTP --> EV
  EV --> WK
  EV --> WS
  WK --> DB
  WK --> R
  WK --> EXT
  WK --> HOOK
  EXT -- incoming webhook --> HTTP
```

One NestJS process runs HTTP, sockets, and workers on the free tier. Workers are separate providers, so
they can move to their own process later without code changes (`WORKERS_ENABLED` flag).

## Request lifecycle

```mermaid
sequenceDiagram
  participant S as Hospital staff
  participant API
  participant Q as BullMQ
  participant D as Donors
  S->>API: POST /requests
  API->>API: validate, verified hospital, rate limit
  API->>API: emit request.created
  API->>Q: dispatch wave 1 (now) + timeout job (10 min)
  Q->>D: push / email to nearest 10 eligible
  D->>API: POST /requests/:id/accept
  API->>API: atomic $inc if units remain
  API-->>S: socket: donor.accepted
  Q->>Q: timeout fires → not fulfilled → wave 2 (wider radius)
  S->>API: POST /donations (mark complete)
  API-->>S: request.fulfilled · outgoing webhook
```

## Module map (backend)

| Module | Owns |
|---|---|
| auth | JWT access + refresh cookie, Google OAuth, email verification, password reset |
| users | Accounts, roles |
| hospitals, memberships | Tenants, staff membership, verification documents |
| donors | Profile, location, availability, eligibility rules, compatibility |
| requests | BloodRequest CRUD and state machine |
| dispatch | Waves, geo matching, timeout jobs |
| responses | Accept/decline, atomic confirmation |
| donations | Completion records, history |
| chat | Per-request messages, unread counts |
| notifications | Push, email, in-app center, preferences, quiet hours, caps |
| webhooks | Outgoing endpoints, signed deliveries, retries, delivery log |
| payments | Razorpay medical fund, incoming webhook, idempotency |
| analytics | Aggregations for dashboards |
| audit | Sensitive action log |
| health | `/health` liveness + readiness |

Modules talk through exported services and domain events. Notifications, webhooks, sockets, and audit
**listen** to events (`request.created`, `donor.accepted`, `request.fulfilled`…) — the requests module
does not know they exist.

## Frontend shape

`app/` wires store, router, providers. `shared/` is a project-agnostic kit (UI, hooks, http, config).
`features/` hold RedRelay screens. Server state lives in RTK Query; sockets patch its cache.
Details: [04 Folder structure](04-folder-structure.md).

## Deployment

| Piece | Where |
|---|---|
| Frontend | Vercel (static build) |
| API + sockets + workers | Render free web service (Docker) |
| Database | MongoDB Atlas M0 |
| Redis | See [03 Tech stack](03-tech-stack.md) — free-tier caveats matter for BullMQ |
| Errors | Sentry free |
| CI | GitHub Actions |
