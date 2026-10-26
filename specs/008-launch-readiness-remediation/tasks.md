---
description: "Task list for launch readiness remediation"
---

# Tasks: Launch Readiness Remediation

**Input**: Design documents from `/specs/008-launch-readiness-remediation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Included for the photo-budget helper and the release-check headroom output. The launch evidence tasks use the existing release gate, Jest, Node assertion tests, headless Chrome, published HTTP checks, and the load-smoke command.

**Organization**: Tasks are grouped by user story. US1 closes the launch evidence, US2 corrects the project records, and US3 resolves the capacity, routing, and budget risks.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks; different files, no incomplete dependency.
- **[Story]**: `[US1]`, `[US2]`, or `[US3]`.
- Each task includes the exact repository-relative file path or command target.

## Path Conventions

- Feature records: `specs/008-launch-readiness-remediation/`
- Prior records: `specs/005-pre-launch-verification/`, `specs/006-photo-privacy-and-profile/`, `specs/007-photo-display-and-theme/`
- Scripts and tests: `ts-app/scripts/`
- Repository documentation: `README.md`, `tasks.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the shared verification record and capture the baseline before changing anything.

- [ ] T001 Create `specs/008-launch-readiness-remediation/verification-record.md` with the Metadata, Automated gates, Manual and visual checks, Capacity, Routing, Documentation corrections, and Open items sections plus the `PASS`/`FAIL`/`UNVERIFIED`/`CANCELLED` legend from `specs/008-launch-readiness-remediation/contracts/verification-record.md`
- [ ] T002 Record the baseline manifest composition in `specs/008-launch-readiness-remediation/verification-record.md`: 14 albums, 172 album photos, 2 featured photos, 348 generated derivatives, and the measured footprint near 59.92 MB
- [ ] T003 Record the baseline automated gate output in `specs/008-launch-readiness-remediation/verification-record.md` from `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release`
- [ ] T004 Record baseline live observations in `specs/008-launch-readiness-remediation/verification-record.md`: home 200, deep routes 404 with SPA body, assistant endpoint reachable, and the deployed commit identity

**Checkpoint**: The verification record exists and contains the baseline facts needed by every story.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Reconcile the previously open tasks before executing the evidence checks.

**⚠️ CRITICAL**: T005 must complete before US1 evidence tasks can be recorded.

- [ ] T005 Inventory the six open tasks `T008`, `T012`, `T013`, `T019`, `T023`, and `T024` from `specs/007-photo-display-and-theme/tasks.md` into the reconciliation table in `specs/008-launch-readiness-remediation/verification-record.md`, and note that `T012` is split into a completed metadata correction and an unverified visual review

**Checkpoint**: Every open task has an owner row in the record; US1, US2, and US3 can proceed.

---

## Phase 3: User Story 1 - Owner can prove the site is ready to announce (Priority: P1) 🎯 MVP

**Goal**: Execute and record every formerly open launch check so the launch decision rests on evidence.

**Independent Test**: Review `specs/008-launch-readiness-remediation/verification-record.md` and confirm every formerly open 007 task has a pass, fail, unverified, or cancelled outcome with evidence, and a final launch decision is recorded.

### Evidence tasks for User Story 1

