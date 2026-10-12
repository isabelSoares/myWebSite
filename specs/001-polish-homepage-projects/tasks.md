---
description: "Task list for polishing homepage and projects UI"
---

# Tasks: Polish Homepage & Projects

**Input**: Design documents from `specs/001-polish-homepage-projects/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `contracts/ui.md`

**Tests**: No new automated tests were requested. Update the existing homepage expectation that conflicts with the requested removal, then run the existing suite and the quickstart checks.

**Organization**: Tasks are grouped by the four prioritized user stories. The current app structure and dependencies already exist; no infrastructure or package additions are required.

## Phase 1: Setup

**Purpose**: Confirm the existing frontend setup and shared styling baseline before implementation.

- [X] T001 Confirm the existing React/Sass setup and light/dark theme tokens in `ts-app/package.json` and `ts-app/src/index.css`; preserve the current uncommitted edits and add no dependencies.

---

## Phase 2: Foundational

**Purpose**: Identify work that must block every user story.

No foundational implementation is required: all routes, theme tokens, components, and uploader state already exist. User stories can proceed independently after T001.

---

## Phase 3: User Story 1 - Clear homepage navigation and actions (Priority: P1) 🎯 MVP

**Goal**: Give homepage actions white resting, darker-teal hover, and light-teal focus/pressed states; distinguish rounded TopBar hover from its selected state; keep personal-project cards off the homepage.

**Independent Test**: Visit `/` in light and dark themes; verify hover has a visibly darker teal background and contrasting text while focus/activation remains light teal; verify unselected TopBar hover differs from the selected item; confirm no personal-project cards appear.

### Implementation for User Story 1

- [X] T002 [P] [US1] Set homepage actions to white at rest, clearly darker theme teal on hover, and light teal on focus/press; use a high-contrast hover foreground in both themes in `ts-app/src/components/about-me/AboutMe.scss`.
- [X] T003 [P] [US1] Keep the homepage free of the personal-projects section and its cards while preserving the other profile sections in `ts-app/src/components/about-me/AboutMe.tsx`.
- [X] T004 [P] [US1] Use a clearly darker dark-mode teal with light foreground for unselected TopBar hover; preserve the light-teal selected state while hovered and retain rounded corners in `ts-app/src/components/top-bar/TopBar.scss`.
- [X] T005 [US1] Replace the stale homepage project-card expectation with an absence expectation in `ts-app/src/App.test.tsx`.

**Checkpoint**: Homepage actions and navigation show the expected states, the project section is absent, and its existing route-level expectation matches the new behavior.

---

## Phase 4: User Story 2 - Scan the Projects page comfortably (Priority: P1)

**Goal**: Left-align all Projects page text and let the introduction use the available content width.

**Independent Test**: Open `/projects` at desktop and narrow mobile widths; inspect the intro, headings, descriptions, labels, project actions, and page-level overflow.

### Implementation for User Story 2

- [X] T006 [P] [US2] Left-align the Projects intro, assistant heading/description, project list headings, and project-card content; remove narrow intro width constraints while retaining page gutters in `ts-app/src/components/personal-projects/PersonalProjects.scss`.

**Checkpoint**: Projects copy and titles are left-aligned and the intro spans the content area at desktop and mobile widths.

---

## Phase 5: User Story 3 - Find and use the photo upload area (Priority: P2)

**Goal**: Clearly separate the uploader from Projects page prose with a rounded box containing a visible file-picker button, empty-file status, upload guidance, review action, and privacy message.

**Independent Test**: On `/projects`, verify the rounded box and empty content, select a valid image using the button and drag/drop, then check unsupported and oversized file feedback without submitting to the remote worker.

### Implementation for User Story 3

- [X] T007 [P] [US3] Add a visible “Choose photo” control that opens the existing file input, show “No file chosen” before selection and the filename after selection, and route supported drag/drop files through the same validation in `ts-app/src/components/personal-projects/PhotoAssistant.tsx`; preserve “Present when a file is selected,” “JPG/JPEG, PNG, or WEBP,” “Must be at most 10 MB,” and “Exists only for the current review session; not persisted.”
- [X] T008 [US3] Strengthen the rounded upload box so it is clearly separate from the Projects description and contains the file control, prompt, guidance, “Review photo,” and privacy note with visible focus styling in `ts-app/src/components/personal-projects/photo-assistant.scss`.

**Checkpoint**: Visitors can distinguish the rounded upload box from project copy, select a photo by button or drag/drop, and see the correct validation and review states.

---

## Phase 6: User Story 4 - Discover horizontal photo browsing (Priority: P2)

**Goal**: Show a rightward cue after each photo-strip instruction and preserve horizontal browsing.

**Independent Test**: Open `/hobbies`; confirm every album instruction includes a right arrow; scroll a multi-image strip right and open a frame.

### Implementation for User Story 4

- [X] T009 [P] [US4] Append a right-pointing arrow after “Scroll to explore” for every album, including single-image albums, in `ts-app/src/components/hobbies/PhotoAlbum.tsx`.
- [X] T010 [US4] Style the photo-strip hint and arrow so they remain legible and do not obstruct horizontal scrolling at desktop and mobile widths in `ts-app/src/components/hobbies/PhotoAlbum.scss`.

**Checkpoint**: Every strip shows the cue and visitors can still scroll horizontally through all available frames.

---

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: Verify the completed stories together against the visitor-facing contract and quickstart.

- [X] T011 Run the automated test, assistant URL validation, and production build commands in `specs/001-polish-homepage-projects/quickstart.md`.
- [ ] T012 Perform the desktop/mobile, light/dark browser scenarios in `specs/001-polish-homepage-projects/quickstart.md`; confirm upload content is contained in a distinct rounded box and button/drop flows work as specified by `specs/001-polish-homepage-projects/contracts/ui.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: T001 confirms the existing stack and tokens; no project initialization is needed.
- **Foundational (Phase 2)**: No tasks; there is no shared infrastructure prerequisite.
- **User Stories (Phases 3-6)**: Each depends only on T001 and can proceed independently of the other stories.
- **Polish (Phase 7)**: T011 and T012 depend on completion of all four stories; the manual visual pass can follow the automated checks.

