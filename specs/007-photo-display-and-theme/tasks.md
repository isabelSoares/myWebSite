---
description: "Task list for photo framing, album orientation, and dark theme default"
---

# Tasks: Photo Framing, Album Orientation, and Dark Theme Default

**Input**: Design documents from `/specs/007-photo-display-and-theme/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Included because `plan.md` explicitly defines automated coverage for theme resolution, featured dimensions, and album orientation, and because the existing release process runs Jest, photo validation, and the production build.

**Organization**: Tasks are grouped by user story. All three stories are presentation-only and can be implemented independently after the setup baseline.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks; different files, no incomplete dependency.
- **[Story]**: `[US1]`, `[US2]`, or `[US3]`.
- Each task includes the exact repository-relative file path or command target.

## Path Conventions

- Application source: `ts-app/src/`
- Static HTML and CSS: `ts-app/public/` and `ts-app/src/index.css`
- Data and photo assets: `ts-app/src/data/` and `ts-app/public/photos/generated/`
- Tests: colocated `.test.tsx` files and `ts-app/src/theme/appearance.test.ts`
- Feature documentation: `specs/007-photo-display-and-theme/`

---

## Phase 1: Setup (Shared Baseline)

**Purpose**: Record the existing photo metadata and confirm the test baseline before editing presentation code.

- [x] T001 [P] Record the featured entries (`full.width`, `full.height`, `rotation`), the 19 album photos marked `rotation: 90`, and the finding that those originals carry EXIF orientation `6` while their generated derivatives are already upright; keep this inventory for manual verification.
- [x] T002 [P] Run `npm test -- --watchAll=false` and `npm run validate:photos` from `ts-app/` and record the starting results so regressions are distinguishable from pre-existing failures.

**Checkpoint**: Baseline metadata and test results are known.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No shared implementation is required.

There are no blocking foundational tasks. The three user stories touch different concerns and files: featured framing uses `AboutMe`/`Hobbies`, album orientation uses `PhotoAlbum`, and appearance uses `App`/`public/index.html`. They may proceed in parallel after the setup baseline.

**Checkpoint**: User story work can begin.

---

## Phase 3: User Story 1 - Featured photos display without vertical stretching or zoom (Priority: P1) 🎯 MVP

**Goal**: Show the About Me portrait and the Hobbies hero at their natural manifest proportions with no forced crop or zoom.

**Independent Test**: Open `/` and `/hobbies` at 320 px, 768 px, and 1440 px widths; confirm both featured photos are fully visible, undistorted, and not taller or more zoomed than their intrinsic ratio.

### Tests for User Story 1

- [x] T003 [P] [US1] Extend `ts-app/src/components/about-me/AboutMe.test.tsx` and `ts-app/src/components/hobbies/Hobbies.test.tsx` to assert each featured `img` uses the manifest `full.width`, `full.height`, and `alt`, and does not render an inline fixed `aspect-ratio` or `object-fit` override.

### Implementation for User Story 1

- [x] T004 [P] [US1] Update `ts-app/src/components/about-me/AboutMe.scss` to remove `aspect-ratio: 0.78` and `object-fit: cover` from `.about-me-portrait`; use a block image at `width: 100%`, `height: auto`, and `max-width: 100%`, keeping the existing filter and mobile wrap.
- [x] T005 [P] [US1] Update `ts-app/src/components/hobbies/Hobbies.scss` to remove `aspect-ratio: 1.25` and `object-fit: cover` from `.hobby-photography`; use a block image at `width: 100%`, `height: auto`, and `max-width: 100%`, keeping the existing filter and responsive layout.
- [x] T006 [US1] Update `ts-app/src/components/about-me/AboutMe.tsx` to keep the manifest `portrait.full.width`/`height` intrinsic attributes and `alt`, and add `loading="lazy"` and `decoding="async"` if not already present; do not add a fixed aspect ratio or crop override.
- [x] T007 [US1] Update `ts-app/src/components/hobbies/Hobbies.tsx` to keep the manifest `hero.full.width`/`height` intrinsic attributes and `alt`, and keep `loading="lazy"` and `decoding="async"`; do not add a fixed aspect ratio or crop override.
- [x] T008 [US1] Validate `ts-app/src/components/about-me/AboutMe.tsx`, `ts-app/src/components/hobbies/Hobbies.tsx`, and their SCSS files at 320 px, 768 px, and 1440 px widths per `specs/007-photo-display-and-theme/quickstart.md`: full photo visible, natural ratio, no horizontal overflow, and no load-time jump.

**Checkpoint**: User Story 1 is independently complete and is the MVP.

---

## Phase 4: User Story 2 - Album photos keep their intended orientation and browsing direction (Priority: P2)

**Goal**: Stop double-rotating album photos whose EXIF orientation was already normalized by the photo build, correct the stale rotation metadata, and keep album order, Previous/Next, and horizontal browsing moving in the displayed direction.

**Independent Test**: Open every album and review each photo whose original had EXIF orientation in the strip and dialog; confirm it is upright, fully visible, and that Previous/Next and the right-pointing scroll hint follow manifest order.

### Tests for User Story 2

- [x] T009 [P] [US2] Keep `ts-app/src/components/hobbies/PhotoAlbum.test.tsx` coverage for one `rotation: 0` photo and one explicit `rotation: 90` manual-correction fixture; assert the orientation class is applied only to the explicit fixture in both the strip and the opened dialog, that frame numbering follows manifest order, and that Previous is disabled at the first frame and Next at the last frame.

### Implementation for User Story 2

- [x] T010 [US2] Update `ts-app/src/components/hobbies/PhotoAlbum.tsx` to derive a single manual-orientation value from `rotation`, apply an orientation class only for an explicit non-zero `rotation`, and preserve manifest order, opening index, Previous (`index - 1`), Next (`index + 1`), and bounded navigation.
- [x] T011 [P] [US2] Update `ts-app/src/components/hobbies/PhotoAlbum.scss` so `rotation: 0` keeps the portrait `3 / 4` frame with no CSS transform; keep the manual `rotation-90` landscape rule available for future non-EXIF images, prevent clipping in the strip and dialog, keep `max-width`/`max-height` responsiveness, and keep rotated content clear of the close and Previous/Next controls.
- [x] T012 [US2] Set the 19 stale `rotation: 90` values to `0` in `ts-app/photo-sources.json` and `ts-app/src/data/photo-manifest.json`; do not regenerate derivatives. Then review those 19 photos in both the strip and dialog using `specs/007-photo-display-and-theme/quickstart.md`; confirm each is upright, uncropped, unstretched, and not hidden behind dialog controls. Evidence: metadata correction and 19/19 visual review both passed; see `specs/008-launch-readiness-remediation/verification-record.md`.
- [x] T013 [US2] Validate album direction in `ts-app/src/components/hobbies/PhotoAlbum.tsx`: frame numbers match manifest order, Previous moves backward, Next moves forward, first/last controls are disabled, and the strip scrolls left-to-right with the right-pointing hint.

**Checkpoint**: User Story 2 is independently complete; it does not depend on featured-photo changes.

---

## Phase 5: User Story 3 - Dark mode is the default appearance (Priority: P2)

**Goal**: Resolve a missing appearance preference to dark, apply it before first paint, and preserve an explicit light or dark choice across reloads and routes.

**Independent Test**: Clear `dark-mode` from browser storage, open every route, and confirm dark mode with no light flash; then choose light, reload, and confirm light is retained.

### Tests for User Story 3

- [x] T014 [P] [US3] Add `ts-app/src/theme/appearance.test.ts` and extend `ts-app/src/App.test.tsx` for these cases: missing key resolves dark; `"false"` resolves light; `"true"` resolves dark; unreadable storage resolves dark; toggling writes `"true"`/`"false"`; and the resolved appearance survives a route change. Clear `localStorage` and unmount/remount between cases.

### Implementation for User Story 3

- [x] T015 [P] [US3] Create `ts-app/src/theme/appearance.ts` with the `dark-mode` key, `"true"`/`"false"` values, a resolver that treats missing or unreadable values as dark, read/write helpers that do not throw, and an apply helper that toggles the document-root `dark-mode` class.
- [x] T016 [P] [US3] Update `ts-app/public/index.html` with a small inline head bootstrap that reads the saved preference before first paint; resolve `"false"` to light and everything else to dark; apply the `dark-mode` class to the document root; update the `theme-color` meta value to `#17262b` for dark or `#f4f0e8` for light; wrap storage access in `try/catch`.
- [x] T017 [US3] Update `ts-app/src/App.tsx` to initialize appearance state from the same resolver as the bootstrap, drive both the CSS root class and the MUI palette from that single boolean, persist only explicit choices through the helper, and keep the existing toggle and route behavior; do not consult `prefers-color-scheme`.
- [x] T018 [P] [US3] Review `ts-app/src/index.css` and make the `.dark-mode` variable block apply when the class is on the document root (`:root.dark-mode`); keep the light `:root` values as the explicit-light and fallback palette, and keep body colors driven by the variables.
- [x] T019 [US3] Validate `ts-app/src/App.tsx`, `ts-app/public/index.html`, `ts-app/src/index.css`, and `ts-app/src/components/top-bar/TopBar.tsx` with `specs/007-photo-display-and-theme/quickstart.md`: fresh visits are dark on every route, explicit light/dark choices persist, no wrong-theme flash appears, and the top bar, photo frames, dialogs, and not-found page change together.

