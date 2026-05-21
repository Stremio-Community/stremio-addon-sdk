# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Repository

PNPM workspace monorepo for the **Community Stremio Addon SDK** — a modern, TypeScript-first reimagining of the official `stremio-addon-sdk`. ESM-only, Node LTS+, pnpm v10+.

## Commands

Run from repo root unless noted. All package scripts use `pnpm -r`.

- `pnpm build` — build all packages (`tsc` per package).
- `pnpm build:watch` — parallel watch mode across packages.
- `pnpm typecheck` — `tsc --noEmit` across packages.
- `pnpm test` — `vitest run` across the workspace (configs collected via [vitest.workspace.ts](vitest.workspace.ts) globbing `packages/*/vitest.config.ts`).
- `pnpm test:watch` — vitest watch.
- `pnpm test -- <pattern>` / inside a package: `pnpm --filter @stremio-addon/sdk test path/to/file.test.ts -t "name"` — run a single test/file.
- `pnpm format` / `pnpm format:fix` — prettier check / write.
- `pnpm clean` — remove `dist/` in all packages.
- `pnpm changeset` — create a changeset (required for any user-facing change; releases are automated via changesets).

Only `sdk` and `compat` currently have real tests. Runtime / validation packages have placeholder `test` scripts.

## Architecture

The SDK is split into four layers, each its own publishable package under `packages/`:

### 1. Core — [packages/sdk](packages/sdk/) (`@stremio-addon/sdk`)

Framework-agnostic. The only package an addon strictly needs.

- [builder.ts](packages/sdk/src/builder.ts) — `AddonBuilder` registers typed resource handlers (`defineStreamHandler`, `defineMetaHandler`, `defineCatalogHandler`, `defineSubtitlesHandler`) and exposes `getInterface()` returning an `AddonInterface` (`{ manifest, get(resource, type, id, extra, config) }`). Manifest is frozen on construction; an optional Standard Schema can validate it.
- [router.ts](packages/sdk/src/router.ts) — `createRouter(addonInterface)` returns `(req: Request) => Promise<Response | null>`. Uses Web Standard `Request`/`Response` so it works in any runtime. Returns `null` when no route matches (caller decides 404). Handles the `/:config` route prefix when the manifest is configurable, the `manifest.json` route (with `behaviorHints` sanitization), `/:resource/:type/:id{/:extra}.json`, `result.redirect` → 307, and cache headers derived from `cacheMaxAge` / `staleRevalidate` / `staleError`.
- [validator.ts](packages/sdk/src/validator.ts) — synchronous Standard Schema (`@standard-schema/spec`) wrapper; throws `ValidationError`.
- [types.ts](packages/sdk/src/types.ts) — manifest, resource, handler types. `DefaultConfig` is the generic config slot threaded through builder + router.

The router decides the route prefix by inspecting the first path segment against the manifest's resource set (see `getRoutePrefix` in [router.ts](packages/sdk/src/router.ts)) — this is a deliberate workaround for `path-to-regexp` v8's greedy `{/:config}` matching.

### 2. Runtimes — [packages/runtime/](packages/runtime/)

Thin adapters: framework request → standard `Request` → `createRouter` → framework response.

- `@stremio-addon/node` ([packages/runtime/node](packages/runtime/node/)) — wraps `http.createServer`, converts `IncomingMessage` via [utils.ts](packages/runtime/node/src/utils.ts).
- `@stremio-addon/node-express` ([packages/runtime/node-express](packages/runtime/node-express/)) — Express `Router` factory with optional `cacheMaxAge`.

Hono / Cloudflare Workers / Vercel are documented as copy-paste snippets in [docs/runtimes.md](docs/runtimes.md) rather than shipped as packages. Frontends/config UI are explicitly out of scope ([docs/frontend.md](docs/frontend.md)).

### 3. Validation — [packages/validation/](packages/validation/)

Optional, pluggable. Each exports a `manifest` schema (Standard Schema compatible) consumed by `AddonBuilder`'s constructor.

- `@stremio-addon/zod` — zod-based manifest schema (peer dep: zod 3.25+ or 4).
- `@stremio-addon/linter` — wraps the official `stremio-addon-linter`.

### 4. Compat — [packages/compat](packages/compat/) (`@stremio-addon/compat`)

Drop-in shim mimicking the official SDK's surface (`addonBuilder`, `serveHTTP`, `publishToCentral`, `landingTemplate`, `getRouter`) so existing addons can migrate by changing only imports. See [MIGRATION.md](MIGRATION.md). Depends on `node-express` + `linter` internally.

## Conventions

- **ESM only** (`"type": "module"`); always use `.js` extensions in relative imports (`nodenext` module resolution, `verbatimModuleSyntax: true`).
- **Conventional Commits** with optional scope matching package name: `feat(sdk):`, `fix(validation/zod):`, `refactor(runtime/node-express):`. Husky + lint-staged run prettier on commit.
- **Changesets required** for any user-facing change. CI publishes on merge.
- **Workspace deps** use `workspace:^` / `workspace:*`.
- Per global instruction: be terse in commits/responses, sacrifice grammar for concision.
