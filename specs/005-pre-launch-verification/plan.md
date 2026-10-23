# Implementation Plan: Pre-Launch Website Verification

**Branch**: `chore/pre-launch-verification` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-pre-launch-verification/spec.md`

## Summary

Prepare the static portfolio for public launch by making release verification repeatable and evidence-based. The plan keeps the existing React application and GitHub Pages deployment, adds an offline release-check command that validates content, local assets, routes, manifest metadata, and deployment inputs, and verifies the production build locally. Photo delivery is improved with lazy loading, while the external image host and the external photo assistant are treated as explicit capacity dependencies. Scalability is measured with a local concurrent-request smoke test and documented against the 1,000-simultaneous-visitor launch target.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 17.0.2, Node.js 24 in CI

**Primary Dependencies**: react-scripts 5.0.1, React Router 6, MUI 5, Sass, Axios, MobX; no application backend

**Storage**: Static files only; browser `localStorage` stores the dark-mode preference

**Testing**: Jest through `react-scripts`, React Testing Library, and Node `assert` scripts

**Target Platform**: Static website on GitHub Pages beneath `/myWebSite/`; modern desktop and mobile browsers

**Project Type**: Frontend-only web application

**Performance Goals**: 95% of visits show usable content within 3 seconds on broadband and 5 seconds on mobile; 1,000 simultaneous visitors across main pages with less than 1% errors during a launch spike

**Constraints**: No server-side runtime; GitHub Pages bandwidth/build soft limits; photographs are hotlinked from `raw.githubusercontent.com` (about 245 MB across 202 files); the photo assistant depends on an independently operated external endpoint; CI uses Node.js 24 on Ubuntu 24.04

**Scale/Scope**: Four main routes, roughly 172 album photos, a single maintainer, and a launch-day traffic spike rather than sustained high traffic

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the unfilled template: it names no ratified principles, quality gates, or governance rules. There are therefore no enforceable constitution-specific gates. This plan follows the conventions already present in the repository:

- Keep the site a static, frontend-only application.
- Validate changes with tests and a production build before deployment.
- Preserve the existing GitHub Pages deployment path and `/myWebSite/` base path.
- Avoid new runtime dependencies unless they remove a demonstrated release risk.

**Result**: PASS with no violations. If the constitution is ratified later, this plan must be re-checked against it.

## Project Structure

### Documentation (this feature)

```text
specs/005-pre-launch-verification/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── release-verification.md
│   └── routes-and-assets.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
ts-app/
├── public/
│   ├── manifest.json            # Install metadata and icon references
│   ├── flower.ico               # Existing site icon
│   ├── robots.txt
│   └── photos/                  # Only images served directly by the site
├── scripts/
│   ├── validate-assistant-url.js
│   ├── validate-assistant-url.test.js
│   ├── validate-site-assets.js  # New: local references, manifest, album photos
│   ├── verify-release.js        # New: ordered release-readiness runner
│   └── load-smoke.js            # New: local concurrent-request smoke test
├── src/
│   ├── App.tsx                  # Routes, theme, dark-mode persistence
│   ├── components/
│   │   ├── about-me/
│   │   ├── hobbies/             # Photo albums and lazy-loaded strips
│   │   ├── personal-projects/   # Photo assistant and failure states
│   │   ├── resume/
│   │   └── top-bar/
│   └── config/assistant.ts
└── package.json                 # Add verify scripts without new dependencies

photos/                          # External image source used at runtime via raw GitHub URLs
.github/workflows/deploy-pages.yml  # Existing build, validation, and Pages deployment
```

**Structure Decision**: Reuse the existing single frontend application under `ts-app/`. Extend the existing `ts-app/scripts/` folder with plain Node checks so the readiness command works in CI without adding dependencies. Keep feature documentation under `specs/005-pre-launch-verification/`.

## Phase 0: Research Decisions

Research is consolidated in [research.md](./research.md). Key decisions:

1. Build the release check from existing Node, Jest, ESLint, and CRA tooling instead of adding a test framework.
2. Validate local references statically so the check is deterministic and offline; keep external link checks optional.
3. Preserve the current SPA deployment model, including the `404.html` fallback for direct routes.
4. Keep the current external photo host for launch, add lazy loading to offscreen album images, and document its throttling/bandwidth limitation as a launch risk with a CDN migration path.
5. Treat local concurrent-request testing as a smoke signal only; GitHub Pages scaling is controlled by the host and cannot be proven from the repository.

## Phase 1: Design Artifacts

- [data-model.md](./data-model.md) defines the verification entities and their validation rules.
- [contracts/release-verification.md](./contracts/release-verification.md) defines the release-check command, checks, output, and exit codes.
- [contracts/routes-and-assets.md](./contracts/routes-and-assets.md) defines the public route, asset, manifest, and SPA-fallback contract.
- [quickstart.md](./quickstart.md) documents the runnable end-to-end validation flow.

## Post-Design Constitution Check

Re-checked after Phase 1: the design remains static, frontend-only, uses existing tooling, adds no runtime dependencies, and keeps the existing deployment path. **Result**: PASS, no violations.

## Complexity Tracking

No constitution violations or unjustified complexity were identified. The new scripts are two plain Node files that reuse the existing build output and source tree; no new services, frameworks, or storage layers are introduced.
