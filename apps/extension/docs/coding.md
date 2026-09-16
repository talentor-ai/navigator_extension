# Navigator Extension Coding Guide

## Technology

- React 19 and TypeScript 6
- Vite 8 with `@crxjs/vite-plugin`
- Manifest V3
- TanStack Query for server state
- Zustand for local and persisted state
- Axios for HTTP
- React Hook Form for dynamic forms
- Ant Design 6 and Tailwind CSS for UI
- i18next and `react-i18next` for localization
- CSS Modules for component-local styles

## Module Boundaries

| Module                         | Responsibility                                            | Rule                                                                                 |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/modules/common`           | Cross-module components, constants, hooks, models, utils. | Put code here only when more than one module needs it.                               |
| `src/modules/popup/api`        | Axios instance, auth, endpoint clients.                   | Keep HTTP details here; pages call hooks or API adapters.                            |
| `src/modules/popup/models`     | API, form, session, user, and UI types.                   | Session/auth types come from `@talentor/contracts`; extend locally only when needed. |
| `src/modules/popup/store`      | Zustand stores and browser persistence.                   | Keep durable UI/session state separate from server cache.                            |
| `src/modules/popup/pages`      | Route-level screens and use-case UI.                      | Compose reusable components; keep orchestration in hooks.                            |
| `src/modules/popup/components` | Shared visual and form components.                        | Keep components presentation-focused where possible.                                 |
| `src/modules/popup/hooks`      | Reusable data behavior.                                   | Encapsulate Query and mutation behavior in hooks.                                    |
| `src/modules/popup/routes`     | HashRouter route tree and path constants.                 | Preserve hash routes for extension-host navigation.                                  |
| `src/modules/injector`         | Content-script shadow-DOM overlay.                        | Keep shadow styles in `injector.css`; do not inject Tailwind into the page.          |

`src/Apps/HTMLInjector`, `src/Apps/ServiceWorker`, and `src/Apps/constants.ts`
no longer exist. Do not recreate scraper or message-bridge modules.
`src/modules/injector` is the content-script overlay: it renders into a shadow root
inside the host page, so it uses relative imports (no dedicated alias). Its
Tailwind entry is `injector.css` (`@import 'tailwindcss'` + `:host` theme vars),
imported with `?inline` and appended as a `<style>` inside the shadow root — this
keeps `tai:` utilities and preflight scoped to the overlay. Injector icons live in
`components/Icons` (react-icons/Lucide, `strokeWidth` default `2.7`), mirroring
`apps/web/src/components/Icons`.

## Patterns In Use

### Container and presentation components

Pages and containers coordinate data and navigation. Reusable components such as
`Button`, `Box`, `BaseLayout`, and form controls render UI from props.

Icon-only buttons use the generic `ButtonIcon` from `@common/components`, which
takes the icon as `children` and forwards native button props; the popup's
`ButtonIcon` is a thin preset over it.

### Custom hooks

`useLogin` and the profile hooks isolate mutations, queries, navigation, and
error handling from screen markup. Login is the only auth mutation; registration
is handled by the website.

### Draggable launcher

`useDraggableLauncher` uses pointer events (no drag library), clamps to the
viewport, snaps to the nearest left/right edge on drop, and persists `{ side, y }`
in `chrome.storage.local` under `launcher-position`. Keep drag logic in the hook;
`LauncherButton` only wires handlers and classes. `App` owns the hook, and
`OverlayPanel` uses the same `side`/`y` plus `useViewport` to open beside the
launcher without exceeding the viewport.

### Zustand plus persistence

Zustand stores hold session and selected profile state. Persistence makes the app
reopen with prior context, but storage keys are part of the behavior and must
remain unique.

### React Query server state

Remote user data belongs in TanStack Query. Mutations invalidate
`['USER_INFO']` after writes.

### Configured form rendering

`FormComponent` receives field configuration and uses React Hook Form. Add fields
through typed configuration where possible instead of duplicating field markup.

## Rules For New Code

- Keep `manifest.config.ts` as the source of truth for entry points and permissions.
- Use existing path aliases: `@modules/*`, `@common/*`, and `@lang/*`. Prefer
  aliases over deep relative paths; keep intra-module imports relative. The
  `@popup:*`, `@injector/*`, and `@all/*` aliases no longer exist.
- Keep Tailwind utility classes in the extension prefixed with `tai:` (Tailwind 4
  variant-style). Write `tai:flex`, `tai:grid`, `tai:bg-primary`; with variants the
  prefix comes first: `tai:hover:bg-primary`, `tai:disabled:text-txt3`,
  `tai:active:scale-95`, `tai:last:border-none`. Never use unprefixed or dash-form
  `tai-`/`ik-` utilities; `apps/web` stays unprefixed.
- Type API payloads and response data. Replace `any` at boundaries as code is touched.
- Keep the API base URL in `VITE_SERVICE_URL`; never hardcode deployment credentials
  or bearer tokens. Website links use `VITE_WEB_URL`, exposed as `WEB_URL` from
  `@modules/popup/api`.
- Use shared session/auth contracts from `@talentor/contracts` (`UserResponse`,
  `LoginRequest`). `useSessionStore` persists the `UserResponse` user and token under
  the `session` key.
- Treat localStorage keys as public state contracts: `session`, `jobProfile`, and
  `current-path` must not collide.
- Use `HashRouter` paths; do not switch navigation to browser history without
  extension-host support.
- Do not hand-edit `dist/`; it is generated by the build.
- Review authentication and profile ownership before rendering or mutating user data.

## Current Implementation Risks

- `GET /api/v1/user` returns a `UserResponse` without an embedded `userJobProfile`;
  consumers must not assume profiles are included.
- Extension refresh-token handling is out of scope: the HttpOnly `refresh_token`
  cookie is not used, so access-token expiry forces a re-login.
- `useJobProfileResumeFormStore` is currently unused and persists under `job-post-form`.
- Several API and form surfaces use `any`; backend field names and types are not fully aligned.
- The extension declares a profile delete path that the backend does not implement.
- `index.html` is built as the overlay iframe target via
  `build.rollupOptions.input.overlay`; CRXJS does not derive HTML entries from
  `web_accessible_resources`, so keep that input in `vite.config.ts`.

## Commands

Use Bun from the repository root.

```bash
bun install
bun run dev:extension      # Vite dev server on port 5174
bun run --cwd apps/extension lint
bun run --cwd apps/extension typecheck
bun run --cwd apps/extension build
bun run verify             # format:check -> lint -> typecheck -> build
```
