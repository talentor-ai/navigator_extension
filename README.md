# Talentor Frontend

Monorepo for the Talentor web platform and browser extension.

## Structure

```text
apps/
├── web/          # Web platform (Vite + React + Ant Design)
└── extension/    # Browser extension (Vite + CRXJS, previously navigator_extension)

packages/
├── api-client/   # Typed axios client: envelope unwrap + ApiError
├── contracts/    # Generated OpenAPI types (openapi-typescript)
└── config/       # Shared tsconfig

scripts/
├── install-latest-dependencies.ts   # Install registry deps pinned to npm `latest`
└── generate-contracts.ts            # Regenerate packages/contracts from backend OpenAPI
```

## Commands

```bash
bun install                  # install/update workspace lockfile
bun run dev:web              # web dev server on :5173
bun run dev:extension        # extension dev server (CRXJS) on :5174
bun run build                # build web + extension
bun run lint                 # ESLint across the monorepo (root config)
bun run typecheck            # typecheck every workspace
bun run format:check         # Prettier check
bun run generate:contracts   # regenerate API types (backend must be running)
bun run deps:latest <pkg>... # install registry deps at their npm `latest` version
bun run verify               # format:check -> lint -> typecheck -> build
```

## Toolchain

- Package manager: `bun` (workspaces, single `bun.lock`).
- Shared tooling (TypeScript, ESLint, Prettier, Husky) lives at the root.
- `typescript` is pinned to `6.0.3` because `typescript-eslint` does not yet support TypeScript 7. Revisit when upstream adds support.
- The installer script resolves `latest` from the npm registry at run time and writes exact versions.

## API Contracts

Backend API types are generated from the live backend:

```bash
bun run generate:contracts   # reads http://localhost:3011/openapi.json
```

See `packages/contracts` and `packages/api-client`.

## Auth

- Web uses `HttpOnly` refresh cookie (`refresh_token`, `Path=/api/v1/auth`, `SameSite=Lax`, `Max-Age=30d`) and in-memory access token.
- `packages/api-client` handles `withCredentials`, single-flight refresh, and retry once on `401`.
- `apps/web` store (`zustand`) keeps `status: loading|authenticated|anonymous` and `user`; `bootstrap` calls `POST /api/v1/auth/refresh` via cookie. No token in `localStorage`.
- Multi-tab: `BroadcastChannel('talentor-auth')` for login/logout sync; `Web Locks` (`talentor-refresh`) serializes refresh across tabs.
- Routes: `/` protected, `/login` and `/register` public-only, with loading spinner and redirect preservation.