- [ ] T006 [US1] Capture `/` and `/hobbies` with headless Chrome at 320, 768, and 1440 px and record featured-photo framing, natural ratio, overflow, and layout shift in `specs/008-launch-readiness-remediation/verification-record.md` (T008 from 007)
- [ ] T007 [US1] Review the 19 photos whose originals carried EXIF orientation in both the album strip and dialog and record upright, uncropped, unstretched, and control-overlap results in `specs/008-launch-readiness-remediation/verification-record.md` (T012 visual portion from 007)
- [ ] T008 [US1] Verify album frame numbering, Previous/Next direction, first/last disabled states, and left-to-right strip order in `specs/007-photo-display-and-theme/quickstart.md` Scenario 5 and record the result in `specs/008-launch-readiness-remediation/verification-record.md` (T013 from 007)
- [ ] T009 [US1] Verify fresh-storage dark mode on `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path, plus explicit light/dark persistence and absence of a wrong-theme flash, and record the result in `specs/008-launch-readiness-remediation/verification-record.md` (T019 from 007)
- [ ] T010 [US1] Execute all six scenarios in `specs/007-photo-display-and-theme/quickstart.md` at 320, 768, and 1440 px and record pass, fail, or unverified with reasons in `specs/008-launch-readiness-remediation/verification-record.md` (T023 from 007)
- [ ] T011 [US1] Run `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` and record the full result in `specs/008-launch-readiness-remediation/verification-record.md` (T024 from 007)
- [ ] T012 [US1] Reconcile `specs/007-photo-display-and-theme/tasks.md` with `specs/008-launch-readiness-remediation/verification-record.md`: check off items with recorded evidence, and add an inline status note to every item that remains open or unverified
- [ ] T013 [US1] Write the final launch decision (ready, not ready, or blocked) with the accepted limitations and owner actions at the end of `specs/008-launch-readiness-remediation/verification-record.md`

**Checkpoint**: US1 is complete when every formerly open task has an explicit outcome and the launch decision is recorded.

---

## Phase 4: User Story 2 - Project records describe the website that actually shipped (Priority: P2)

**Goal**: Make the current records agree with the manifest, the generated output, and the deployed site.

**Independent Test**: Compare the corrected records with the manifest and filesystem and confirm counts, rotation metadata, footprint, image delivery, and terminology agree with no external-host claims.

### Implementation for User Story 2

- [ ] T014 [P] [US2] Correct the `Invariants` section in `specs/007-photo-display-and-theme/data-model.md` to state that rotation metadata was corrected while derivatives, album order, and photo count stayed unchanged
- [ ] T015 [P] [US2] Correct the `Scale/Scope` and `Performance Goals` sections in `specs/007-photo-display-and-theme/plan.md` to 172 album photos plus 2 featured photos and a 64 MB generated-photo limit
- [ ] T016 [P] [US2] Rewrite `specs/005-pre-launch-verification/scalability-report.md` around the current architecture: locally generated WebP derivatives, 59.92 MB / 348 files, 540 px thumbnails, lazy strips, on-demand dialog images, measured concurrency, and a superseded note for the retired external-host assumption
- [ ] T017 [P] [US2] Update `README.md`: change the generated-footprint sentence to 64 MB and standardize **Experience** and **AI Photographer Assistant** terminology
- [ ] T018 [P] [US2] Update the expected footprint in `specs/006-photo-privacy-and-profile/quickstart.md` from 60 MB to 64 MB
- [ ] T019 [P] [US2] Delete the stray root `tasks.md` and confirm `README.md` still contains the completed local-setup instructions
- [ ] T020 [US2] Run the consistency sweep from `specs/008-launch-readiness-remediation/quickstart.md` step 7 and record every corrected artifact in the Documentation corrections section of `specs/008-launch-readiness-remediation/verification-record.md`

**Checkpoint**: US2 is complete when the manifest-derived counts, footprint, architecture, and terminology agree across all current records.

---

## Phase 5: User Story 3 - Launch capacity and deep-link behavior are decided, not assumed (Priority: P3)

**Goal**: Measure published capacity, record the direct-link behavior and decision, and restore generated-photo headroom.

**Independent Test**: Review the capacity and budget records and confirm each risk has a measured result or accepted limitation, and `npm run validate:photos` prints a headroom margin of at least 1 MB.

### Tests for User Story 3 (write first)

- [ ] T021 [P] [US3] Add Node assertion coverage in `ts-app/scripts/validate-photo-limits.test.js` for the headroom helper at below-limit, exactly-at-limit, and above-limit values, and confirm the test fails before the helper exists
- [ ] T022 [P] [US3] Extend `ts-app/scripts/validate-photo-privacy.test.js` to assert that the `photos.total-size` detail contains the footprint, limit, and `headroom` text

### Implementation for User Story 3

- [ ] T023 [US3] Change `GENERATED_TOTAL_MAX_BYTES` from `60 * MB` to `64 * MB` and add the remaining-bytes and footprint-formatting helper in `ts-app/scripts/lib/photo-limits.js`; derive the over-limit message from the constant
- [ ] T024 [US3] Update `ts-app/scripts/validate-photo-privacy.js` so the `photos.total-size` detail reports `{used} MB generated across {n} files; {headroom} MB headroom of {limit} MB`
- [ ] T025 [US3] Record the direct-link observation and the accepted launch decision for `/`, `/resume`, `/projects`, and `/hobbies` in `specs/008-launch-readiness-remediation/verification-record.md` and in `specs/005-pre-launch-verification/scalability-report.md`
- [ ] T026 [US3] Run `cd ts-app && npm run load:smoke -- --concurrency=100 --duration=15 --url=https://isabelsoares.github.io/myWebSite/` and then the same command with `--concurrency=1000`, and record the highest clean run, error rate, p95 latency, routes exercised, and `PROVEN`/`UNPROVEN`/`RE-SCOPED` target status in `specs/008-launch-readiness-remediation/verification-record.md` and `specs/005-pre-launch-verification/scalability-report.md`
- [ ] T027 [US3] Run `cd ts-app && npm run validate:photos` and confirm the output shows the 64 MB limit and at least 1 MB of headroom; record the exact line in `specs/008-launch-readiness-remediation/verification-record.md`

