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

## Structure

- The source is modular: `src/modules/{common,injector,popup}` plus shared top-level `src/lang/`. New features belong in a module, not in `src/` directly.
- `src/modules/common/` holds cross-module code (`components/`, `constants/`, `hooks/`, `models/`, `utils/`). Only put code here once more than one module needs it; do not promote single-use pieces. `common/components` currently exposes the generic icon-only `ButtonIcon` used by both popup presets and the injector launcher/close buttons, and the generic `Switch` (native checkbox, `role="switch"`) used by the toolbar site toggle.
- `src/modules/popup/` is the application loaded in the overlay iframe.
- `src/modules/highlighter/` is the "Resaltador" feature: keyword highlighting ported from the standalone `skills-finder` extension. Skill/keyword lists are hardcoded in `constants/keywords.ts` (positive/negative/orange/purple), whole-page defaults (root `body` + the scanned tag list) live in `constants/defaults.ts`, and behavior uses the CSS Custom Highlight API with `talentor-`-prefixed style id/highlight names. Highlighting is scoped to a per-host CSS container: `selectors.ts` stores `hostname -> selector` in `chrome.storage.local` under `highlighter-selectors`, and `start.ts` reads the current `window.location.hostname` entry (falling back to `body`) and rebuilds the controller when it changes, so switching URL/page reapplies the right selector. The reusable entry point is `highlightKeywords(keywordLists, cssSelector)` (`engine/highlightKeywords.ts`), which wraps `createHighlighter({ rootSelector, keywordLists })`; only the first selector match is used. Settings (`highlighter-settings` in `chrome.storage.local`: `{ enabled }`) are frontend-only. Popup UI is `/profile/highlighter` (`pages/Highlighter`), which reuses the popup `Input` container (`Selector CSS` placeholder) and persists the selector per host. The content script calls `startHighlighter()` on mount and disposes it on unmount. Ranges are cached per text node in `engine/scan.ts` so rescans only rebuild changed nodes.
- `src/modules/injector/` is the content script that mounts the shadow-DOM launcher/overlay. Sites are disabled by default; it mounts nothing until the site is enabled via the toolbar popup (`enabled-hosts` in `chrome.storage.local`); a storage subscription mounts/unmounts the launcher live without reload.
- Job picker: the popup's profile screen drives `injector/jobPicker.ts` over a `window.postMessage` bridge (`@common/utils/jobPickerBridge.ts`, `talentor:job-picker:*`). The trigger is the briefcase icon button in the selector row (`ProfileSelector`), and the picked text fills the `jobDescription` textarea in `JobPicker`; both are wired by `Screens/hooks/useJobPickerForm.ts`, which owns the RHF form and the picker state. Start highlights hovered host-page elements with an inline orange outline, click returns the normalized `innerText` and fills the standalone RHF `jobDescription` field, `Esc` cancels. The bridge validates the extension origin and replies to `event.source`; it is transient and never persisted. It must skip `html`, `body`, and `#talentor-ai-root`, and must never inject Tailwind into the host page.
- `src/modules/toolbar/` is the browser-toolbar popup (`toolbar.html`, picked up by CRXJS from the manifest `action`; no manual rollup input needed). It shows the active-tab hostname and toggles per-site enable/disable. Needs `activeTab` for the tab URL; unsupported pages (`chrome://`, new-tab, etc.) show a message with the toggle hidden.
- Path aliases: `@modules/*` -> `src/modules/*`, `@common/*` -> `src/modules/common/*`, `@lang/*` -> `src/lang/*`. Prefer aliases over deep relative paths; keep intra-module imports relative.

## Wiring

