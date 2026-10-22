# 07 API conventions

## Basics

- Base path `/api/v1`. Swagger UI at `/docs`, JSON at `/docs-json` (feeds `frontend/src/generated/api.d.ts`).
- JSON only, `camelCase` fields, ISO-8601 UTC dates, ids as strings.
- Plural nouns: `/requests`, `/requests/:id/accept` (actions as sub-resources with POST).

## Auth

- `Authorization: Bearer <accessToken>` (15 min, kept in memory on the client).
- Refresh token: httpOnly, `Secure`, `SameSite=None` (cross-site Vercel → Render) cookie on `/api/v1/auth/refresh`, rotated on each use, reuse detection revokes the family.
- Every route is protected by default; `@Public()` opts out.
- `@Roles(...)` + tenant scope from the active membership (`X-Hospital-Id` header selects which membership, validated server-side).

## Responses

```json
// 200 single
{ "data": { "id": "…", "status": "open" } }
// 200 list
{ "data": [ … ], "meta": { "page": 1, "limit": 20, "total": 134 } }
// error
{ "error": { "code": "VALIDATION_FAILED", "message": "Units needed must be between 1 and 10.",
             "details": [{ "field": "unitsNeeded", "message": "must be between 1 and 10" }], "requestId": "…" } }
```

| Status | When |
|---|---|
| 400 | Validation (`VALIDATION_FAILED`) |
| 401 | Missing/expired token |
| 403 | Role or tenant not allowed; hospital not verified |
| 404 | Not found **or not in your tenant** (don't leak existence) |
| 409 | State conflict (`REQUEST_FULL`, `INVALID_TRANSITION`) |
| 429 | Rate limited, with `Retry-After` |

## Pagination, filtering, sorting

`?page=1&limit=20&sort=-createdAt&status=open,partially_matched`. `limit` max 100.
`PaginationQueryDto` and `PaginatedResponseDto<T>` in `common/dto` — reuse them.

## Swagger requirements

Every endpoint: `@ApiTags`, response type, `@ApiStandardErrors()`, auth decorator, and an example for
non-obvious bodies. CI fails if `/docs-json` cannot be generated.

## Outgoing webhooks (to hospitals)

- Headers: `X-RedRelay-Event`, `X-RedRelay-Delivery`, `X-RedRelay-Timestamp`, `X-RedRelay-Signature: sha256=<hmac(secret, timestamp + "." + body)>`.
- Retries with exponential backoff (1m, 5m, 30m, 2h, 12h), then `failed`. Manual resend from the UI.
- Body: `{ id, type, createdAt, data }`.

## Incoming webhooks (Razorpay)

- Raw body preserved for that route only; verify `X-Razorpay-Signature` before parsing.
- Store `providerEventId` in `WebhookEvent` (unique) — duplicate = 200 no-op.
- Always respond 2xx quickly; heavy work goes to a queue.
