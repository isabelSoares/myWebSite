---

description: "Task list for correcting the README local setup instructions"
---

# Tasks: Correct README Local Setup Command

**Input**: User requirement to document `npm i` instead of `npm ci` for local setup.

**Repository context**: The application is in `ts-app/`; the project README at the repository root is the canonical local setup guide. No feature `plan.md`, `spec.md`, data model, contracts, or research documents were available.

**Tests**: No test tasks included because tests were not explicitly requested and this is a documentation-only change.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the documentation change scope.

- [x] T001 Confirm the canonical local setup instructions are in `README.md` and the application working directory is `ts-app/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No shared code or infrastructure prerequisites are required for this documentation-only change.

- [x] T002 Verify the existing `ts-app/package.json` provides the documented `npm start`, `npm test`, and `npm run build` scripts before editing `README.md`

**Checkpoint**: Documentation scope and referenced commands are confirmed.

---

## Phase 3: User Story 1 - Correct Local Installation Instructions (Priority: P1) MVP

**Goal**: A developer following the repository README uses the supported local dependency installation command.

**Independent Test**: Read the `Run locally` section in `README.md` and confirm its setup block runs `cd ts-app`, then `npm i`, then `npm start`, with no `npm ci` instruction remaining in that local setup flow.

### Implementation for User Story 1

- [x] T003 [US1] Replace `npm ci` with `npm i` in the local setup code block in `README.md`
- [x] T004 [US1] Review the complete `Run locally` section in `README.md` for accurate ordering and consistency with `ts-app/package.json`

**Checkpoint**: User Story 1 is independently complete when the README accurately documents local installation with `npm i`.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Validate the documentation-only change without modifying application code.

- [x] T005 [P] Check `README.md` for unintended changes and confirm the local setup command appears as `npm i`
- [x] T006 Run the documented validation commands `npm test -- --watchAll=false` and `npm run build` from `ts-app/` if dependencies are installed, and record any environment-related failure

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on T001 and blocks the user story.
- **User Story 1 (Phase 3)**: Depends on T002.
- **Polish (Phase 4)**: Depends on T003 and T004; T005 can run independently after the edit, while T006 validates the documented project commands.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other user stories; it is the sole MVP story.

### Parallel Opportunities

- T005 can run independently of T006 after the README edit is complete.
- No user stories can be parallelized because this feature contains only User Story 1.

## Parallel Example: User Story 1

```text
After T003 and T004 complete:
- T005: Inspect README.md for unintended changes and verify npm i
- T006: Run the existing test and build commands from ts-app/
```

## Implementation Strategy

### MVP First

1. Complete T001 and T002 to confirm scope and command availability.
2. Complete T003 and T004 to correct and review `README.md`.
3. Complete T005 to verify the exact documentation change.
4. Run T006 when the local dependencies are available.

### Incremental Delivery

1. Update the local install command in `README.md`.
2. Review the surrounding instructions for consistency.
3. Validate the documentation and, when possible, run the existing test and build checks.

## Format Validation

All tasks use the required checklist format: checkbox, sequential task ID, optional `[P]` marker, required `[US1]` label for user-story tasks, and an explicit file path in each description.
