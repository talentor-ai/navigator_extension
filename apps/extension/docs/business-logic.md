# Navigator Extension Business Logic

## Product Purpose

Talentor Navigator is being repurposed into an in-page overlay. The legacy
LinkedIn job scraper, job-application flow, and generated-resume history were
removed. What remains is the authenticated Talentor application (login and
profile management), which the upcoming overlay will embed.

## Actors And Responsibilities

- **Job seeker:** authenticates and maintains source profiles.
- **Talentor service:** authenticates the seeker and stores profiles.
- **Overlay (planned):** a fixed launcher on every page that opens the
  application in a panel via an extension-origin iframe.

## User Journeys

### 1. Authenticate (login-only)

1. Seeker opens the application.
2. Seeker logs in with username and password.
3. The returned token and `UserResponse` user are persisted in the `session` Zustand store.
4. Axios reads the persisted token and sends it as a Bearer token on later API requests.

Account registration happens on the website, not in the extension: the login
screen links to `${VITE_WEB_URL}/register`.

Refresh uses an HttpOnly `refresh_token` cookie. Extension refresh-token handling
is out of scope, so an expired access token requires logging in again.

### 2. Create and select profile

1. Seeker opens profile settings (`/profile`).
2. Seeker enters personal links, skills, languages, about-me text, and experience.
3. Profile API sends the profile to the backend.
4. Seeker selects a profile ID; the selection persists under `jobProfile`.

## Removed Features

The following are gone from the source and must not be reintroduced without an
explicit decision:

- LinkedIn job scraping (`HTMLInjector`, `JobPostScrapper`, `ApplyButton`).
- The background service worker message bridge.
- The browser-action popup.
- Manual job-post entry and job-application submission (`POST /api/v1/jobs/apply`).
- Generated-resume history (`/my-cvs`) and its store.

The popup application source is retained only for the upcoming overlay iframe.

## Product Boundaries And Known Gaps

- The extension currently declares no manifest entry for its UI; the production
  build emits only the manifest and icons until the overlay phase wires the app.
- `GET /api/v1/user` returns `UserResponse` without `userJobProfile`; the extension
  type adds it optionally and must not assume profiles are embedded.
- Profile deletion uses a backend path that is not implemented yet.
- Profile display still contains hardcoded/mock presentation data in `InformationGrid`.
- The extension has no account-registration flow; signup lives on the website at
  `${VITE_WEB_URL}/register`.

## Trust And Privacy Expectations

Seeker profiles are personal employment data. Keep transport authenticated,
avoid logging raw prompts, protect API secrets, and require seeker review before
using any generated content.
