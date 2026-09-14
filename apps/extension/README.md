# Talentor Navigator Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Chrome extension for Talentor. The legacy LinkedIn scraper, background service
worker, and browser-action popup have been removed. The remaining source is the
authenticated Talentor application (login and profile management), retained for
an upcoming in-page overlay.

## Features

- **Login**: Sign in with an existing Talentor account (registration is handled on the website)
- **Profile Management**: Create, edit, select, and delete candidate profiles
- **Multi-language Support**: Built-in internationalization (i18n)

> The popup application is not yet referenced by the manifest; the production
> build currently emits only the manifest and icons while the overlay is built.

## Installation

#### 1. Clone repository:

```bash
git clone https://github.com/talentor-ai/navigator_extension.git
```

#### 2. Install dependencies using Bun:

```bash
bun install
```

#### 3. Development mode:

```bash
bun run dev
```

#### 4. Production build:

```bash
bun run build
```

## Development

### Tech Stack

- **Frontend:** React 18 + TypeScript

- **Build Tool:** Vite 5

- **Chrome Extension:** CRXJS Vite Plugin

- **State Management:** Zustand

- **API Handling:** React Query + Axios

- **UI Framework:** Ant Design 5 + Tailwind CSS

- **Internationalization:** i18next

### Key Dependencies

- **@tanstack/react-query:** Data fetching and caching

- **react-hook-form:** Form management

- **lodash:** Utility functions

- **zustand:** State management

- **i18next:** Localization

- **antd:** UI components

## Scripts

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --max-warnings 0",
  "typecheck": "tsc -b",
  "format": "prettier . --write",
  "verify": "bun run format:check && bun run lint && bun run typecheck && bun run build"
}
```

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository

2. Create your feature branch

3. Commit your changes

4. Push to the branch

5. Open a Pull Request

## Disclaimer

This extension uses AI-generated content. Users should review and verify all automatically generated resume content before use.
