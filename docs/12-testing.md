# 12 Testing

| Level | Web | API |
|---|---|---|
| Unit | Vitest — utils, hooks, slices | Jest — `*.rules.ts`, services with mocked repos |
| Component / integration | Testing Library + MSW | Supertest + `mongodb-memory-server` (replica set for transactions) |
| End to end | Playwright: post request → donor accepts → fulfilled | — |
| Load | — | k6: request creation, accept race, list endpoints |

## Must-have tests

- Eligibility rules and 90-day boundary; compatibility matrix (64 pairs).
- Request state machine transitions.
- Concurrent accept race (10 parallel → exactly `unitsNeeded` confirmed).
- Webhook idempotency (same event twice → one effect) and signature rejection.
- Socket room authorization (non-member join is refused).
- Rate limit returns 429 with `Retry-After`.

## Conventions

- Factories in `common/testing` / `shared/test` build valid objects with overrides — no copy-pasted fixtures.
- Tests describe behavior: `it('confirms only two donors when ten accept a two-unit request')`.
- No network in unit tests; external adapters are mocked at the interface.

## CI (GitHub Actions)

On every PR: install → lint → typecheck → unit + integration tests (both apps) → build → generate Swagger
JSON. Playwright and k6 run on demand or nightly.