- `manifest.config.ts` is the source of truth for extension wiring. It declares `name`, `version`, `icons`, `permissions: ['storage', 'activeTab']`, an `action` toolbar popup (`toolbar.html`), a `content_scripts` entry for `src/modules/injector/index.tsx` on `http(s)://*/*`, and `web_accessible_resources` exposing `index.html` and `assets/*`. No browser action background worker.
- The application source is `index.html` -> `src/main.tsx` -> `src/modules/popup/App.tsx`. The content script renders a shadow-DOM launcher/overlay (`src/modules/injector/`) that embeds the app in an extension-origin iframe (`chrome.runtime.getURL('index.html')?host=<hostname>`; the `host` query param is how the popup learns the current site, e.g. for the Resaltador selector).
- Because `index.html` is not a manifest HTML key, CRXJS `htmlFiles()` does not pick it up; `vite.config.ts` adds it via `build.rollupOptions.input.overlay`. Keep that input or the overlay ships an unbundled `index.html`.
- Injector styling: `src/modules/injector/injector.css` (`@import 'tailwindcss'` + `@config` + a `:host` reset/theme-var block) is imported with `?inline` and appended as a `<style>` into the shadow root. Use `tai:` utilities only; never inject Tailwind into the page document (its preflight would reset host pages).
- Injector icons mirror `apps/web/src/components/Icons`: `src/modules/injector/components/Icons` is type-driven over `react-icons/lu` with `strokeWidth` default `2.7`. Add icons to `ICON_COMPONENTS`, do not inline SVGs.
- The launcher is draggable via pointer events (`useDraggableLauncher`, no drag library): it follows the cursor, then snaps to the nearest left/right edge and is clamped to the viewport. The chosen `{ side, y }` persists in `chrome.storage.local` under `launcher-position`, which is why the `storage` permission is required. `App` renders nothing until the hook's `isReady` flips (storage read resolved), so on every new page the launcher appears directly at its saved spot instead of animating in from the default corner.
- `App.tsx` owns `useDraggableLauncher` so `OverlayPanel` can open on the launcher's side (`left`/`right`) anchored to its vertical position, shrinking and clamping (`useViewport` + `EDGE_MARGIN`) so it never exceeds the viewport.
- Icon-only buttons must use `ButtonIcon` from `@common/components` (generic: takes the icon as `children`, passes through button props). Its only consumer is the injector launcher/overlay; the popup no longer ships a popup-icon preset.
- The legacy LinkedIn scraper (`HTMLInjector`), the background service worker, the browser-action popup, the job-apply flow, generated-resume history, and the profile create/edit/delete flow (screens, form schema, CRUD API clients, and the `/profile/config*` routes) were removed. Do not recreate them. Profile screens are read-only: a profiles dropdown (`ProfileSelector`, backed by `GET /api/v1/profiles`), the selected profile's information grid, and the job picker.
- Navigation is menu-driven (`Menu` uses the `authenticatedRoutes` prefixes); the app no longer renders a header kebab menu (the profile/logout options were removed).
- The app is login-only. `src/modules/popup/routes/Router.tsx` sends `/` to `/profile`; `/auth/login` is the public route.

## Boundaries

- `src/modules/popup/` contains the UI, routes, React Query data layer, and Zustand stores.
- Auth state lives in `src/modules/popup/store/useSessionStore.ts` (persist key `session`): it holds the authenticated `UserResponse` user and access token, using `@talentor/contracts` types. Registration and signup are owned by the website, not the extension.
- There is no service worker or message bridge; the content script only mounts the launcher/overlay and the app talks to the backend directly.

## Gotchas

- Routes are hash-based (`HashRouter`); keep them hash-based so they work inside an extension iframe.
- The app remembers the last route via `localStorage['current-path']` in `src/modules/popup/containers/Menu/index.tsx`.
- Tailwind classes must use the `tai:` prefix (Tailwind 4 variant-style via `@tailwindcss/postcss` + `@config` in `app.css` + `prefix: 'tai'` in `tailwind.config.js`). Write `tai:flex`, `tai:grid`, `tai:bg-primary`; with variants prefix comes first: `tai:hover:bg-primary`, `tai:disabled:text-txt3`, `tai:active:scale-95`, `tai:last:border-none`. Never use unprefixed or dash-form `tai-`/`ik-` classes; `apps/web` stays unprefixed.
- `src/modules/popup/app.css` is the application stylesheet.
- Injector sizing must stay px-based: `rem` resolves against the host page root font-size (LinkedIn sets `html { font-size: 62.5% }`, so `1rem = 10px`). `injector.css` `:host` pins `--tai-spacing: 4px` and `--tai-radius-2xl: 16px`; pin any other rem-based Tailwind token (e.g. `--tai-text-*`) the same way before using it in the injector.
- Injector positioning uses `document.documentElement.clientWidth/clientHeight` (`getViewportSize`), never `window.innerWidth/innerHeight`: the latter includes the scrollbar, which made the right gap smaller than the left. Edge gap is `EDGE_MARGIN` (1rem = 16px) on both sides.
- Shared generic types live in `@common/models` (`CustomizableComponent`, `DynamicType`, `RecursiveObject`, `IconSize`); popup-specific contracts stay in `src/modules/popup/models`.
- API base config lives in `src/modules/popup/api/baseApi.ts` and `constants.ts`. `VITE_SERVICE_URL` (falls back to `'/'`) is the backend base and all API paths build from `/api/v1`; `VITE_WEB_URL` (exposed as `WEB_URL`, default `http://localhost:5173`) builds website links. The login page's Register link is `${WEB_URL}/register`.
- Persisted local state: `session` (the `UserResponse` user plus token), `jobProfile`, and `current-path`; `useJobProfileResumeFormStore` still uses the legacy `job-post-form` persist key and is currently unused.
- `GET /api/v1/user` does not embed `userJobProfile`; the extension type adds it as optional, so do not assume profiles are present on the user response. The profiles dropdown reads the existent `GET /api/v1/profiles` list (`useProfilesList`, `ProfileMetadata.name`) instead of the session.
- Extension refresh tokens are out of scope (the HttpOnly `refresh_token` cookie is not used); access-token expiry requires re-login. CORS for the extension origin is backend work not present in this repo.
- `src/lang/i18n.ts` is shared by popup and injector (imported by both `src/modules/popup/App.tsx` and `src/modules/injector/index.tsx`); it currently loads only `es_common.json` and non-`es` browsers fall back to the first available resource. Add new languages under `src/lang/common/`, never per-module.
