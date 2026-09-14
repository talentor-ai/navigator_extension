# Navigator Extension Documentation

Talentor Navigator is a Manifest V3 Chrome extension. The legacy LinkedIn
scraper, background service worker, and browser-action popup have been removed.
The remaining source is the reusable Talentor application (login and profile
management), retained for the upcoming in-page overlay.

## Documents

- [Architecture](architecture.md): current wiring, source hierarchy, routes, state, and backend integration.
- [Coding](coding.md): module boundaries, React patterns, state/data conventions, extension rules, and verification commands.
- [Business Logic](business-logic.md): user journeys, extension scope, persistence, and product limits.

## Scope

This documentation describes the current source wiring in `manifest.config.ts`
and `src/`. `dist/` is generated output. The extension no longer scrapes LinkedIn
job posts, applies to jobs, or renders generated-resume history.

Authentication is login-only. Account registration is handled by the website,
opened from the login screen's Register link; the app stores the authenticated
user and token in the `session` store using `@talentor/contracts` types.

The popup application source is retained but is not yet referenced by the
manifest, so the production build currently emits only the manifest and icons.
The next phase will load the application inside an in-page overlay iframe.
