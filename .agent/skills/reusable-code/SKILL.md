---
name: reusable-code
description: Decide where code belongs and keep it reusable across RedRelay and future projects. Use before creating any new file, function, component, hook, util, config, guard, or DTO; when you notice similar code twice; or when reviewing changes for duplication and oversized files.
---

# Reusable-first code

Goal: every generic piece written for RedRelay can be copied into the next project with no edits.
`frontend/src/shared` and `backend/src/common` (+ `backend/src/infra` adapters) are that kit.

## Where does this code go?

Ask in order and stop at the first yes:

1. **Does it already exist?** Search first: `shared/`, `common/`, `infra/`, then the feature. Extend it with a
   parameter or variant instead of copying it.
2. **Would a different app (a shop, a clinic queue) use it unchanged?** → `shared/*` (web) or `common/*` (api).
   Examples: `cn`, `formatDistance`, `useDebounce`, `Button`, `Field`, `PaginationQueryDto`, `BaseRepository`,
   `hmacSign`, `retryWithBackoff`, `RolesGuard`, `ResponseEnvelopeInterceptor`.
3. **Does it talk to an outside service?** → `backend/src/infra/<service>` behind an interface
   (`MailService`, `StorageService`), so the provider can be swapped (Resend ↔ Brevo) by config.
4. **Is it RedRelay logic used by several features/modules?** → the owning feature/module exports it
   via its `index.ts` / module `exports`. Example: blood compatibility lives in `donors` and is exported.
5. **Otherwise** → inside the feature/module that uses it.

## Make generic code actually generic

- No domain words in `shared/` or `common/` (no "donor", "blood", "hospital"). Pass them in as parameters or generics.
- Inputs as arguments, not imports of app state. A hook takes options; a util takes values.
- Config through parameters or injected config — never hard-coded URLs, limits, or keys.
- Types are generic (`Paginated<T>`, `BaseRepository<TDoc>`).
- Each shared item has a short JSDoc line saying what it does, and a unit test if it contains logic.

## Size and shape

- One exported thing per file; file named after it (`use-debounce.ts` → `useDebounce`, `Button.tsx`).
- Soft limit 150 lines, hard limit 250. Over the limit → split by responsibility
  (sub-components, a `*.rules.ts`, a `*.helpers.ts`, a custom hook).
- Functions ≤ ~40 lines, ≤ 3 positional params (else an options object).
- Constants, enums, and messages in `constants` files. No literal repeated twice.

## Naming

| Kind | Web | API |
|---|---|---|
| Files | `PascalCase.tsx` components, `camelCase.ts` hooks/utils | `kebab-case.<type>.ts` (`create-request.dto.ts`) |
| Hooks | `useThing` | — |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` |
| Types | `PascalCase`, no `I` prefix | same |

## Extraction trigger

Second occurrence of similar logic or markup → extract now. When extracting:
1. Move it to the right layer (questions above).
2. Replace both call sites.
3. Add/adjust tests.
4. If it is a UI primitive, add it to the catalog in `.claude/skills/redrelay-ui/references/components.md`.

## Review checklist

- [ ] No duplicate of something in `shared/` / `common/`
- [ ] No domain words in the shared layer
- [ ] No file over 250 lines; no component doing fetch + state + heavy markup at once
- [ ] No magic strings/numbers; no `process.env` / `import.meta.env` outside config
- [ ] No hex colors, raw palette classes, shadows, or non-md radius in UI
- [ ] Features import each other only via `index.ts`
