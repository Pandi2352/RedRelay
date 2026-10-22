# 10 Security

## Roles and permissions

| Action | Donor | Staff | Hosp. admin | Platform admin |
|---|---|---|---|---|
| Edit own donor profile | ✓ | | | |
| Accept / decline request | ✓ (if alerted) | | | |
| Create / cancel request | | ✓ own hospital | ✓ own hospital | |
| Mark donation complete | | ✓ | ✓ | |
| Manage staff, webhooks | | | ✓ | |
| Upload verification docs | | | ✓ | |
| Approve hospitals, audit log, suspend users | | | | ✓ |

Enforced by `JwtAuthGuard` + `RolesGuard` + tenant scope in repositories. UI hiding is cosmetic only.

## Pitfalls and how we handle them

| Risk | Defense |
|---|---|
| Two donors take the last unit | Conditional atomic `$inc`; concurrency test |
| Donor privacy | Response DTOs; no home location ever returned; contact revealed only after confirmation; live location TTL |
| Fake / prank SOS | Only verified hospitals post; rate limit 5 requests / 10 min per hospital user |
| Notification fatigue | Daily alert cap, quiet hours, per-channel preferences |
| Socket room hijacking | Server-side authorization on every join; no client-named rooms |
| Eligibility bypass | Checked on the server at alert and at accept time |
| Brute force / OTP abuse | Throttler (Redis store) on login, OTP, reset; 429 + `Retry-After` |
| NoSQL injection | `whitelist` validation, sanitize `$`/`.` keys, never pass raw query objects to Mongo |
| Token theft | Short access tokens in memory; rotating refresh cookie with reuse detection |
| Webhook spoofing | HMAC on raw body, timestamp tolerance 5 min, idempotent event store |
| Cross-tenant reads | `hospitalId` from membership, 404 for other tenants |
| Secrets | `.env` never committed; `.env.example` lists keys; webhook secrets encrypted at rest |

## Headers and transport

`helmet` defaults, CORS allow-list (Vercel domain + localhost), `trust proxy` on Render, HTTPS only in production.

## Audit log

Recorded for: hospital approval/rejection, staff add/remove, request cancel, webhook create/delete,
role change, account suspension.
