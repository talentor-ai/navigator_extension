# AGENTS.md

## Package manager

- Use `bun` (root pins `bun@1.3.14`). Fresh clones need `bun install`.
- Workspaces: `apps/*`, `packages/*`. Single root `bun.lock`.

## Commands

- `bun run dev:web` -> Vite web dev server on port `5173` (`strictPort`).
- `bun run dev:extension` -> CRXJS extension dev server on port `5174` (`strictPort`).
- `bun run verify` is the intended full local check order: `format:check -> lint -> typecheck -> build`.
- `bun run lint` uses the single root `eslint.config.js`.
- `bun run typecheck` runs each workspace's own `typecheck` script.
- `bun run generate:contracts` regenerates `packages/contracts/src/generated.ts` from the running backend (`http://localhost:3011/openapi.json`).
- `bun run deps:latest <pkg>...` installs registry packages at their npm `latest` version (exact). Use `--dev` and `--cwd <dir>` as needed; `pkg@version` pins explicitly.
- Do NOT hand-edit `dist/` or commit it.

## Workspaces

- `apps/web`: Vite + React + Ant Design + TanStack Query + React Router (BrowserRouter). Port `5173`.
- `apps/extension`: Vite + CRXJS Chrome extension, port `5174`. See `apps/extension/AGENTS.md` for extension wiring.
- `packages/api-client`: typed axios client, envelope unwrap, `ApiError`.
- `packages/contracts`: generated OpenAPI types; regenerate with `bun run generate:contracts`.
- `packages/config`: shared `tsconfig.base.json`.

## Toolchain notes

- `typescript` is pinned to `6.0.3` (latest `7.0.x` is incompatible with `typescript-eslint`). Do not bump past `6.x` until typescript-eslint supports TS 7.
- `react-hooks/set-state-in-effect` and `react-hooks/incompatible-library` are disabled for `apps/**` until pre-existing extension patterns are refactored (kanban: React hooks debt). Re-enable after.
- Formatting: Prettier config at root; keep `LF` (`.gitattributes`).
- Workspace-local packages are referenced as `workspace:*`.

## Auth

- Refresh token is `HttpOnly` cookie (`refresh_token`, `Path=/api/v1/auth`); never in `localStorage` or JS.
- Access token is memory-only (`packages/api-client` + `apps/web/src/store/auth.ts`).
- `bootstrap` is single-flight (StrictMode) and calls `POST /api/v1/auth/refresh` via cookie.
- `packages/api-client` handles `withCredentials`, single-flight refresh, and retry once on `401`.
- Multi-tab: `BroadcastChannel('talentor-auth')` for login/logout; `Web Locks` (`talentor-refresh`) serializes refresh.

## Gotchas

- Extension popup uses `HashRouter`; keep extension routes hash-based.
- Extension Tailwind classes use the `ik-` prefix (Tailwind 4 via `@tailwindcss/postcss`, `@config` in `app.css`).
- Backend must be running for `bun run generate:contracts`.
- If a latest dependency conflicts (e.g. TS vs typescript-eslint), do not silently downgrade; pin a compatible version and document the reason here.
