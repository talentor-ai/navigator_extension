# Navigator Extension Documentation

Talentor Navigator is a Manifest V3 Chrome extension that runs on LinkedIn job pages. It injects an extraction button, moves scraped job data into a popup, sends the job and a selected seeker profile to the Talentor service, and displays generated resume history.

## Documents

- [Architecture](architecture.md): extension contexts, component hierarchy, message flow, state, routes, and backend integration.
- [Coding](coding.md): module boundaries, React patterns, state/data conventions, extension rules, and verification commands.
- [Business Logic](business-logic.md): user journeys, LinkedIn extraction, resume generation workflow, persistence, and product limits.

## Scope

This documentation describes the current source wiring in `manifest.config.ts` and `src/`. `dist/` is generated output. The extension prepares resumes; it does not automatically submit LinkedIn applications.
