---
description: Plan and build a frontend feature end to end following RedRelay conventions
---

Build the frontend feature: $ARGUMENTS

1. Read `AGENTS.md`, the `react-feature`, `redrelay-ui`, and `reusable-code` skills, and the related doc in `docs/`.
2. Write a short plan: screens (audience + primary action), ASCII wireframe, endpoints used, shared pieces reused, new shared pieces needed.
3. Add missing generic pieces to `frontend/src/shared` first.
4. Build the feature folder: api (injectEndpoints), schemas, components, hooks, pages, routes.
5. Include loading, empty, error states. Tokens only, rounded-md, no shadows, dense spacing.
6. Add tests, then run `npm run lint && npm run typecheck && npm test` in `frontend/`.
7. Review against the `reusable-code` checklist and the `redrelay-ui` hard rules; fix issues.
8. Update the related doc in `docs/` if behavior changed.
