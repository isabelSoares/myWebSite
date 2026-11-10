# Implementation Plan: Add AgentFlow AI Project to Portfolio

**Branch**: `010-agentflow-ai-project` | **Date**: 2026-11-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/010-agentflow-ai-project/spec.md`

## Summary

Add AgentFlow AI to the Projects page using the same integration pattern as the CV Photo AI entry: a new item in the `moreProjects` collection in `PersonalProjects.tsx` that renders a project card with a kicker, title, summary, technology tags, and a safe external link to the public repository. Register the repository address in the existing external-link verification, and extend the Projects page interface tests to assert the new card and link. No runtime service, backend, storage, or new dependency is added.

## Technical Context

**Language/Version**: TypeScript 4.9.5 and JavaScript (Node.js 24) on the existing frontend toolchain

**Primary Dependencies**: React 17.0.2, Create React App 5.0.1, React Router 6, Sass 1.67, Jest/React Testing Library, existing Node release scripts

**Storage**: No storage. The feature adds a static project entry and an outbound link only.

**Testing**: Jest/React Testing Library (`ts-app/src/App.test.tsx` and the full suite), existing `npm run verify:release` Node script, production build, and the existing accessibility checks

**Target Platform**: Static portfolio published on GitHub Pages; current Chrome, Firefox, and Safari per the `ts-app/package.json` browserslist

**Project Type**: Frontend web application (Create React App)

**Performance Goals**: No new network requests at page load; the card adds no runtime work beyond rendering one additional list item, and navigation occurs only when the visitor activates the link

**Constraints**: Preserve the static-site model, match the CV Photo AI card structure exactly, use safe external-link attributes, support both light and dark appearances, avoid horizontal overflow at narrow widths, and do not alter the AI Photographer Assistant or other existing content

**Scale/Scope**: One new project entry, one new external address in verification, and updates to the Projects page tests; no new routes, components, stylesheets, services, or dependencies

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The checked-in constitution at `.specify/memory/constitution.md` contains template placeholders only; it defines no ratified principles, constraints, or governance gates. No project-specific constitutional requirements can be inferred.

- **Pre-research gate result**: PASS. The feature reuses the existing project-card pattern, adds no backend, storage, dependency, or independently deployed service, and stays within the static portfolio boundary.
- **Post-design gate result**: PASS. The data model describes static presentation data only, and the UI contract documents observable card and link behavior without introducing a new runtime interface.

## Project Structure

### Documentation (this feature)

```text
specs/010-agentflow-ai-project/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui.md            # Phase 1 output
├── checklists/
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks - not created here)
```

### Source Code (repository root)

```text
ts-app/
├── scripts/
│   └── verify-release.js            # Add the AgentFlow AI repository to EXTERNAL_URLS
└── src/
    ├── App.test.tsx                 # Assert the new card, destination, and safe link attributes
    └── components/
        └── personal-projects/
            ├── PersonalProjects.tsx # Add the AgentFlow AI item to moreProjects
            └── PersonalProjects.scss # No change expected; verify existing grid handles two cards
```

**Structure Decision**: Keep the integration inside the existing single frontend application. The project card is data-driven through the existing `moreProjects` collection, so no new component or style is required. Verification follows the established `EXTERNAL_URLS` mechanism, and tests extend the existing Projects page coverage in `App.test.tsx`.

## Complexity Tracking

No constitution violations or additional architectural complexity require justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