**Checkpoint**: User Story 3 is independently complete; it does not depend on photo framing or orientation changes.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final automated and manual verification across all stories.

- [x] T020 [P] Run `npx tsc --noEmit`, `npx eslint src --ext .ts,.tsx`, and `npm test -- --watchAll=false` from `ts-app/`; fix any type, lint, or test failure introduced by the feature.
- [x] T021 [P] Run `npm run build`, `npm run validate:photos`, and `npm run validate:site-assets` from `ts-app/`; confirm the production build succeeds and the photo privacy, manifest, derivative, and site-asset checks still pass.
- [x] T022 [P] Confirm the feature changed only presentation files plus the corrected rotation metadata by comparing `git diff -- ts-app/photo-sources.json ts-app/src/data/photo-manifest.json ts-app/public/photos/generated`; the source list and manifest may show only `rotation: 90` → `0`, and generated derivatives must be unchanged.
- [x] T023 [P] Execute all six scenarios in `specs/007-photo-display-and-theme/quickstart.md` at 320 px, 768 px, and 1440 px widths, including the full 19-photo EXIF-orientation review and the fresh-storage dark-mode check.
- [x] T024 Run `REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release` from `ts-app/`; confirm the complete release check passes and record the result.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: No blocking tasks.
- **User Stories (Phases 3-5)**: Depend only on the setup baseline; they can start in parallel because they touch different files.
- **Polish (Phase 6)**: Depends on all desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: Independent; MVP. Touches `AboutMe.*` and `Hobbies.*`.
- **US2 (P2)**: Independent; touches `PhotoAlbum.*` only.
- **US3 (P2)**: Independent; touches `App.tsx`, `App.test.tsx`, `public/index.html`, `index.css`, and `theme/appearance.*`.

