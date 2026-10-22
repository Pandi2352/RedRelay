---
description: Plan and build a NestJS backend module end to end following RedRelay conventions
---

Build the backend module: $ARGUMENTS

1. Read `AGENTS.md`, the `nest-module` and `reusable-code` skills, `domain-rules` if donors/requests are involved, and the related doc in `docs/`.
2. Write a short plan: schema + indexes, endpoints (method, path, roles, rate limit), rules functions, events, jobs.
3. Add missing generic pieces to `backend/src/common` or `backend/src/infra` first.
4. Build in order: schema → repository → rules (+ unit tests) → service → DTOs → controller → module.
5. Swagger on every endpoint; response DTOs only; tenant scoping from the authenticated membership.
6. Add unit + e2e tests, then run `npm run lint && npm run typecheck && npm test` in `backend/`.
7. Review against the `reusable-code` checklist; fix issues.
8. Update `docs/05-data-model.md` / `docs/07-api-conventions.md` if needed.
