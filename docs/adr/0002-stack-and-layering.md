# ADR 0002: Stack and reusable layering

- Status: accepted
- Date: 2026-10-22

## Context

RedRelay is a portfolio project that should also seed future projects, using free resources only.

## Decision

- Frontend: React + Vite + TypeScript + Tailwind v4 + Redux Toolkit (RTK Query) + React Router.
- Backend: NestJS + TypeScript + MongoDB (Mongoose) + Swagger, BullMQ, Socket.io, Redis.
- Two separate apps (`frontend/`, `backend/`), each split into a project-agnostic kit
  (`shared/`, `common/` + `infra/`) and domain code (`features/`, `modules/`).
- API types flow one way: backend DTOs → Swagger JSON → `openapi-typescript` → frontend.
- Design tokens in one CSS file; the theme removes shadows, non-md radii, and the default palette.

## Consequences

- The kit folders can be copied to start a new project.
- No shared npm workspace package for now; revisit if a third app appears.
- Swagger must stay accurate, since the frontend's types depend on it.
