# Template Backend Monorepo

A monorepo starter for backend services (API + Auth) with shared tooling.

## Structure

- `services/api` — main API service
- `services/auth` — auth service (skeleton)
- `packages/shared` — shared utilities/types (skeleton)
- `infra/db/api/drizzle` — API migrations output (Drizzle)

## Getting started

- Install deps at the repo root: `pnpm install`
- Run API dev server: `pnpm dev`

## Environment files

- Root `.env` is for infra / compose variables.
- Each service has its own `.env*` files for runtime config.

Order used by service scripts (example):

1. `.env`
2. `.env.local`
3. `.env.development` or `.env.production`
4. `.env.development.local` or `.env.production.local`
