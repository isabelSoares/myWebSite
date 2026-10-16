# Implementation Plan: Keep Flower Browser Tab Icon

**Branch**: `fix/ai-photo-design` | **Date**: 2026-10-16 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-add-is-favicon/spec.md`

## Summary

Retain the existing `flower.ico` as the site's browser tab icon and verify that it loads from the published `/myWebSite` base path on all main routes. Preserve the separate “IS.” header action that navigates to the homepage. The current document already points to the flower icon through Create React App's public URL placeholder, so implementation should focus on confirming the path and built output rather than replacing the artwork.

## Technical Context

**Language/Version**: HTML5; static public assets

**Primary Dependencies**: Create React App 5.0.1 public asset handling and `%PUBLIC_URL%`; no new package dependency

**Storage**: None

**Testing**: Production build from `ts-app/`, inspection of built document and icon asset, and browser validation on homepage and direct nested routes.

**Target Platform**: Static portfolio deployed at `https://isabelsoares.github.io/myWebSite`, served by desktop browsers.

**Project Type**: Frontend web application using Create React App.

**Performance Goals**: The existing static icon loads with the document; no runtime icon rendering or added network logic.

**Constraints**: Keep the tab icon as `flower.ico`; preserve correct resolution under `/myWebSite`; keep the header “IS.” homepage navigation unchanged; avoid introducing dependencies or unrelated PWA assets.

**Scale/Scope**: One static browser icon shared by `/`, `/resume`, `/projects`, and `/hobbies`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution contains template placeholders rather than ratified project rules, so no binding project-specific gate can be inferred. **Pre-research gate: PASS** — this feature retains an existing static asset and adds no dependency, service, or persisted data. **Post-design gate: PASS** — the design validates static metadata and browser-visible behavior only.

## Project Structure

### Documentation (this feature)

```text
specs/004-add-is-favicon/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── ui.md
```

### Source Code (repository root)

```text
ts-app/
├── package.json
└── public/
    ├── index.html             # References the tab icon using %PUBLIC_URL%
    ├── manifest.json          # Existing browser metadata; validate icon paths
    └── flower.ico             # Existing tab icon to retain

ts-app/src/components/top-bar/
└── TopBar.tsx                 # Existing IS. homepage action to verify
```

**Structure Decision**: Keep the existing static icon and its current `%PUBLIC_URL%/flower.ico` link in `ts-app/public/index.html` if build and route validation confirm it resolves correctly. Avoid modifying `TopBar.tsx` unless the independent home-action check exposes a defect. Inspect manifest icon paths as part of validation, but do not expand scope into a PWA icon redesign.

## Complexity Tracking

No constitution violations or additional architectural complexity identified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
