# Tasks: Dark Mode Default Appearance

**Input**: Design documents from `/specs/009-dark-mode-default/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/appearance-default.md`, `quickstart.md`

**Tests**: Automated regression coverage is included for the appearance default, explicit persistence, and the manifest guard because `plan.md` and `contracts/appearance-default.md` require repeatable verification.

**Organization**: Tasks are grouped by user story so each story can be verified independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Include exact file paths in descriptions

## Path Conventions

- Application root: `ts-app/`
- Public assets: `ts-app/public/`
- Application source: `ts-app/src/`
- Node validation scripts: `ts-app/scripts/`
- Feature documentation: `specs/009-dark-mode-default/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the baseline before changing theme metadata or tests.

- [X] T001 Run the existing appearance and asset checks from `ts-app/` with `npm test -- --watchAll=false` and `npm run validate:site-assets`, and record the baseline pass/fail result.
- [X] T002 [P] Review `specs/009-dark-mode-default/plan.md`, `research.md`, `data-model.md`, `contracts/appearance-default.md`, and `quickstart.md` and confirm there are no unresolved decisions or `NEEDS CLARIFICATION` items.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm the shared appearance contract that every story depends on.

**⚠️ CRITICAL**: No user story verification can be completed until this phase is done.

- [X] T003 Confirm `ts-app/src/theme/appearance.ts` implements the contract: storage key `dark-mode`, explicit dark `"true"`, explicit light `"false"`, and missing, empty, invalid, or unreadable values resolve to dark. Do not change the key or value format.
- [X] T004 [P] Confirm `ts-app/public/index.html` contains the inline pre-paint bootstrap that applies `dark-mode` to the document root, does not consult `prefers-color-scheme`, and sets the initial `theme-color` meta value to `#17262b`.
- [X] T005 Confirm `ts-app/src/App.tsx` initializes from the shared resolver, keeps the document-root class and MUI palette synchronized, and applies the resolved appearance to every route.
- [X] T006 [P] Confirm the current coverage in `ts-app/src/App.test.tsx` and `ts-app/src/theme/appearance.test.ts` for dark default, explicit light, explicit dark, toggle, and route changes.

**Checkpoint**: Foundation confirmed — user story verification can proceed.

---

## Phase 3: User Story 1 - First-time visitors see dark mode (Priority: P1) 🎯 MVP

**Goal**: A visitor with no saved preference sees dark mode on every route, regardless of the operating-system appearance.

