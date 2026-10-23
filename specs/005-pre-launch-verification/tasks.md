---
description: "Task list for pre-launch website verification"
---

# Tasks: Pre-Launch Website Verification

**Input**: Design documents from `/specs/005-pre-launch-verification/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: The repository already has Jest and Node assertion tests. Regression test tasks are included where they protect a launch-critical contract; they are not a full TDD mandate.

**Organization**: Tasks are grouped by user story so each story can be verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (`US1`, `US2`, `US3`)
- Every task includes an exact file path.

## Path Conventions

- Application: `ts-app/src/`, `ts-app/public/`
- Verification scripts: `ts-app/scripts/`
- Deployment: `.github/workflows/`
- Photos: `photos/<country>/`
- Feature documents: `specs/005-pre-launch-verification/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the shared reporting and route definitions used by the release and load checks.

- [X] T001 Create the shared check-report helper in `ts-app/scripts/lib/check-report.js` that formats `PASS`, `FAIL`, `SKIP`, and `WARN` lines, produces the JSON summary `{status, checks, summary}`, and never prints environment variable values.
- [X] T002 [P] Create the shared route and base-path definitions in `ts-app/scripts/lib/routes.js` exporting `/`, `/resume`, `/projects`, `/hobbies`, the published base path `/myWebSite/`, and the required build files `index.html` and `404.html`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the command surface and check categories before implementing individual stories.

**⚠️ CRITICAL**: Complete this phase before starting US1, US2, or US3.

- [X] T003 Add placeholder npm script entries `verify:release`, `validate:site-assets`, and `load:smoke` in `ts-app/package.json`; keep existing `start`, `build`, `test`, and assistant validation scripts unchanged.
- [X] T004 Create the category registry and exit-code constants in `ts-app/scripts/lib/check-report.js` for `content`, `assets`, `routes`, `deployment`, and `performance`; map failure to exit code `1` and missing prerequisites to exit code `2` per `contracts/release-verification.md`.

**Checkpoint**: Shared reporting, routes, command names, and exit-code semantics exist. User stories can proceed in parallel.

---

## Phase 3: User Story 1 - Browse a complete, error-free portfolio (Priority: P1) 🎯 MVP

**Goal**: Every main section renders complete content, supports direct visits and refreshes, and shows a clear not-found experience for unknown addresses.