**Checkpoint**: US3 is complete when capacity, routing, and budget each have a measured or explicitly accepted outcome.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and launch decision across all stories.

- [ ] T028 Run `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` after all changes and record the final `Release check: PASS` line in `specs/008-launch-readiness-remediation/verification-record.md`
- [ ] T029 Run `cd ts-app && npx tsc --noEmit`, `npx eslint src --ext .ts,.tsx`, and `npm test -- --watchAll=false`; record the results in `specs/008-launch-readiness-remediation/verification-record.md`
- [ ] T030 Run `cd ts-app && npm run build` and `npm run validate:site-assets`; record the results in `specs/008-launch-readiness-remediation/verification-record.md`
- [ ] T031 Review `git diff --stat` and the changed files for unintended visitor-facing changes, secrets, or photo-derivative changes; record the review outcome in `specs/008-launch-readiness-remediation/verification-record.md`
- [ ] T032 Review `specs/008-launch-readiness-remediation/verification-record.md` and confirm that every launch-critical item is `PASS` or an accepted limitation, and that no `UNVERIFIED` item is silently treated as passing

**Checkpoint**: All stories are complete and the record states an explicit, evidence-backed launch decision.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: Depends on T001; T005 blocks the US1 evidence recording.
- **US1 (Phase 3)**: Depends on T001 and T005. T012 depends on T006–T011; T013 depends on T012.
- **US2 (Phase 4)**: Depends on T001 for the record. T020 depends on T014–T019.
- **US3 (Phase 5)**: Depends on T001. T021 and T022 are tests written before T023/T024; T027 depends on T023/T024.
- **Polish (Phase 6)**: Depends on all desired stories. T032 depends on T028–T031.

### User Story Dependencies

- **US1 (P1)**: Independent; delivers the MVP launch evidence.
- **US2 (P2)**: Independent of US1; corrects records only.
- **US3 (P3)**: Independent of US1 and US2; adds the budget change and capacity evidence. Its release-gate rerun in Polish supersedes the earlier US1 release run.

### Within Each User Story

- Record the test first for the budget helper, confirm it fails, then implement the helper and reporting.
- Capture visual evidence before reconciling the 007 task list.
- Correct the data-model and plan before the consistency sweep.
- Measure capacity and routing before writing the final launch decision.

### Parallel Opportunities

- Setup: T002–T004 all append to the same verification record, so they run sequentially after T001.
- US1: the T006–T009 checks may be executed concurrently, but their results are written to the same record sequentially; T010 and T011 follow.
- US2: T014–T019 touch different files and can run in parallel; T020 follows them.
- US3: T021 and T022 touch different test files and can run in parallel. T025 touches the same report as T016, so run it after T016 if US2 and US3 proceed in parallel; T026 and T027 follow.
- Polish: T028–T031 share the verification record and build output, so they run sequentially.

---

## Parallel Example: User Story 1

```text
Task: "Capture featured-photo framing at 320/768/1440 px"
Task: "Review the 19 EXIF-oriented photos in strip and dialog"
Task: "Verify album direction and first/last bounds"
Task: "Verify dark mode, persistence, and no flash"
```

These checks can run concurrently, but each result is written to `verification-record.md` in sequence to avoid conflicting edits.

## Parallel Example: User Story 2

```text
Task: "Correct the 007 data-model invariant"
Task: "Correct the 007 plan counts"
Task: "Rewrite the 005 scalability report"
Task: "Update README footprint and terminology"
Task: "Update the 006 quickstart footprint expectation"
Task: "Delete the stray root tasks.md"
```

## Parallel Example: User Story 3

```text
Task: "Add headroom helper tests"
Task: "Add photos.total-size headroom assertion"
Task: "Record direct-link observations and decision" (after T016 if US2 runs first)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001–T005.
2. Execute T006–T011 and capture the evidence.
3. Reconcile the 007 task list in T012 and record the launch decision in T013.
4. Stop and review whether the evidence supports announcing the site.

### Incremental Delivery

1. Setup + Foundational → record ready.
2. US1 → launch evidence complete → announce or hold based on the record.
3. US2 → records corrected → future changes build on accurate facts.
4. US3 → capacity, routing, and budget decided → launch risks bounded.
5. Polish → final gate rerun and explicit decision.

### Notes

- Do not regenerate photos or change visitor-facing behavior.
- A visual check without captured evidence is `UNVERIFIED`, never `PASS`.
- Treat the manifest and the deployed site as the source of truth when a record disagrees.
- Do not commit unless the user explicitly asks.
