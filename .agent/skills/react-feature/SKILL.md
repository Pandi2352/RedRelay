---
name: react-feature
description: Frontend architecture for RedRelay (React 19, Vite, TypeScript, Tailwind v4, Redux Toolkit + RTK Query, React Router). Use when adding a page, route, feature folder, Redux slice, API endpoint, form, hook, or socket listener in frontend/.
---

# React feature pattern

## Folder structure

```
frontend/src/
├── main.tsx                 # mounts <AppProviders><AppRouter/></AppProviders>
├── app/                     # wiring only — no UI, no business logic
│   ├── store.ts             # configureStore, combines slices + baseApi
│   ├── hooks.ts             # useAppDispatch, useAppSelector (typed)
│   ├── router.tsx           # createBrowserRouter from feature route arrays
│   └── providers.tsx        # Redux Provider, ThemeProvider, Toaster, SocketProvider
├── shared/                  # PROJECT-AGNOSTIC — copyable to any project
│   ├── ui/                  # primitives (see redrelay-ui skill → components.md)
│   ├── form/                # FormField adapters for react-hook-form + zod
│   ├── hooks/               # useDebounce, useMediaQuery, useDisclosure, useGeolocation, usePagination
│   ├── lib/                 # cn, http/baseQuery, storage, format (date, number, distance), error parsing
│   ├── api/                 # baseApi (createApi with empty endpoints), baseQueryWithReauth, tag types
│   ├── config/              # env.ts (zod-validated import.meta.env)
│   ├── constants/           # http status, storage keys, breakpoints
│   ├── layouts/             # AppShell, AuthLayout, blank layout
│   ├── guards/              # RequireAuth, RequireRole route wrappers
│   ├── types/               # ApiEnvelope<T>, PaginatedEnvelope<T>, ApiErrorBody
│   ├── store/               # ui.slice.ts (theme) — generic client state only
│   ├── pages/               # NotFoundPage, RouteErrorPage
│   ├── test/                # vitest setup
│   └── styles/              # theme.css, index.css, fonts.ts
├── features/                # RedRelay domain
│   └── <feature>/
│       ├── api/             # <feature>Api = baseApi.injectEndpoints({...})
│       ├── components/      # feature-specific composites, one per file
│       ├── hooks/           # feature hooks composing api + state
│       ├── pages/           # route components (thin: layout + composed components)
│       ├── schemas/         # zod schemas for forms
│       ├── store/           # <feature>.slice.ts (only for client state not in RTK Query)
│       ├── constants.ts
│       ├── types.ts
│       ├── routes.tsx       # RouteObject[] exported to app/router.tsx
│       └── index.ts         # public surface of the feature
└── generated/api.d.ts       # openapi-typescript output — never edit
```

Features: `auth`, `donor`, `hospital`, `requests`, `dispatch`, `chat`, `notifications`, `webhooks`,
`payments`, `analytics`, `admin`.

## Dependency rules

- `shared` imports nothing from `features` or `app`.
- A feature imports from `shared` and from another feature's `index.ts` only (never deep paths).
- `app` imports features' `routes.tsx` and slices.
- Enforce with `eslint-plugin-boundaries` or `import/no-restricted-paths`.

## State: where data lives

| Data | Home |
|---|---|
| Server data (requests, donors, hospitals) | **RTK Query** cache — never copy into a slice |
| Auth session (access token, user, role) | `auth.slice.ts` (token in memory, never localStorage) |
| UI state shared across routes (theme, sidebar) | `shared` `ui.slice.ts` |
| Form state | react-hook-form, local to the form |
| Component-only state | `useState` |
| Realtime events | socket listener → `api.util.updateQueryData` / `invalidateTags` |

## API layer

- One `baseApi` in `shared/api/baseApi.ts`, with no domain tags. Sprint 3 adds `baseQueryWithReauth`
  (on 401 → call `/auth/refresh` with the httpOnly cookie → retry once → else logout).
- Each feature adds its tags and endpoints (see `features/status/api/statusApi.ts`):
  `baseApi.enhanceEndpoints({ addTagTypes: ['Request'] }).injectEndpoints({ endpoints: (b) => ({...}) })`.
- Responses are enveloped: single → `transformResponse: (r: ApiEnvelope<T>) => unwrapData(r)`;
  lists keep `{ data, meta }` (`PaginatedEnvelope<T>`). Show errors with `getErrorMessage(error)`.
- Types: `type Request = components['schemas']['RequestResponseDto']` in the feature's `types.ts`.
- Request/response types come from `generated/api.d.ts` (`npm run api:types` runs `openapi-typescript`
  against `http://localhost:3000/docs-json`). Do not hand-write DTO interfaces.
- Tags: `providesTags` / `invalidatesTags` per entity id, so mutations refresh exactly what changed.
- Optimistic updates for accept/decline with rollback on error.

## Forms

- Schema in `features/<f>/schemas/*.schema.ts` (zod), type with `z.infer`.
- `useForm({ resolver: zodResolver(schema) })` + shared `Field` components. No ad-hoc label/error markup.
- Server validation errors map onto fields via `shared/lib/applyServerErrors.ts`.

## Routing

- Each feature exports `RouteObject[]`; pages are lazy (`lazy: () => import('./pages/X')`).
- Paths come from `shared/constants/routes.ts` (`ROUTES.requests.detail(id)`), never string literals.
- Role gating with `<RequireRole roles={['hospital_admin']}>` — the server still enforces it.

## Realtime

- `SocketProvider` (in `shared/lib/socket`) owns one Socket.io client, authenticates with the access
  token, reconnects, and exposes `useSocketEvent(event, handler)`.
- Feature hooks subscribe (`useRequestLiveUpdates(requestId)`) and patch the RTK Query cache.
- Join rooms via server-acknowledged events; never assume a join succeeded.

## Checklist for a new feature

1. Read the matching doc in `docs/` (e.g. `06-dispatch-engine.md`).
2. Search `shared/` for hooks, UI, and utils you can reuse. Missing generic piece → add to `shared` first.
3. Add endpoints via `injectEndpoints` using generated types.
4. Build components (≤ 150 lines each), then thin pages.
5. Add routes with constants and guards.
6. Loading / empty / error states using `Skeleton`, `EmptyState`, `ErrorState`.
7. Tests: Vitest + Testing Library for hooks and components with logic; MSW for API mocking.
8. `npm run lint && npm run typecheck && npm test`.
