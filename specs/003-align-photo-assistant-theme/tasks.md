# Tasks: Align AI Photo Assistant Theme

**Input**: Design documents from `specs/003-align-photo-assistant-theme/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `contracts/ui.md`

**Tests**: No new automated tests are requested. Existing tests and the documented manual visual matrix are run as validation tasks.

**Organization**: Tasks are grouped by the two user stories in `spec.md`, in priority order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with tasks in different files that have no unfinished dependency.
- **[Story]**: User story label from `spec.md` (`US1` or `US2`).
- Every task description names the relevant project file path.

## Path Conventions

- Frontend application: `ts-app/src/`
- Feature documentation: `specs/003-align-photo-assistant-theme/`

## Phase 1: Setup

**Purpose**: Project initialization and basic structure.

The existing React application, shared theme, assistant component, and test setup are already present. No project initialization or new dependencies are required.

## Phase 2: Foundational

**Purpose**: Blocking prerequisites shared by user stories.

No additional foundation is needed: the app already applies and persists the active theme in `ts-app/src/App.tsx`, and shared theme tokens are defined in `ts-app/src/index.css`. User-story work can start immediately.

---

## Phase 3: User Story 1 - Use the assistant in either site theme (Priority: P1) 🎯 MVP

**Goal**: Make the AI photo assistant feel integrated with the rest of the site in light and dark modes while retaining its existing photo workflow.

**Independent Test**: On `/projects`, inspect the empty, selected-photo, drag-over, reviewing, error, and completed states in light and dark themes. Toggle themes without reloading, then verify text, controls, focus, and layout at desktop and 320 CSS px widths without losing the current assistant state.

### Implementation for User Story 1

- [x] T001 [P] [US1] Replace the assistant's fixed palette and font declarations with the existing semantic site theme token equivalents in `ts-app/src/components/personal-projects/photo-assistant.scss`; retain non-color spacing, radius, and layout values.
- [x] T002 [P] [US1] Style the upload card, drop target, preview, actions, buttons, progress indicator, error, result tips, tags, and privacy text in `ts-app/src/components/personal-projects/photo-assistant.scss` so default, hover, focus, disabled, drag-over, reviewing, error, and completed states use the active theme and readable foreground/background pairings.
- [ ] T003 [US1] Execute the assistant visual matrix in `specs/003-align-photo-assistant-theme/quickstart.md` and correct any theme-switch, state-preservation, keyboard-focus, contrast, or 320 CSS px reflow failures in `ts-app/src/components/personal-projects/photo-assistant.scss` and, only where existing semantics prevent the required behavior, `ts-app/src/components/personal-projects/PhotoAssistant.tsx`.

**Checkpoint**: The assistant uses the active site theme in both modes and its full photo-review flow remains visually usable on narrow and wide screens.

---

## Phase 4: User Story 2 - Confirm the site-wide visual baseline (Priority: P2)

**Goal**: Verify and document the shared site visual language and intentional page-specific exceptions, then confirm the assistant follows that baseline.

**Independent Test**: Review About, Experience, Projects, and Hobbies in both light and dark modes. Record shared typography, color, surface, border, and control treatments plus intentional exceptions, and compare the Projects-page assistant with the result.

### Implementation for User Story 2

- [x] T004 [P] [US2] Review the light and dark treatments in `ts-app/src/components/about-me/AboutMe.scss`, `ts-app/src/components/resume/ResumeCV.scss`, `ts-app/src/components/personal-projects/PersonalProjects.scss`, `ts-app/src/components/hobbies/Hobbies.scss`, and `ts-app/src/components/hobbies/PhotoAlbum.scss`; update the audit in `specs/003-align-photo-assistant-theme/research.md` with the shared baseline and intentional exceptions.
- [x] T005 [US2] Compare the aligned assistant in `ts-app/src/components/personal-projects/photo-assistant.scss` against the documented site baseline and surrounding Projects page styles in `ts-app/src/components/personal-projects/PersonalProjects.scss`; record the final comparison and any justified exceptions in `specs/003-align-photo-assistant-theme/research.md`.

**Checkpoint**: All four sections have been reviewed in both modes, intentional exceptions are distinguished from inconsistencies, and the assistant no longer introduces an unrelated theme.

---

## Phase 5: Polish & Cross-Cutting Validation

**Purpose**: Verify functionality and build readiness across the completed stories.

- [x] T006 Run the focused and full existing Jest suites and production build using the commands in `specs/003-align-photo-assistant-theme/quickstart.md` and `ts-app/package.json`; resolve any regressions in the affected assistant styles/component and preserve current upload, validation, retry, result, and privacy behavior.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No project setup changes are needed.
- **Foundational (Phase 2)**: No shared blocking changes are needed; existing theme and app infrastructure are available.
- **User Stories (Phase 3+)**: US1 is the P1 MVP. US2's initial site audit can proceed alongside US1 styling; its final assistant comparison follows US1 completion.
- **Polish (Phase 5)**: Depends on the desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: No dependency on US2; the existing shared token baseline is documented in `research.md` and can drive implementation.
- **US2 (P2)**: T004 is independently executable and parallelizable with US1 styling. T005 depends on the aligned assistant from T001-T003 so it can verify the end state against the full-site audit.

### Within Each User Story

- **US1**: T001 establishes token mappings; T002 applies and verifies styles across each component/state; T003 checks the end-to-end visual and responsive contract and resolves findings.
- **US2**: T004 audits the four routes and documents exceptions; T005 makes the final Projects-page assistant-to-baseline comparison.

### Parallel Opportunities

- T004 can run in parallel with T001 and T002 because the audit/report uses page styles and `research.md`, while assistant theming changes `photo-assistant.scss`.
- US1 tasks T001-T003 remain sequential because they modify and verify the same assistant styling surface.
- T005 and T006 wait for the relevant implementation and audit tasks to complete.

## Parallel Example: User Story 1 and User Story 2

```text
While one implementer completes T001-T002 in:
  ts-app/src/components/personal-projects/photo-assistant.scss

another can complete T004 by auditing page styles and recording results in:
  specs/003-align-photo-assistant-theme/research.md
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Reuse existing theme tokens for the assistant and style all visible states (T001-T002).
2. Complete the light/dark, keyboard, state-preservation, and responsive checks (T003).
3. Stop and validate the assistant independently before proceeding to the P2 site-wide audit.

### Incremental Delivery

1. Deliver and independently validate US1 as the P1 MVP.
2. Complete the cross-route audit in US2, then compare the finished assistant with the documented baseline.
3. Run existing tests and the production build as the final cross-cutting check.

## Notes

- `[P]` marks tasks that can be run concurrently without editing the same file.
- `[US1]` and `[US2]` map directly to user stories in `spec.md`.
- No test-writing tasks are included because the feature specification does not request new automated tests; T006 runs existing tests and the manual review is part of T003/T004.
- T003 remains open for rendered browser checks because this environment has no installed browser executable or browser automation package; source-level theme/contrast checks and automated tests have passed.