**Independent Test**: Clear the `dark-mode` key or use a fresh private window, set the OS to light appearance, and open `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path. Every page must open dark with no light flash.

### Tests for User Story 1

- [X] T007 [P] [US1] Add a direct-route regression test in `ts-app/src/App.test.tsx` that renders `/resume`, `/projects`, `/hobbies`, and an unknown path with no saved `dark-mode` value and asserts `document.documentElement` has the `dark-mode` class.
- [X] T008 [P] [US1] Extend `ts-app/src/theme/appearance.test.ts` to assert that missing, empty, and invalid `dark-mode` values resolve to dark and that no explicit choice is written back.

### Implementation for User Story 1

- [X] T009 [US1] Verify `resolveAppearance` and `readAppearance` in `ts-app/src/theme/appearance.ts` keep missing, empty, invalid, and unreadable values resolving to dark and never read the operating-system color scheme.
- [X] T010 [US1] Verify the `ts-app/public/index.html` bootstrap applies dark before React renders when `localStorage.getItem('dark-mode')` is `null`, `"unexpected"`, or throws.
- [X] T011 [US1] Run `npm test -- --watchAll=false --testPathPattern='(App|appearance)\\.test'` from `ts-app/` and confirm the new and existing US1 tests pass.

**Checkpoint**: User Story 1 is independently verifiable: a fresh visitor gets dark mode on every route.

---

## Phase 4: User Story 2 - Returning visitors keep their explicit choice (Priority: P2)

**Goal**: An explicit light or dark choice survives reloads and route changes, and a storage write failure does not break the toggle.

**Independent Test**: Choose light, reload and navigate, then choose dark and repeat. Confirm the chosen appearance persists, the toggle label/icon agree, and the cached preference overrides the dark default.

### Tests for User Story 2

- [X] T012 [US2] Add a test in `ts-app/src/App.test.tsx` that sets `dark-mode` to `"true"`, renders a non-home route, and asserts dark mode remains active across route navigation.
- [X] T013 [P] [US2] Add a test in `ts-app/src/theme/appearance.test.ts` that `writeAppearance` does not throw and still attempts the explicit value when storage writes fail.

### Implementation for User Story 2

- [X] T014 [US2] Verify `ts-app/src/theme/appearance.ts` writes only `"true"` or `"false"` under `dark-mode`, and `ts-app/src/App.tsx` still updates in-memory appearance when a storage write fails.
- [X] T015 [US2] Verify the toggle in `ts-app/src/components/top-bar/TopBar.tsx` exposes the correct accessible label and icon for the current mode, updates immediately, and has a visible keyboard focus state.
- [X] T016 [US2] Run `npm test -- --watchAll=false --testPathPattern='(App|appearance)\\.test'` from `ts-app/` and confirm the US1 and US2 tests pass together.

**Checkpoint**: User Stories 1 and 2 work independently: the default is dark, and explicit choices are honored.

---

## Phase 5: User Story 3 - The dark default applies cleanly from first paint (Priority: P3)

**Goal**: Dark mode is applied before the first visible paint and every theme-dependent surface, including browser and installed-app chrome, matches dark by default.

**Independent Test**: Load the site in a fresh session with throttling and inspect the first rendered frame, `theme-color`, native scrollbars, and the installed-app manifest. Confirm no light flash and no mixed appearance.

### Implementation for User Story 3

- [X] T017 [P] [US3] Add `color-scheme: light` to `:root` and `color-scheme: dark` to `:root.dark-mode` in `ts-app/src/index.css` so native controls and scrollbars follow the resolved appearance.
- [X] T018 [P] [US3] Set `theme_color` and `background_color` to `#17262b` in `ts-app/public/manifest.json`.
- [X] T019 [P] [US3] Extend `validateManifest` in `ts-app/scripts/validate-site-assets.js` to report a failure when the public manifest's `theme_color` or `background_color` is not `#17262b`.
- [X] T020 [P] [US3] Add a passing fixture and a failing fixture for manifest theme colors in `ts-app/scripts/validate-site-assets.test.js`.
- [X] T021 [US3] Verify `ts-app/public/index.html` and `applyAppearance` in `ts-app/src/theme/appearance.ts` keep the `theme-color` meta value synchronized with the resolved mode at first paint and on toggle.
- [X] T022 [US3] Run `npm run validate:site-assets` and `npm test -- --watchAll=false` from `ts-app/` and confirm the manifest guard and appearance tests pass.
- [X] T023 [US3] Execute `specs/009-dark-mode-default/quickstart.md` scenarios 1–6 for first paint, OS light appearance, saved choices, invalid storage, and installed-app/browser surfaces, and record the outcome.

**Checkpoint**: All three stories are independently functional, and the dark default covers browser and installed-app surfaces.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature and guard against unrelated changes.

- [X] T024 Run `npm test -- --watchAll=false` from `ts-app/` and confirm the full Jest/RTL suite passes.
- [X] T025 Run `npm run build` from `ts-app/` and confirm the production build succeeds without warnings that affect the theme.
- [X] T026 Run `npm run verify:release` from `ts-app/` and confirm zero failed checks, including the manifest color guard.
- [X] T027 Execute `specs/009-dark-mode-default/quickstart.md` scenario 7 on the deployed site and record whether the behavior is correct, stale, or overridden by a saved light preference.
- [X] T028 Review the initial implementation diff and confirm no unrelated changes outside `ts-app/public/manifest.json`, `ts-app/src/index.css`, `ts-app/scripts/validate-site-assets.js`, `ts-app/scripts/validate-site-assets.test.js`, `ts-app/src/App.test.tsx`, and `ts-app/src/theme/appearance.test.ts`.

