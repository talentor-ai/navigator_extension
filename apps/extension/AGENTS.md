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

## Boundaries

- `src/Apps/PopUp/` contains the popup UI, routes, React Query data layer, and Zustand stores.
- `src/Apps/HTMLInjector/` owns the LinkedIn DOM integration. The brittle selectors live in `src/Apps/HTMLInjector/constants.ts` and the scraper is `helpers/jobPostScrapper.ts`.
- `src/Apps/ServiceWorker/` is only the bridge between the content script and the popup.

## Gotchas

- The scrape-to-popup flow spans `src/Apps/constants.ts`, `src/Apps/HTMLInjector/components/ApplyButton/index.tsx`, `src/Apps/ServiceWorker/index.ts`, and `src/Apps/PopUp/pages/Home/index.tsx`; change them together.
- Git line endings are normalized with `.gitattributes` and `.editorconfig`; keep text files on `LF`.
- Popup routing uses `HashRouter`; keep extension routes hash-based.
- The popup remembers the last route via `localStorage['current-path']` in `src/Apps/PopUp/containers/Menu/index.tsx`.
- Tailwind classes must use the `tai:` prefix (Tailwind 4 variant-style via `@tailwindcss/postcss` + `@config` in `app.css` + `prefix: 'tai'` in `tailwind.config.js`). Write `tai:flex`, `tai:grid`, `tai:bg-primary`; with variants prefix comes first: `tai:hover:bg-primary`, `tai:disabled:text-txt3`, `tai:active:scale-95`, `tai:last:border-none`. Never use unprefixed or dash-form `tai-`/`ik-` classes.
- `src/Apps/PopUp/app.css` is shared: the popup imports it directly, and the content script injects the built CSS into a shadow root.
- TS path aliases are nonstandard and worth reusing: `@popup:...`, `@injector:...`, `@all/*`.
- API base config lives in `src/Apps/PopUp/api/baseApi.ts` and `constants.ts`; the only verified env var is `VITE_SERVICE_URL`, which falls back to `'/'`, and all API paths build from `/api/v1`.
- Persisted local state matters: `session`, `jobProfile`, and `current-path` are stored in `localStorage`; both form stores currently use the `job-post-form` persist key.
- `src/Apps/PopUp/lang/i18n.ts` currently loads only `es_common.json`; non-`es` browsers fall back to the first available resource.