### User Story Dependencies

- **User Story 1 (P1)**: Starts after T001; independent of other user stories.
- **User Story 2 (P1)**: Starts after T001; independent of other user stories.
- **User Story 3 (P2)**: Starts after T001; uses the existing uploader and is independent of other user stories.
- **User Story 4 (P2)**: Starts after T001; uses the existing album strips and is independent of other user stories.

### Dependency Graph

```text
T001
 ├── US1: T002, T003, T004 → T005 (T005 follows the homepage markup change)
 ├── US2: T006
 ├── US3: T007 → T008
 └── US4: T009 → T010
       All story checkpoints → T011, T012
```

### Parallel Opportunities

- Within US1, T002, T003, and T004 touch separate files and can proceed in parallel; T005 follows T003.
- US2's T006 can proceed in parallel with US1, US3, and US4 after T001.
- US3's T007 can proceed in parallel with the other stories; T008 follows T007.
- US4's T009 can proceed in parallel with the other stories; T010 follows T009.
- All four user stories can be assigned in parallel after setup because they modify separate component areas.

### Parallel Execution Examples

- **US1**: Work on T002 (`AboutMe.scss`), T003 (`AboutMe.tsx`), and T004 (`TopBar.scss`) concurrently; complete T005 after T003.
- **US2**: T006 is a standalone style change and can run alongside any other story.
- **US3**: Complete the TSX grouping in T007, then apply its dependent Sass treatment in T008.
- **US4**: Add the cue in T009, then style it in T010.

---

## Implementation Strategy

### MVP First

1. Complete T001 and confirm no shared setup changes are necessary.
2. Complete User Story 1 (T002-T005), the P1 homepage/navigation increment.
3. Validate the homepage story independently at `/`.
4. Continue with User Story 2 (also P1), then the two P2 stories.

### Incremental Delivery

1. Deliver homepage and navigation polish independently.
2. Deliver the Projects page alignment independently.
3. Deliver the uploader highlight independently.
4. Deliver the hobby-strip directional cue independently.
5. Complete T011 after the desired stories are integrated.

### MVP Scope

User Story 1 is the suggested MVP: it improves the primary landing page and navigation and removes the project listing from the homepage. User Story 2 is the next recommended increment because it is also P1.

---

## Notes

- Every implementation task names the exact file to change.
- No new automated test suite is planned; T005 updates an existing expectation that would contradict the requested homepage behavior.
- The user's current uncommitted edits in `AboutMe.tsx`, `AboutMe.scss`, and `index.css` must be preserved and reconciled rather than overwritten.
- The upload selection and drop behavior reuse existing client-side validation and do not change the remote analysis service contract.