### Within Each User Story

- Write or extend the listed test before the implementation task it covers, and confirm it fails for the reported reason.
- Apply the natural-framing CSS changes before the manual responsive validation.
- Apply the orientation markup and CSS together before the 19-photo review.
- Apply the appearance helper, bootstrap, and React wiring together before the fresh-storage manual check.
- Run the story's independent test before moving to polish.

### Parallel Opportunities

- Setup: T001 and T002 are independent.
- US1: T003, T004, and T005 touch different files and can run in parallel; T006 and T007 touch different components and can run in parallel; T008 follows them.
- US2: T009 can be prepared in parallel with T010/T011; T010 and T011 touch different files and can run in parallel; T012 and T013 follow the implementation.
- US3: T014, T015, T016, and T018 touch different files and can run in parallel; T017 follows T015; T019 follows all implementation tasks.
- Polish: T020, T021, T022, and T023 can run in parallel after all stories; T024 follows the successful checks.

---

## Parallel Example: User Story 1

```bash
# Launch independent test and style tasks together:
Task: "Extend AboutMe.test.tsx and Hobbies.test.tsx for natural featured dimensions"
Task: "Update AboutMe.scss to remove forced aspect-ratio and object-fit cover"
Task: "Update Hobbies.scss to remove forced aspect-ratio and object-fit cover"

# Then update independent components:
Task: "Update AboutMe.tsx intrinsic dimensions and loading behavior"
Task: "Update Hobbies.tsx intrinsic dimensions and loading behavior"
```

## Parallel Example: User Story 3

```bash
# Prepare independent appearance files together:
Task: "Add appearance.test.ts and App.test.tsx theme cases"
Task: "Create src/theme/appearance.ts"
Task: "Add the pre-paint bootstrap to public/index.html"
Task: "Make the dark variable block apply from the document root in index.css"

# Then wire React:
Task: "Update App.tsx to use the resolver, root class, and persisted choice"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 baseline.
2. Complete Phase 3 (US1).
3. Run T008 and validate the featured photos at all three widths.
4. Deploy/demo the natural-framing fix if desired.

### Incremental Delivery

1. US1 → featured photos no longer zoomed or vertically forced → deploy MVP.
2. US2 → album orientation and direction restored → deploy.
3. US3 → dark mode is the default and explicit choices persist → deploy.
4. Polish → run all automated and manual checks before release.

### Parallel Team Strategy

- Developer A: US1 featured framing.
- Developer B: US2 album orientation and direction.
- Developer C: US3 appearance default and persistence.
- After all three, run the polish phase together.

---

## Notes

- [P] tasks touch different files and have no incomplete dependency.
- Do not regenerate photos. Correct only the stale `rotation` metadata in the source list and manifest; generated derivatives are already oriented.
- All current album photos use `rotation: 0`; `90` remains reserved for an explicit future manual correction. Preserve album order and never sort by orientation.
- The default appearance is dark regardless of the operating system setting; only an explicit `"false"` makes the site light.
- Do not commit unless the user explicitly asks.
