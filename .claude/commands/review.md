---
description: Review current changes for reuse, UI rules, domain rules, and tests
---

Review the current changes ($ARGUMENTS).

1. List changed files.
2. Reuse pass: apply the `reusable-code` checklist (duplication, placement, file size, magic values, boundaries).
3. UI pass (if `frontend/` changed): apply the `redrelay-ui` hard rules (radius, shadows, padding, tokens, states, a11y, copy).
4. Domain pass (if donors/requests/dispatch changed): check `domain-rules` — eligibility on the server, atomic accepts, privacy, state transitions.
5. Tests: confirm new logic has tests and the quality gate passes.
6. Report findings as file:line + rule + fix, most important first.
