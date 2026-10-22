# RedRelay

Real-time emergency blood donor network. A verified hospital posts an urgent blood request; RedRelay
alerts eligible donors nearby in widening waves and confirms exactly the units needed.

Docs: [docs/README.md](docs/README.md) · Sprint plan: [docs/13-sprint-plan.md](docs/13-sprint-plan.md) ·
Agent rules: [AGENTS.md](AGENTS.md)

## Run locally

Requires Node 22 LTS (20.19+ works) and Docker.

```bash
# 1. Mongo (replica set) + Redis. If a port is taken: MONGO_PORT=27018 REDIS_PORT=6380 docker compose up -d
docker compose up -d

# 2. API → http://localhost:3000  (Swagger: /docs, health: /health)
cd backend
cp .env.example .env
npm install
npm run start:dev

# 3. Web → http://localhost:5173
cd ../frontend
cp .env.example .env
npm install
npm run api:types   # regenerate API types while the API is running
npm run dev
```

## Quality gate

| App | Command |
|---|---|
| backend | `npm run lint && npm run typecheck && npm test && npm run test:e2e` |
| frontend | `npm run lint && npm run typecheck && npm test && npm run build` |

CI runs the same steps on every push and pull request (`.github/workflows/ci.yml`).

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · Redux Toolkit (RTK Query) · React Router ·
NestJS · MongoDB (Mongoose) · Swagger. Free services only — see [docs/03-tech-stack.md](docs/03-tech-stack.md).
