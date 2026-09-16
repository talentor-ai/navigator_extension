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

- `manifest.config.ts` is the source of truth for extension wiring. It declares `name`, `version`, `icons`, a `content_scripts` entry for `src/Apps/Injector/index.tsx` on `http(s)://*/*`, and `web_accessible_resources` exposing `index.html` and `assets/*`. No browser action or background worker.
- The application source is `index.html` -> `src/main.tsx` -> `src/Apps/PopUp/App.tsx`. The content script renders a shadow-DOM launcher/overlay (`src/Apps/Injector/`) that embeds the app in an extension-origin iframe (`chrome.runtime.getURL('index.html')`).
- Because `index.html` is not a manifest HTML key, CRXJS `htmlFiles()` does not pick it up; `vite.config.ts` adds it via `build.rollupOptions.input.overlay`. Keep that input or the overlay ships an unbundled `index.html`.
- Injector styling: `src/Apps/Injector/injector.css` (`@import 'tailwindcss'` + `@config` + a `:host` reset/theme-var block) is imported with `?inline` and appended as a `<style>` into the shadow root. Use `tai:` utilities only; never inject Tailwind into the page document (its preflight would reset host pages).
- Injector icons mirror `apps/web/src/components/Icons`: `src/Apps/Injector/components/Icons` is type-driven over `react-icons/lu` with `strokeWidth` default `2.7`. Add icons to `ICON_COMPONENTS`, do not inline SVGs.
- The legacy LinkedIn scraper (`HTMLInjector`), the background service worker, the browser-action popup, the job-apply flow, and generated-resume history were removed. Do not recreate them.
- The app is login-only. `src/Apps/PopUp/routes/Router.tsx` sends `/` to `/profile`; `/auth/login` is the public route.

## Boundaries

- `src/Apps/PopUp/` contains the UI, routes, React Query data layer, and Zustand stores.
- Auth state lives in `src/Apps/PopUp/store/useSessionStore.ts` (persist key `session`): it holds the authenticated `UserResponse` user and access token, using `@talentor/contracts` types. Registration and signup are owned by the website, not the extension.
- There is no service worker or message bridge; the content script only mounts the launcher/overlay and the app talks to the backend directly.

## Gotchas

- Routes are hash-based (`HashRouter`); keep them hash-based so they work inside an extension iframe.
- The app remembers the last route via `localStorage['current-path']` in `src/Apps/PopUp/containers/Menu/index.tsx`.
- Tailwind classes must use the `tai:` prefix (Tailwind 4 variant-style via `@tailwindcss/postcss` + `@config` in `app.css` + `prefix: 'tai'` in `tailwind.config.js`). Write `tai:flex`, `tai:grid`, `tai:bg-primary`; with variants prefix comes first: `tai:hover:bg-primary`, `tai:disabled:text-txt3`, `tai:active:scale-95`, `tai:last:border-none`. Never use unprefixed or dash-form `tai-`/`ik-` classes; `apps/web` stays unprefixed.
- `src/Apps/PopUp/app.css` is the application stylesheet.
- TS path aliases are `@popup:...` and `@lang/*`; the `@injector/*` and `@all/*` aliases were removed with the scraper.
- API base config lives in `src/Apps/PopUp/api/baseApi.ts` and `constants.ts`. `VITE_SERVICE_URL` (falls back to `'/'`) is the backend base and all API paths build from `/api/v1`; `VITE_WEB_URL` (exposed as `WEB_URL`, default `http://localhost:5173`) builds website links. The login page's Register link is `${WEB_URL}/register`.
- Persisted local state: `session` (the `UserResponse` user plus token), `jobProfile`, and `current-path`; `useJobProfileResumeFormStore` still uses the legacy `job-post-form` persist key and is currently unused.
- `GET /api/v1/user` does not embed `userJobProfile`; the extension type adds it as optional, so do not assume profiles are present on the user response.
- Extension refresh tokens are out of scope (the HttpOnly `refresh_token` cookie is not used); access-token expiry requires re-login. CORS for the extension origin is backend work not present in this repo.
- `src/Apps/PopUp/lang/i18n.ts` currently loads only `es_common.json`; non-`es` browsers fall back to the first available resource.
