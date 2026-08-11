# Navigator Extension Architecture

## System Role

`navigator_extension` is a Manifest V3 Chrome extension. It has three runtime contexts:

1. **Popup:** React application for authentication, profile selection, manual job input, resume generation, and history.
2. **Content script:** LinkedIn DOM integration. Runs only on `https://www.linkedin.com/jobs/*`, injects the extraction button, and scrapes visible job fields.
3. **Service worker:** Background bridge between content script messages and the open popup port.

```mermaid
flowchart LR
    LinkedIn[LinkedIn job page] --> Content[HTMLInjector content script]
    Content --> Button[Injected ApplyButton]
    Button -->|JOB_POST_SCRAPPED_ACTION| Worker[ServiceWorker]
    Worker -->|popup port| Home[Popup Home listener]
    Home --> Form[useJobPostFormStore]
    Form --> Generate[GeneratePost]
    Generate --> API[Axios + React Query API layer]
    API --> Service[Talentor Spring Boot service]
    Service --> OpenAI[OpenAI]
    Service --> DB[(PostgreSQL)]
    DB --> History[Popup History]
```

## Build And Manifest Wiring

```text
manifest.config.ts
├── action.default_popup -> index.html
│   └── src/main.tsx
│       └── src/Apps/PopUp/App.tsx
├── background.service_worker -> src/Apps/ServiceWorker/index.ts
└── content_scripts
    └── https://www.linkedin.com/jobs/*
        -> src/Apps/HTMLInjector/index.tsx
```

`src/Apps/PopUp/popup.tsx` exists but is not the current manifest entry.

## Source Hierarchy

```text
src/
├── main.tsx                    Popup React entry
├── Apps/
│   ├── constants.ts            Cross-context message names
│   ├── ServiceWorker/          Content-script/popup bridge
│   ├── HTMLInjector/           LinkedIn DOM integration and scraper
│   │   ├── components/         Injected button
│   │   ├── helpers/             Scraping logic
│   │   └── constants.ts         LinkedIn selectors and scraped fields
│   └── PopUp/
│       ├── api/                Axios clients and endpoint constants
│       ├── components/         Reusable visual/form components
│       ├── containers/          Header, menu, information layout
│       ├── constants/           Routes and session keys
│       ├── hoc/                Auth redirect wrapper
│       ├── hooks/              Cross-page data hooks
│       ├── helpers/            Form/data utilities
│       ├── lang/               i18next setup and translations
│       ├── models/             TypeScript contracts
│       ├── pages/               Login, home, profile, history screens
│       ├── routes/              HashRouter route tree
│       └── store/              Zustand state and persistence
```

## Popup Component Hierarchy

```mermaid
flowchart TD
    Main[main.tsx] --> App[PopUp/App.tsx]
    App --> Query[TanStack QueryClientProvider]
    App --> Theme[Ant Design ConfigProvider]
    App --> Router[HashRouter]
    Router --> Layout[BaseLayout]
    Layout --> Header[Header]
    Layout --> Routes[Router]
    Routes --> Home[Home]
    Home --> Generate[GeneratePost]
    Home --> Empty[NoJobPostMessage]
    Routes --> Profile[Profile]
    Profile --> ProfileList[ProfileList]
    Profile --> EditProfile[EditProfileList]
    Routes --> History[History]
    Routes --> Login[LoginScreen]
    Routes --> Register[RegisterScreen]
```

`Home` owns the popup port connection. When a scrape message arrives, it parses the JSON and merges fields into `useJobPostFormStore`.

## Scrape-to-Resume Sequence

```mermaid
sequenceDiagram
    participant L as LinkedIn DOM
    participant C as HTMLInjector
    participant W as ServiceWorker
    participant P as Popup Home
    participant F as GeneratePost
    participant A as Backend API

    L->>C: DOM mutations expose job action area
    C->>L: Inject ApplyButton
    L->>C: User clicks extraction button
    C->>C: JobPostScrapper reads configured selectors
    C->>W: jobPostScrapped + JSON text
    alt Popup connected
        W->>P: updateJobScrapped over port
    else Popup closed
        W->>W: Store latest payload in memory
        P->>W: Connect with port name popup
        W->>P: Replay latest payload
    end
    P->>F: Merge scraped fields into persisted form
    F->>A: POST /api/v1/jobs/apply with job post + profile ID
    A-->>F: Generated Resume response
    F->>P: Navigate to resume history
```

The confirmation action is defined in the protocol. The popup sends it with `port.postMessage`, while the worker listens for it through `chrome.runtime.onMessage`; current confirmation clearing is therefore unreliable.

## State And Data Flow

| State or layer                 | Storage                      | Responsibility                                            |
| ------------------------------ | ---------------------------- | --------------------------------------------------------- |
| `useSessionStore`              | Persisted as `session`       | User session and JWT. Axios reads token from this record. |
| `useJobProfile`                | Persisted as `jobProfile`    | Selected profile ID for generation and history.           |
| `useJobPostFormStore`          | Persisted as `job-post-form` | Scraped/manual job-post fields.                           |
| `useJobProfileResumeFormStore` | Also `job-post-form`         | Separate form store; key collision risk.                  |
| `useHistoryStore`              | Memory only                  | Optional local resume list state.                         |
| TanStack Query                 | Query cache                  | Remote user/history data and mutation invalidation.       |
| `localStorage['current-path']` | Browser storage              | Last popup route used by menu.                            |

## Backend Contract

| Extension client  | Backend path                             | Use                             |
| ----------------- | ---------------------------------------- | ------------------------------- |
| `fetchSession.ts` | `POST /api/v1/auth/login`                | Login.                          |
| `fetchSession.ts` | `POST /api/v1/auth/register`             | Registration.                   |
| `fetchUser.ts`    | `GET /api/v1/user`                       | Load current user and profiles. |
| Profile API       | `POST`/`PUT /api/v1/user/job-profile`    | Create or update profile.       |
| `resumeApi.ts`    | `POST /api/v1/jobs/apply`                | Generate and persist resume.    |
| `resumeApi.ts`    | `GET /api/v1/resume/history/{profileId}` | Load history.                   |

Declared extension paths for profile deletion and resume download do not currently have matching backend endpoints.
