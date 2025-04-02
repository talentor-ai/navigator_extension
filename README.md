# Talentor Navigator Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A smart Chrome extension that automates resume optimization using AI. Analyzes job postings, matches keywords with candidate profiles, and generates tailored resumes.

## Features

- **Job Post Analysis**: Extracts key information from job descriptions
- **Keyword Matching**: Identifies crucial skills and requirements
- **Profile Comparison**: Analyzes candidate profiles against job requirements
- **AI Resume Generation**: Creates optimized resumes using AI
- **Resume download**: Instant downloads of generated resumes
- **Multi-language Support**: Built-in internationalization (i18n)

## Installation

#### 1. Clone repository:

```bash
git clone https://github.com/talentor-ai/navigator_extension.git
```

#### 2. Install dependencies using pnpm:

```bash
pnpm install
```

#### 3. Development mode:

```bash
pnpm run dev
```

#### 4. Production build:

```bash
pnpm run build
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
"preview": "vite preview",
"lint": "eslint ."
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
