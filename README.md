# Bidnest

Online auction platform. Monorepo managed with **Turborepo + npm workspaces**.

## Structure

```
bidnest/
├── apps/
│   ├── api/               # NestJS API + TypeORM (SQLite) — src/
│   └── web/               # Next.js (App Router) + Tailwind CSS — src/
├── packages/
│   ├── shared/            # Shared types, enums, DTOs and socket event names
│   └── config-typescript/ # Shared tsconfig bases
├── turbo.json
└── package.json            # npm workspaces definition
```

## Getting started

```bash
npm install
npm run dev         # runs api (:4000) and web (:3000) together via turbo
```

Create the local env files once (both are git-ignored):

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

There is no database in a fresh clone. The first migrate command creates it:

```bash
npm run db:migrate   # creates apps/api/bidnest.db + runs every migration
npm run db:seed      # optional: demo accounts for local development
```

Both the SQLite file and its sidecar files (`-journal`, `-wal`, `-shm`) are
git-ignored, so they can never be pushed by accident.

| Command                                                         | What it does                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                                                   | Dev servers for all apps (api watch mode + next dev)                   |
| `npm run build`                                                 | Build everything (turbo caches, shared packages build first)           |
| `npm run typecheck`                                             | Type-check every workspace                                             |
| `npm test`                                                      | Run the API test suite (Vitest: unit + e2e)                            |
| `npm run lint`                                                  | ESLint across the monorepo                                             |
| `npm run lint:fix`                                              | ESLint with autofix                                                    |
| `npm run format`                                                | Prettier write                                                         |
| `npm run format:check`                                          | Prettier check (CI mode)                                               |
| `npm run dev -w @bidnest/api`                                   | Run only the API                                                       |
| `npm run dev -w @bidnest/web`                                   | Run only the web app                                                   |
| `npm run db:migrate`                                            | Apply pending SQLite migrations                                        |
| `npm run db:seed`                                               | Seed admins, sellers, seller profiles and buyers (auto-migrates first) |
| `npm run db:show`                                               | Print tables, row counts, seed accounts and login credentials          |
| `npm run db:reset`                                              | Delete the dev SQLite file, migrate and seed from scratch              |
| `npm run db:migration:generate -- src/database/migrations/Name` | Generate a migration from entity changes                               |
| `npm run db:migrate:revert`                                     | Revert the last migration                                              |

## Apps

- **api** — `http://localhost:4000/api/v1`. Health check at `GET /api/v1/health`.
  OpenAPI docs at `http://localhost:4000/api/docs` (JSON at `/api/docs/json`).
  SQLite file is `apps/api/bidnest.db`. The schema is owned by TypeORM
  migrations in `apps/api/src/database/migrations` (`synchronize` is off).
- **web** — `http://localhost:3000`. Next.js App Router frontend: public
  marketplace pages (`/`, `/auctions`, `/categories`, `/how-it-works`, `/sell`,
  `/login`, `/register`), buyer hub (`/account/*`), seller hub (`/seller/*`)
  and admin (`/admin/*`). The browser calls its own `/api/v1` path; Next proxies
  it to the API.

## Environment variables

Each deployable app owns its env file — there is no shared root `.env`, because
`apps/api` and `apps/web` are deployed separately and a single file would leak
values across boundaries (and into a container image).

| File            | Loaded by                                            | Committed? |
| --------------- | ---------------------------------------------------- | ---------- |
| `apps/api/.env` | `src/config/env.ts` (dotenv, explicit absolute path) | no         |
| `apps/web/.env` | Next.js automatically (also supports `.env.local`)   | no         |
| `*.env.example` | humans — copy to `.env`                              | yes        |

- `.gitignore` ignores `.env` and `.env.*` but un-ignores `.env.example`.
- Real process environment variables always win; dotenv and Next never override
  what is already exported. That is what production uses — no `.env` in the
  image, values injected by the platform.
- In the API, inject `ConfigService` in services. The bootstrap and TypeORM
  config read env early through `src/config/env.ts`, before Nest starts.
- In the web app only `NEXT_PUBLIC_*` values reach the browser bundle. The
  browser calls its own `/api/v1` path and Next proxies it, so only
  `API_INTERNAL_URL` (server-side) is required today.
- Tests do not read `.env`: `apps/api/test/setup.ts` sets
  `DATABASE_FILE=:memory:` before dotenv runs.

## API documentation

Swagger/OpenAPI is generated from the controllers and DTOs at build time by the
`@nestjs/swagger` CLI plugin configured in `apps/api/nest-cli.json`. In code you
only add `@ApiTags` / `@ApiCookieAuth`; validation rules from `class-validator`
become schema constraints automatically. Run the API and open
`http://localhost:4000/api/docs`. Use the **Sign in to test** button with a
seeded account; it sets the same httpOnly cookies as the web app, so protected
operations work without pasting a token or cookie.

## Testing

Vitest is the test runner (NestJS's default for new projects; `@nestjs/testing`
stays runner-agnostic). SWC compiles the tests because Vite's default esbuild
transform cannot emit the `design:paramtypes` metadata Nest DI depends on.

