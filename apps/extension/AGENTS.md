# AGENTS.md

## Commands

- Use `bun`. This workspace is part of the frontend monorepo; run `bun install` from the repo root. Shared tooling (TypeScript, ESLint, Prettier) is owned by the root.
- `bun run dev` runs the CRXJS/Vite extension dev server on fixed port `5174` (`strictPort: true`).
- `bun run build` builds the extension into `dist/`. Do not hand-edit `dist/`.
- `bun run lint` runs ESLint with `--max-warnings 0`.
- `bun run typecheck` runs `tsc -b`.
- `bun run format` and `bun run format:check` run Prettier across the repo.
- `bun run verify` is the intended full local check order: format check -> lint -> typecheck -> build.
- `bun run build` still does not typecheck by itself.
- `bun run clean` is misnamed: it removes `dist/` and then starts Vite.
- There is no repo CI workflow, but Husky is configured locally: `prepare` installs hooks and `.husky/pre-commit` runs `bunx lint-staged`.

## Wiring

- `manifest.config.ts` is the source of truth for extension wiring.
- The popup entry is `index.html` -> `src/main.tsx` -> `src/Apps/PopUp/App.tsx`.
- `src/Apps/PopUp/popup.tsx` exists but is not wired into the current build.
- The background service worker entry is `src/Apps/ServiceWorker/index.ts`.
- The content script entry is `src/Apps/HTMLInjector/index.tsx` and it only runs on `https://www.linkedin.com/jobs/*`.
- The popup is login-only. `src/Apps/PopUp/routes/Router.tsx` exposes only `/auth/login` (`LOGIN_PATH`) publicly; there is no register route or `noLoginRoutes` list.

## Boundaries

- `src/Apps/PopUp/` contains the popup UI, routes, React Query data layer, and Zustand stores.
- `src/Apps/HTMLInjector/` owns the LinkedIn DOM integration. The brittle selectors live in `src/Apps/HTMLInjector/constants.ts` and the scraper is `helpers/jobPostScrapper.ts`.
- `src/Apps/ServiceWorker/` is only the bridge between the content script and the popup.
- Auth state lives in `src/Apps/PopUp/store/useSessionStore.ts` (persist key `session`): it holds the authenticated `UserResponse` user and access token, using `@talentor/contracts` types. Registration and signup are owned by the website, not the popup.

## Gotchas

- The scrape-to-popup flow spans `src/Apps/constants.ts`, `src/Apps/HTMLInjector/components/ApplyButton/index.tsx`, `src/Apps/ServiceWorker/index.ts`, and `src/Apps/PopUp/pages/Home/index.tsx`; change them together.
- Git line endings are normalized with `.gitattributes` and `.editorconfig`; keep text files on `LF`.
- Popup routing uses `HashRouter`; keep extension routes hash-based.
- The popup remembers the last route via `localStorage['current-path']` in `src/Apps/PopUp/containers/Menu/index.tsx`.
- Tailwind classes must use the `tai:` prefix (Tailwind 4 variant-style via `@tailwindcss/postcss` + `@config` in `app.css` + `prefix: 'tai'` in `tailwind.config.js`). Write `tai:flex`, `tai:grid`, `tai:bg-primary`; with variants prefix comes first: `tai:hover:bg-primary`, `tai:disabled:text-txt3`, `tai:active:scale-95`, `tai:last:border-none`. Never use unprefixed or dash-form `tai-`/`ik-` classes.
- `src/Apps/PopUp/app.css` is shared: the popup imports it directly, and the content script injects the built CSS into a shadow root.
- TS path aliases are nonstandard and worth reusing: `@popup:...`, `@injector:...`, `@all/*`.
- API base config lives in `src/Apps/PopUp/api/baseApi.ts` and `constants.ts`. `VITE_SERVICE_URL` (falls back to `'/'`) is the backend base and all API paths build from `/api/v1`; `VITE_WEB_URL` (exposed as `WEB_URL`, default `http://localhost:5173`) builds website links. The login page's Register link is `${WEB_URL}/register` and opens the website signup in a new tab.
- Persisted local state matters: `session` (the `UserResponse` user plus token), `jobProfile`, and `current-path` are stored in `localStorage`; both form stores currently use the `job-post-form` persist key.
- `GET /api/v1/user` does not embed `userJobProfile`; the extension type adds it as optional, so do not assume profiles are present on the user response.
- Extension refresh tokens are out of scope (the HttpOnly `refresh_token` cookie is not used); access-token expiry requires re-login. CORS for the extension origin is backend work not present in this repo.
- `src/Apps/PopUp/lang/i18n.ts` currently loads only `es_common.json`; non-`es` browsers fall back to the first available resource.
