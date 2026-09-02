# Generic PWA

This is a generic PWA with no branding yet.

## Requirements

- [Bun](https://bun.sh)

## Getting started

```sh
bun install
bun run dev
```

`bun install` bootstraps the workspace: it creates `.env` from `.env.example` if missing, applies the database schema, and seeds the dev account (handle `ifrit`, password `omnislash`). With `DATABASE_URL` empty, the app uses an embedded Postgres (PGlite) stored in `apps/api/.data/` — no Postgres install or Docker needed. Point `DATABASE_URL` at a real Postgres in `.env` to use that instead; install fails with the reason if it's unreachable.

`bun run dev` serves the PWA at http://localhost:6102 and the API at http://localhost:6101.
