---

description: "Task list for adding the AgentFlow AI project to the portfolio"
---

# Tasks: Add AgentFlow AI Project to Portfolio

**Input**: Design documents from `specs/010-agentflow-ai-project/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui.md, quickstart.md

**Tests**: Included because FR-012 and FR-013 explicitly require tests and release verification. Write the assertions before or alongside the corresponding implementation and confirm they pass against the final code.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend application: `ts-app/src/`, `ts-app/scripts/`
- Feature documentation: `specs/010-agentflow-ai-project/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing toolchain and understand the card integration point before editing

- [X] T001 Verify prerequisites by running `npm ci` from `ts-app/` with Node.js 24 or newer, confirming the dependency install succeeds
- [X] T002 Review the existing project-card integration in `ts-app/src/components/personal-projects/PersonalProjects.tsx`, `ts-app/src/components/personal-projects/PersonalProjects.scss`, and `ts-app/scripts/verify-release.js` to confirm the card is data-driven and no new component or style is needed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish a known-good baseline before changing user-facing content

**⚠️ CRITICAL**: Confirm the baseline before implementing any user story

- [X] T003 Run `npm test -- --watchAll=false -- App.test.tsx` from `ts-app/` and confirm the existing Projects page and homepage assertions pass before any edits

**Checkpoint**: Baseline is green; user story implementation can begin

---

## Phase 3: User Story 1 - Discover AgentFlow AI on the Projects page (Priority: P1) 🎯 MVP

**Goal**: Render an AgentFlow AI project card on the Projects page with the same structure as the CV Photo AI card.

**Independent Test**: Open `/projects`, confirm the AgentFlow AI card appears with a kicker, title, summary, and tags in the existing project grid, and confirm the homepage shows no project cards.

### Tests for User Story 1 ⚠️

- [X] T004 [US1] Update the Projects page test in `ts-app/src/App.test.tsx` to assert the `AgentFlow AI` heading, the multi-agent patient-support summary, and the `Python · FastAPI · LangGraph · React` tag line; extend the homepage no-cards test to also assert the `AgentFlow AI` heading is absent

### Implementation for User Story 1

- [X] T005 [US1] Add an AgentFlow AI entry to the `moreProjects` collection in `ts-app/src/components/personal-projects/PersonalProjects.tsx` with kicker `MULTI-AGENT AI`, title `AgentFlow AI`, a concise multi-agent patient-support summary, tags `Python · FastAPI · LangGraph · React`, and href `https://github.com/isabelSoares/agentflow-ai`
- [X] T006 [US1] Confirm the existing `.project-grid` and `.project-card` styles in `ts-app/src/components/personal-projects/PersonalProjects.scss` render two cards side by side at wide widths and one column at 760 px and below; make no style change unless a regression is observed

**Checkpoint**: User Story 1 is fully functional and testable independently; the card and its content render, and the homepage remains free of project cards

---

## Phase 4: User Story 2 - Open the AgentFlow AI repository safely (Priority: P1)

**Goal**: Make the AgentFlow AI card's action open the correct public repository in a new tab with safe external-link behavior and an accessible, project-specific name.

**Independent Test**: From `/projects`, locate the AgentFlow AI action, confirm it targets `https://github.com/isabelSoares/agentflow-ai`, opens in a new tab, carries `rel="noopener noreferrer"`, and has an accessible name that includes the project name and the new-tab notice while showing the visible `View project` text.

### Tests for User Story 2 ⚠️

- [X] T007 [US2] Update `ts-app/src/App.test.tsx` to locate the AgentFlow AI link by its destination and assert the `href`, `target="_blank"`, `rel="noopener noreferrer"`, and an accessible name containing both `AgentFlow AI` and the new-tab notice

### Implementation for User Story 2

- [X] T008 [US2] Add optional accessible-context support to the project entry rendering in `ts-app/src/components/personal-projects/PersonalProjects.tsx` and set it for the AgentFlow AI entry so the action's accessible name includes the project name after the visible `View project` text, preserving the existing visible label and the visually hidden new-tab notice; leave the CV Photo AI entry's accessible name unchanged
- [X] T009 [US2] Verify keyboard reachability and focus visibility for the AgentFlow AI action using the existing `.project-card-footer a:focus-visible` style in `ts-app/src/components/personal-projects/PersonalProjects.scss`; make no style change unless focus is not visible

**Checkpoint**: User Stories 1 and 2 both work; the card is discoverable and its repository action is safe and clearly named