```bash
npm test -w @bidnest/api          # unit + e2e
npm run test:watch -w @bidnest/api
npm run test:coverage -w @bidnest/api
```

- Unit tests live next to the code: `src/**/*.spec.ts`
- E2E tests live in `apps/api/test/` as `*.e2e-spec.ts` (Supertest)
- `test/setup.ts` points `DATABASE_FILE` at `:memory:`, so tests never touch
  `apps/api/bidnest.db`
- `main.ts` exports `configureApp`, shared by the server bootstrap and the e2e
  tests, so both use the same prefix, cookie parser and validation pipe

## Code quality

ESLint (flat config, `eslint.config.mjs`) and Prettier (`prettier` config at the
repo root) run across the monorepo. The API disables
`@typescript-eslint/consistent-type-imports` on purpose: rewriting an injected
class to `import type` erases its DI metadata and breaks Nest at runtime.

## Shared package

`@bidnest/shared` holds `UserRole`, `AuctionStatus`, `OrderStatus`, `SocketEvents`
and DTO types so the API and the frontend can never drift apart. API validation
classes implement the shared request interfaces, so Swagger rules and client
types stay aligned. Add new shared contracts there — never duplicate them in an
app.

## Authentication (implemented)

- NestJS `AuthModule` + `UsersModule`: register, login, logout, rotating refresh
  tokens; **the access JWT and opaque refresh token live in httpOnly cookies**
  only
- The frontend calls `/api/v1/...` on its own origin — `next.config.ts` proxies
  to the API so cookies stay first-party (no CORS headaches)
- The web client retries a request once after a `401` by calling
  `POST /api/v1/auth/refresh`; if refresh fails, the user is treated as signed out
- **Roles are profile-derived, never picked at login**: everyone registers as
  Buyer; applying to sell + admin approval promotes to Seller. The frontend
  routes by role after login: admin → `/admin`, seller → `/seller`, buyer → `/account`

## Database, migrations and seed data

SQLite for local development. TypeORM `synchronize` is **off** — migrations are
the only way the schema changes.

The DB lives at `apps/api/bidnest.db` and is git-ignored (`*.db`, including
SQLite's `-journal`/`-wal`/`-shm` sidecars). Nothing creates it ahead of time:
on a fresh clone the first `npm run db:migrate` opens the path, creates the
file, creates the `migrations` table and applies the schema. Override the
location with `DATABASE_FILE`; relative paths resolve against `apps/api` (not
the cwd), and `apps/api/.env` is loaded from its real location, so running
`node apps/api/dist/main.js` from the repo root uses the same database as
`npm run dev`.

```bash
npm run db:migrate   # apply migrations (creates apps/api/bidnest.db)
npm run db:seed      # insert the dev accounts below (idempotent, re-runnable)
npm run db:show      # verify data + print the login table
```

Seeds are split per entity in `apps/api/src/database/seeds/`:

| File                      | Table             | What it creates                                    |
| ------------------------- | ----------------- | -------------------------------------------------- |
| `accounts.ts`             | —                 | Fixture definitions for admins, sellers and buyers |
| `users.seed.ts`           | `users`           | Admin, moderator, seller and buyer accounts        |
| `seller-profiles.seed.ts` | `seller_profiles` | Verified, pending and rejected seller profiles     |

The seed runner is `seeds/run-seeds.ts` (wired into `seed-database.ts`).
Seeding is explicit — the API no longer creates accounts on startup.

| Account                 | Password      | Role                         | Lands on   |
| ----------------------- | ------------- | ---------------------------- | ---------- |
| `admin@bidnest.com`     | `Admin!2345`  | Admin                        | `/admin`   |
| `riley@bidnest.com`     | `Mod!2345`    | Moderator                    | `/admin`   |
| `studio@bidnest.com`    | `Seller!2345` | Seller (verified business)   | `/seller`  |
| `klaus@bidnest.com`     | `Seller!2345` | Seller (verified individual) | `/seller`  |
| `meridian@bidnest.com`  | `Seller!2345` | Seller (verified business)   | `/seller`  |
| `groove@bidnest.com`    | `Seller!2345` | Buyer with **pending KYC**   | `/account` |
| `yunaseo@bidnest.com`   | `Seller!2345` | Buyer with **pending KYC**   | `/account` |
| `quickflip@bidnest.com` | `Seller!2345` | Buyer with **rejected KYC**  | `/account` |
| `alex@bidnest.com`      | `Buyer!2345`  | Buyer                        | `/account` |
| `amara@bidnest.com`     | `Buyer!2345`  | Buyer (1 strike)             | `/account` |
| `theo.k@bidnest.com`    | `Buyer!2345`  | Buyer                        | `/account` |
| `sofia@bidnest.com`     | `Buyer!2345`  | Buyer (2 strikes)            | `/account` |

- Set a real `JWT_SECRET` in `apps/api/.env` (see `.env.example`)
