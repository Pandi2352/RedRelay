# 04 Folder structure

Two layers in each app:

- **Reusable kit** — `frontend/src/shared`, `backend/src/common`, `backend/src/infra`. No RedRelay words.
  Copy these folders to start the next project.
- **Domain** — `frontend/src/features/*`, `backend/src/modules/*`. Depends on the kit, never the reverse.

```
RedRelay/
├── AGENTS.md  CLAUDE.md  GEMINI.md
├── docker-compose.yml          # mongo + redis for local dev
├── .github/workflows/ci.yml
├── scripts/sync-agents.mjs
├── docs/
├── frontend/
│   ├── index.html  vite.config.ts  tsconfig.json  eslint.config.js
│   └── src/
│       ├── main.tsx
│       ├── app/                store.ts  hooks.ts  router.tsx  providers.tsx
│       ├── shared/
│       │   ├── ui/             button/  input/  field/  card/  dialog/  table/  badge/  skeleton/ ...
│       │   ├── form/           react-hook-form adapters
│       │   ├── hooks/          useDebounce  useDisclosure  useMediaQuery  useGeolocation ...
│       │   ├── lib/            cn.ts  format/  storage.ts  socket/  errors.ts
│       │   ├── api/            baseApi.ts  baseQueryWithReauth.ts  tags.ts
│       │   ├── config/         env.ts
│       │   ├── constants/      routes.ts  storage-keys.ts
│       │   ├── layouts/        AppShell  AuthLayout
│       │   ├── guards/         RequireAuth  RequireRole
│       │   ├── types/
│       │   └── styles/         theme.css  fonts.ts  index.css
│       ├── features/
│       │   ├── auth/  donor/  hospital/  requests/  dispatch/  chat/
│       │   └── notifications/  webhooks/  payments/  analytics/  admin/
│       └── generated/api.d.ts
└── backend/
    ├── nest-cli.json  tsconfig.json  Dockerfile
    ├── test/                   e2e specs
    └── src/
        ├── main.ts  app.module.ts
        ├── config/
        ├── common/             constants decorators guards interceptors filters pipes dto database utils testing types
        ├── infra/              database redis queue mail push storage payments realtime
        └── modules/
            ├── auth  users  hospitals  memberships  donors  requests  dispatch  responses
            └── donations  chat  notifications  webhooks  payments  analytics  audit  health
```

Inner layout of a frontend feature: see `.claude/skills/react-feature/SKILL.md`.
Inner layout of a backend module: see `.claude/skills/nest-module/SKILL.md`.

## File rules

- One exported thing per file; soft limit 150 lines, hard limit 250.
- Component files `PascalCase.tsx`; hooks/utils `camelCase.ts`; backend `kebab-case.<type>.ts`.
- Each folder may have one `index.ts` that defines its public surface.
- Tests sit next to code (`*.test.ts(x)` web, `__tests__/*.spec.ts` api); e2e in `backend/test` and `frontend/e2e`.