**Independent Test**: Open `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path directly in a fresh browser session; confirm content renders, assets load, navigation works, and unknown paths show the SPA not-found experience.

### Implementation for User Story 1

- [X] T005 [US1] Add a not-found view in `ts-app/src/components/not-found/NotFound.tsx` with a clear message and a link back to the homepage, matching the existing page layout and accessibility conventions.
- [X] T006 [US1] Register the not-found view as the fallback route in `ts-app/src/App.tsx` so unknown addresses render the not-found experience instead of an empty page.
- [X] T007 [P] [US1] Add `loading="lazy"` and `decoding="async"` to offscreen images that are still eager in `ts-app/src/components/about-me/AboutMe.tsx` and `ts-app/src/components/hobbies/Hobbies.tsx`, preserving eager loading for the above-the-fold portrait.
- [X] T008 [P] [US1] Add route regression tests in `ts-app/src/App.test.tsx` covering direct loads for `/resume`, `/projects`, `/hobbies`, and an unknown path showing the not-found view.
- [X] T009 [US1] Verify every local image, icon, and document reference in `ts-app/src` and `ts-app/public` resolves, including album photos under `photos/<country>/`; fix any missing reference found and keep `ts-app/public/manifest.json` icons aligned with existing files.
- [X] T010 [US1] Run `npm test -- --watchAll=false` and `npm run build` in `ts-app`; fix any failure before marking the story complete.

**Checkpoint**: US1 is independently demonstrable. The site can be shown publicly with all four sections and a clear fallback route.

---

## Phase 4: User Story 2 - Confirm release readiness before announcing the site (Priority: P2)

**Goal**: A single repeatable command reports an unambiguous pass or fail for content, assets, routes, deployment inputs, and build output.

**Independent Test**: Run `npm run verify:release` from `ts-app` and confirm it prints one status line per required check, names any failing path, exits `0` only when all required checks pass, and exits `1` when a required check fails.

### Implementation for User Story 2

- [X] T011 [P] [US2] Implement `ts-app/scripts/validate-site-assets.js` to scan `ts-app/src` and `ts-app/public` for local asset references, verify `photos/<country>/` album files, verify every manifest icon exists in `public/` and `build/`, and verify `build/index.html` plus `build/404.html`; report the exact missing path and respect the `Asset` validation rules in `data-model.md`.
- [X] T012 [P] [US2] Implement the assistant URL check integration in `ts-app/scripts/verify-release.js` by reusing `ts-app/scripts/validate-assistant-url.js`; fail when the configured URL is missing, insecure, local, placeholder, a repository URL, or a retired Render host.
- [X] T013 [US2] Implement the ordered release runner in `ts-app/scripts/verify-release.js` with the checks `types`, `lint`, `tests`, `tests.scripts`, `assistant-url`, `assets.local`, `assets.photos`, `assets.manifest`, `build`, `routes.fallback`, `assets.build`, and `privacy.no-secrets`, following the order and output shape in `contracts/release-verification.md`.
- [X] T014 [US2] Add `--json` and `--online` handling to `ts-app/scripts/verify-release.js`; `--json` emits the machine-readable report, and `--online` adds external URL checks without making them required by default.
- [X] T015 [US2] Wire the real commands into `ts-app/package.json`: `validate:site-assets`, `verify:release`, and the existing assistant URL validation scripts; do not add new runtime dependencies.
- [X] T016 [US2] Add Node assertion tests in `ts-app/scripts/validate-site-assets.test.js` covering a missing local public asset, a missing album photo, a missing manifest icon, a missing `404.html`, and a fully valid fixture.
- [X] T017 [US2] Update `.github/workflows/deploy-pages.yml` to run `npm run verify:release` with `REACT_APP_AI_ASSISTANT_URL` set from `vars.AI_ASSISTANT_URL`, replacing redundant duplicate build steps while preserving the Pages artifact upload and deployment behavior.
- [X] T018 [US2] Run `npm run verify:release` from `ts-app` with a valid assistant URL; fix every failing check and confirm the final line is `Release check: PASS` with exit code `0`.

**Checkpoint**: US2 is independently demonstrable. The owner has a repeatable go/no-go command, and CI enforces it.

---

## Phase 5: User Story 3 - Serve many visitors without degradation (Priority: P3)

**Goal**: The site's launch-spike behavior is measured, the photo payload risk is documented, and the owner knows how to verify published-site capacity.

**Independent Test**: Run `npm run load:smoke` against the production build and confirm it reports request count, error rate, and latency; then run the documented procedure against the published address and record the result in the scalability report.

### Implementation for User Story 3

- [X] T019 [P] [US3] Implement `ts-app/scripts/load-smoke.js` using Node.js built-ins to start a local static server for `ts-app/build`, issue the configured concurrent requests across the routes from `ts-app/scripts/lib/routes.js`, and report request count, error count, error rate, and p95 latency labeled `local-build`.
- [X] T020 [US3] Add the `load:smoke` script to `ts-app/package.json` with a default concurrency of 100 and duration of 15 seconds; allow `--concurrency`, `--duration`, and `--url` overrides without new dependencies.
- [X] T021 [US3] Review image loading in `ts-app/src/components/hobbies/PhotoAlbum.tsx` and ensure album strip images remain lazy-loaded while dialog images load on demand; confirm no full-size album collection is requested on initial `/hobbies` load.
- [X] T022 [US3] Create `specs/005-pre-launch-verification/scalability-report.md` documenting the local smoke result, the external `raw.githubusercontent.com` photo dependency, the approximate 245 MB / 202-file photo footprint, and the published-site load-test procedure.
- [X] T023 [US3] Run `npm run build` and `npm run load:smoke` in `ts-app`; record the local result and any bottleneck in `specs/005-pre-launch-verification/scalability-report.md`.
- [X] T024 [US3] Run the published-site load test procedure against the deployed address and record concurrent visitors, duration, error rate, p95 latency, and whether albums or the assistant were exercised; state clearly whether the 1,000-visitor target was met or remains limited by the external image host.

**Checkpoint**: US3 is independently demonstrable. The owner has measured evidence and a documented capacity decision.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final launch hygiene and end-to-end validation.

- [X] T025 [P] Update `README.md` with the release workflow (`npm run verify:release`), the load smoke command (`npm run load:smoke`), the launch checklist, and the external-image scalability limitation.
- [X] T026 [P] Stop tracking the committed `.DS_Store` file and confirm `.gitignore` covers operating-system and editor artifacts.
- [X] T027 [P] Confirm the `privacy.no-secrets` check passes and that the new scripts do not print `REACT_APP_AI_ASSISTANT_URL` or any credential value.
- [X] T028 Run the full `specs/005-pre-launch-verification/quickstart.md` procedure end to end; record any manual browser findings and fix blocking issues.
- [X] T029 Review all new scripts and documentation for stale paths, unused files, and contract mismatches with `specs/005-pre-launch-verification/contracts/`; remove or correct anything found.
- [X] T030 Run `npx tsc --noEmit`, `npx eslint src --ext .ts,.tsx`, `npm test -- --watchAll=false`, and `npm run build` in `ts-app` as the final gate.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 and blocks all user stories.
- **US1 (Phase 3)**: Depends on Phase 2; no dependency on US2 or US3.
- **US2 (Phase 4)**: Depends on Phase 2; can run in parallel with US1.
- **US3 (Phase 5)**: Depends on Phase 2 and needs a successful production build; can run in parallel with US1 and US2 once `build/` exists.
- **Polish (Phase 6)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: Independent. Delivers the MVP.
- **US2 (P2)**: Independent of US1. Its asset check inspects the same files but does not require US1's UI changes.
- **US3 (P3)**: Independent of US1 and US2. It uses the shared route definitions and the production build.

### Within Each User Story

- Shared reporting and routes before story implementation.
- Not-found view before route registration.
- Asset validator before the full release runner.
- Release runner before CI wiring.
- Load smoke implementation before measurement.
- Each story ends with its own verification task.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T005, T007, and T008 can run in parallel; T006 depends on T005.
- T011 and T012 can run in parallel; T013 depends on both; T016 depends on T011.
- T019 can start as soon as Phase 2 is complete; T020 depends on T019.
- T025, T026, and T027 can run in parallel in the polish phase.

---

## Parallel Example: User Story 1

```text
Task: "Add a not-found view in ts-app/src/components/not-found/NotFound.tsx"
Task: "Add lazy loading to offscreen images in ts-app/src/components/about-me/AboutMe.tsx and ts-app/src/components/hobbies/Hobbies.tsx"
Task: "Add route regression tests in ts-app/src/App.test.tsx"
```

## Parallel Example: User Story 2

```text
Task: "Implement ts-app/scripts/validate-site-assets.js"
Task: "Implement assistant URL integration in ts-app/scripts/verify-release.js"
```

## Parallel Example: User Story 3

```text
Task: "Implement ts-app/scripts/load-smoke.js"
Task: "Document the external photo dependency in specs/005-pre-launch-verification/scalability-report.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1.
4. **STOP and VALIDATE**: open all four routes directly and confirm the not-found path and asset loading.
5. The site is ready to show, but not yet ready for the owner's formal launch decision.

### Incremental Delivery

1. Setup + Foundational → shared verification infrastructure ready.
2. US1 → complete, error-free browsing → deploy/demo.
3. US2 → repeatable release gate and CI enforcement → use before announcing.
4. US3 → measured load behavior and documented capacity → make the launch decision with evidence.
5. Polish → launch hygiene and final end-to-end validation.

### Parallel Team Strategy

With multiple developers:

1. Complete Setup and Foundational together.
2. Developer A: US1 content and route fixes.
3. Developer B: US2 release verification tooling.
4. Developer C: US3 load smoke and scalability documentation.
5. Integrate, run the full quickstart, and make the launch decision.

---

## Notes

- `[P]` tasks touch different files and have no incomplete dependencies.
- Story labels map each task to the user story it serves.
- A story is complete only after its own verification task passes.
- The release command is the launch gate; warnings about the external image host are expected and do not block launch.
- The local load result is a smoke signal, not proof of GitHub Pages capacity.