---

## Phase 5: User Story 3 - Trust that the portfolio stays accurate and verifiable (Priority: P2)

**Goal**: Include the AgentFlow AI repository in the existing publication verification so broken or incorrect links are reported.

**Independent Test**: Run the release verification with online probing enabled and confirm the AgentFlow AI repository address is checked and any failure is surfaced.

### Implementation for User Story 3

- [X] T010 [P] [US3] Add `https://github.com/isabelSoares/agentflow-ai` to the `EXTERNAL_URLS` list in `ts-app/scripts/verify-release.js`
- [X] T011 [US3] Run `REACT_APP_AI_ASSISTANT_URL="https://<cloudflare-endpoint>/" npm run verify:release -- --online` from `ts-app/` and confirm the AgentFlow AI repository is among the checked addresses and any unreachable or incorrect destination produces a visible warning or failure
- [X] T012 [US3] Confirm the interface test added in T007 still passes via `npm test -- --watchAll=false -- App.test.tsx` from `ts-app/`

**Checkpoint**: All user stories are functional; the new repository is covered by publication verification

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the integration end to end and confirm no regressions

- [X] T013 [P] Run the full Jest and React Testing Library suite with `npm test -- --watchAll=false` from `ts-app/` and confirm the existing accessibility coverage passes
- [X] T014 [P] Run `npm run validate:theme-accessibility` from `ts-app/` and confirm the existing contrast and keyboard-focus checks pass unchanged
- [X] T015 Run `npm run build` from `ts-app/` and confirm the production build succeeds
- [X] T016 Execute the manual validation in `specs/010-agentflow-ai-project/quickstart.md`: verify the two-card grid, single-column narrow reflow, both light and dark appearances, keyboard focus, and new-tab behavior from `/projects`
- [X] T017 Review the final diff for `ts-app/src/components/personal-projects/PersonalProjects.tsx`, `ts-app/src/App.test.tsx`, and `ts-app/scripts/verify-release.js`; confirm the CV Photo AI entry, AI Photographer Assistant section, and all other Projects page content are unchanged

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 because the action is rendered from the new entry
- **User Story 3 (Phase 5)**: The URL registration task T010 can start after Foundational and run in parallel with US1/US2; the verification run T011 depends on T010 and the new entry from T005
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories
- **User Story 2 (P1)**: Depends on User Story 1's card entry; link behavior is part of the same card
- **User Story 3 (P2)**: URL registration is independent; full verification depends on User Story 1

### Within Each User Story

- Tests and assertions are added before or alongside implementation and must pass against the final code
- Card data before link accessibility refinement
- Verification registration before the verification run

### Parallel Opportunities

- T010 (release verification URL) edits `ts-app/scripts/verify-release.js`, a different file from the card work, so it can run in parallel with US1 and US2
- T013 and T014 are independent validation commands and can run in parallel
- T004 and T007 both modify `ts-app/src/App.test.tsx`, so they must run sequentially rather than in parallel
- T005 and T008 both modify `ts-app/src/components/personal-projects/PersonalProjects.tsx`, so they must run sequentially

---

## Parallel Example: User Story 3 alongside User Story 1

```bash
# Different files, no shared code dependency:
Task: "Add the AgentFlow AI repository to EXTERNAL_URLS in ts-app/scripts/verify-release.js"
Task: "Add the AgentFlow AI entry to moreProjects in ts-app/src/components/personal-projects/PersonalProjects.tsx"

# Run after the card and URL registration are complete:
Task: "Run verify:release --online and confirm the AgentFlow AI repository is checked"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm the AgentFlow AI card renders on `/projects` and not on the homepage
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → baseline green
2. Add User Story 1 → validate the card and its content → deploy/demo (MVP)
3. Add User Story 2 → validate safe link behavior and accessible naming
4. Add User Story 3 → validate publication verification includes the new repository
5. Run Phase 6 validation before announcing the site

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1, then User Story 2 (same files)
   - Developer B: User Story 3 URL registration in `ts-app/scripts/verify-release.js`
3. Merge and run the full validation suite

---

## Notes

- [P] tasks use different files and can run concurrently
- [Story] labels map tasks to the specification's user stories for traceability
- The visible project card text remains `View project`; the AgentFlow AI-specific accessible context is additive and does not alter the CV Photo AI entry
- No new dependency, route, component, stylesheet, service, or storage is introduced
- Commit after each task or logical group once the user asks for commits
