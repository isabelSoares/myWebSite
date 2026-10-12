# Implementation Plan: Polish Homepage & Projects

**Branch**: `bugfix/proj-page-improvements` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-polish-homepage-projects/spec.md`

## Summary

Polish the site's homepage, Projects page, uploader, and hobby photo strips while retaining the existing routes, theme system, file validation, and privacy behavior. Make homepage actions white at rest with darker-teal hover and light-teal focus/pressed states; keep the personal-projects content on the Projects page only; align and widen the Projects introduction; separate the uploader from explanatory copy with a rounded box, visible file-picker and review actions, empty/selected status, and functional click/drop selection; and make horizontal photo-strip browsing apparent with a right arrow. Use the existing React, TypeScript, Material UI, Sass, and React Testing Library setup without adding dependencies or changing the photo-analysis service contract.

## Technical Context

**Language/Version**: TypeScript 4.9.5, JavaScript, and Sass, as defined by the existing application.

**Primary Dependencies**: React 17, React Router 6, Material UI 5, Sass, and Create React App 5.

**Storage**: No new storage. The selected photo and preview remain transient in the browser; the existing photo-analysis worker behavior is out of scope.

**Testing**: Existing Jest/React Testing Library suite (`react-scripts test`), existing assistant URL validation test, production build, and focused manual browser checks for CSS states, responsive layout, and horizontal scrolling.

**Target Platform**: Existing supported desktop and mobile browsers listed in `ts-app/package.json`.

**Project Type**: Frontend web application.

**Performance Goals**: Preserve current page responsiveness and client-side upload behavior; no new performance-sensitive processing is introduced.

**Constraints**: Retain existing route behavior, light/dark theme support, upload types and 10 MB limit, privacy messaging, and user-facing validation. Avoid new dependencies and unrelated changes. Existing uncommitted edits in `AboutMe.tsx`, `AboutMe.scss`, and `index.css` are part of the worktree and must be preserved.

**Scale/Scope**: Four existing page/component areas: homepage, TopBar, Projects/uploader, and Hobbies photo strips. No new pages, data services, or persistent entities.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- The constitution file currently contains only template placeholders and defines no ratified principles or explicit gates.
- The proposal follows the existing application structure and adds no new architecture, dependency, storage, or service integration.
- Accessibility and responsive requirements are addressed through readable interaction states, keyboard focus visibility, and desktop/mobile validation.
- **Pre-design gate result**: Pass; no constitution-defined violations or unresolved technical clarifications.
- **Post-design re-check**: Pass; the data model remains transient UI state, the UI contract is visitor-facing only, and no new service, persistence, or architectural layer is introduced.

## Project Structure

### Documentation (this feature)

```text
specs/001-polish-homepage-projects/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
ts-app/src/
├── App.tsx
├── App.test.tsx
├── index.css
└── components/
    ├── top-bar/
    │   ├── TopBar.tsx
    │   └── TopBar.scss
    ├── about-me/
    │   ├── AboutMe.tsx
    │   └── AboutMe.scss
    ├── personal-projects/
    │   ├── PersonalProjects.tsx
    │   ├── PersonalProjects.scss
    │   ├── PhotoAssistant.tsx
    │   └── photo-assistant.scss
    └── hobbies/
        ├── Hobbies.tsx
        ├── PhotoAlbum.tsx
        └── PhotoAlbum.scss
```

**Structure Decision**: Keep the changes within the existing page and component boundaries. The app already routes the homepage, Projects page, and Hobbies page through `App.tsx`; presentation is organized alongside each page/component in Sass files. Extend existing tests in `App.test.tsx` and use manual browser verification for pseudo-class styles and real horizontal scrolling.

## Complexity Tracking

No constitution violations or additional architectural complexity require justification.
