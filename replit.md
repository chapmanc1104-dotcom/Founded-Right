# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bizlaunch/          # Founded Right React web app
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

**Required environment variables**

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection (provided by Replit) |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Verifying the caller's Supabase access token |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required for account deletion to remove the Supabase auth user.** Without it `DELETE /api/account` erases all data but returns `authDeleted: false` and the user can still sign in. Keep this server-side only — it bypasses row-level security. |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed to call the API cross-origin (e.g. `https://foundedright.co`). Unset in production rejects cross-origin requests; unset in development reflects any origin. |
| `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` / `AI_INTEGRATIONS_ANTHROPIC_API_KEY` | Anthropic integration |

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `lib/replit-auth-web` (`@workspace/replit-auth-web`)

React hook (`useAuth`) for Replit OIDC auth on the web. Exports `useAuth()` which calls `/api/auth/user` and provides `isLoading`, `isAuthenticated`, `user`, `login`, `logout`.

### `artifacts/bizlaunch` (`@workspace/bizlaunch`)

FoundedRight — a comprehensive business launch platform. Single-page React + Vite app.

**Theme**: Light professional theme — white/`#F7F8FA` backgrounds, navy `#1B3A6B` sidebar, blue `#2D5BE3` accent, Inter + Plus Jakarta Sans fonts. Redesigned from dark mode (Dec 2024).

**Screens** (10+):
- **Landing page**: Marketing page shown to unauthenticated users
- **Auth**: Sign in, sign up, forgot password, reset password (Supabase Auth, Google OAuth)
- **Onboarding**: 5-step onboarding wizard (Welcome → Business → Owner → Goals → Review)
- **Dashboard**: Score ring SVG, category progress bars, funding matches
- **Checklist**: 46 items across 8 categories (Legal, Banking, Credit, Federal, Certs, Grants, Presence, Loans) with filter and accordion
- **Documents**: Document vault linked to checklist state
- **Presence**: Professional presence tracker (8 metrics)
- **Funding**: Static funding database (8 programs) with readiness tracking
- **Calendar**: Deadline calendar with event list
- **NAICS Finder**: AI-powered NAICS code search via `/api/ai/naics`
- **Live Grants**: AI-matched funding via `/api/ai/grants`
- **Application Tracker**: CRUD tracker for grant applications
- **Capability Statement**: AI-generated one-pager via `/api/ai/capability-statement`
- **AI Assistant**: Chat with Claude claude-3-5-haiku personalized to user's profile

**Public pages** (served at real paths via the SPA rewrite, matched in `staticPage()` before the auth gate): `/privacy`, `/terms`, `/contact` — see `src/components/LegalPages.tsx`. Update `LEGAL_CONTACT`, `BUSINESS_ENTITY`, and `LEGAL_EFFECTIVE_DATE` there.

Auth: Supabase Auth (email/password + Google OAuth). `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars (the build fails without them in production).
Profile + checklist state persisted to PostgreSQL via `/api/profile`, `/api/checklist-state`, `/api/applications`.

**AI request rules** — the client never supplies prompts. `/api/ai/*` builds every prompt server-side from the caller's stored profile and checklist (`src/lib/aiContext.ts`), so a crafted request body cannot repurpose the Anthropic key. All AI routes are rate limited (`src/lib/rateLimit.ts`) and all user input is length-clamped (`src/lib/sanitize.ts`). `src/data/checklist.ts` mirrors the item ids in `App.tsx`'s `SECTIONS` — keep them in sync when adding a checklist item.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.