## Phase 7: Post-Analysis Accessibility Remediation

**Purpose**: Close the FR-012 verification gap found by `/speckit.analyze`.

- [X] T029 [P] Add `ts-app/scripts/validate-theme-accessibility.js` and its tests to check WCAG contrast for light and dark theme pairs and require visible `:focus-visible` outlines on global and key component controls.
- [X] T030 Wire the accessibility check into `npm run verify:release`, add keyboard-focus Jest coverage, and record the full test/build/release result in `verification-record.md`.
- [X] T031 Add a light-mode action-border token and About-page pill borders, guard the new pair in the accessibility validator, and verify the light render in headless Chrome.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories.
- **User Stories (Phases 3–5)**: Depend on Foundational. US1 and US2 both edit `ts-app/src/App.test.tsx`, so run US1 before US2 or coordinate those edits. US3 is independent of US1/US2 except for the final full-suite run.
- **Polish (Phase 6)**: Depends on all user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories. Delivers the MVP default.
- **US2 (P2)**: No behavioral dependency on US1, but its `ts-app/src/App.test.tsx` edit should follow US1's edit to avoid conflicts.
- **US3 (P3)**: No dependency on US1/US2 behavior; it completes the surface and first-paint guarantees.

### Within Each User Story

- Add or extend tests before running the focused suite.
- Verify implementation files against the contract before marking the story complete.
- Complete each story's focused test run before moving to the next priority.

### Parallel Opportunities

- T002 and T004/T006 are read-only verification tasks that can run alongside other work.
- T007 and T008 edit different test files and can run in parallel.
- T013 edits a different file from T012 and can run in parallel with US2's App test work.
- T017–T020 edit four different files (`index.css`, `manifest.json`, validator, validator test) and can run in parallel.
- Polish validation commands T024–T026 should run sequentially because the build and release verification both touch `ts-app/build/`.

---

## Parallel Example: User Story 1

```bash
# Run the two test additions in parallel:
Task: "Add direct-route dark-default test in ts-app/src/App.test.tsx"
Task: "Extend invalid-value coverage in ts-app/src/theme/appearance.test.ts"
```

## Parallel Example: User Story 3

```bash
# Run the four surface changes in parallel:
Task: "Add color-scheme in ts-app/src/index.css"
Task: "Set dark manifest colors in ts-app/public/manifest.json"
Task: "Extend validateManifest in ts-app/scripts/validate-site-assets.js"
Task: "Add manifest-color fixtures in ts-app/scripts/validate-site-assets.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. **STOP and VALIDATE**: Run the focused US1 tests and the fresh-storage scenario.
5. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → baseline confirmed.
2. US1 → dark default on every route → validate independently.
3. US2 → explicit light/dark persistence → validate independently.
4. US3 → first-paint and surface consistency → validate independently.
5. Polish → full suite, build, release verification, deployed-site check.

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together.
2. Once foundational is done:
   - Developer A: US1 test and verification tasks.
   - Developer B: US2 test and verification tasks (after US1's `App.test.tsx` edit).
   - Developer C: US3 metadata, CSS, and validator tasks.
3. Complete Polish after all stories.

---

## Notes

- `[P]` tasks touch different files and have no incomplete dependencies.
- The production diff should stay limited to theme metadata, one CSS declaration, and regression coverage.
- Do not change content, routes, photo assets, photo privacy behavior, or the storage key.
- Do not force dark mode over an explicit light choice; the spec requires explicit choices to persist.
- Commit after each logical group only when requested.
