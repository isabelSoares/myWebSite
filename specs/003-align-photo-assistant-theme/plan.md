# Implementation Plan: Align AI Photo Assistant Theme

**Branch**: `fix/ai-photo-design` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/003-align-photo-assistant-theme/spec.md`

## Summary

Audit the site's established visual baseline across About, Experience, Projects, and Hobbies, then align the AI photo assistant with the existing light and dark themes. Reuse the app's inherited semantic theme tokens for the assistant's surfaces, typography, borders, buttons, status, and result states. Preserve the photo workflow and verify visual and keyboard usability across the full set of assistant states and responsive sizes.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 17.0.2, Sass 1.67

**Primary Dependencies**: Create React App 5.0.1, Material UI 5.14.8, CSS custom properties, Jest/React Testing Library

**Storage**: No new storage. The existing site theme preference remains persisted by the app.

**Testing**: Existing Jest/React Testing Library component and app tests, production build, and manual light/dark visual and keyboard review. No visual-regression runner is present.

**Target Platform**: Responsive web app targeting current Chrome, Firefox, and Safari versions per `ts-app/package.json` browserslist.

**Project Type**: Frontend web application (Create React App).

**Performance Goals**: Theme appearance updates immediately with the existing theme switch; no new network requests or noticeable interaction delay.

**Constraints**: Retain current photo-assistant behavior and privacy messaging; inherit the existing theme; preserve responsive layout and keyboard access; check text and meaningful control indicators against their actual backgrounds.

**Scale/Scope**: Review four routed site sections in light and dark themes; align one embedded assistant across empty, selected, drag-over, reviewing, error, and completed states.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The checked-in constitution contains template placeholders rather than ratified project principles, constraints, or gates. No project-specific constitutional requirements can be inferred. **Pre-research gate: PASS** — the feature reuses the established site theme and adds no service, persistence, or architectural layer. **Post-design gate: PASS** — the generated data model describes only existing transient UI state, and the UI contract adds no external service or persistence contract.

## Project Structure

### Documentation (this feature)

```text
specs/003-align-photo-assistant-theme/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui.md
```

### Source Code (repository root)

```text
ts-app/src/
├── index.css
├── App.tsx
├── App.test.tsx
└── components/
    ├── top-bar/TopBar.scss
    ├── about-me/AboutMe.scss
    ├── resume/ResumeCV.scss
    ├── hobbies/Hobbies.scss
    └── personal-projects/
        ├── PersonalProjects.scss
        ├── PhotoAssistant.tsx
        ├── photo-assistant.scss
        └── PhotoAssistant.test.tsx
```

**Structure Decision**: Keep the feature in the existing single frontend app. The audit uses the shared theme definitions in `index.css`, theme propagation in `App.tsx`, and reference page styles. The visual update is scoped to `photo-assistant.scss` and, only if an integration detail requires it, assistant-specific markup in `PhotoAssistant.tsx`. Existing assistant tests are the place to preserve functional behavior; add focused theme-state assertions there if the markup exposes stable state semantics. The UI contract documents observable appearance and state behavior without creating a new public service interface.

## Complexity Tracking

No constitution violations identified; no additional architectural complexity is introduced.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
