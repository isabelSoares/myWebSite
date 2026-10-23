---
description: "Task list for photo privacy, build health, and repository profile"
---

# Tasks: Photo Privacy, Build Health, and Repository Profile

**Input**: Design documents from `/specs/006-photo-privacy-and-profile/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Included because the plan and contracts require automated photo-privacy, tsconfig, and release-check coverage. The feature's `SC-008` explicitly depends on a release check failing against a test fixture.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other marked tasks; different files, no incomplete dependency.
- **[Story]**: `[US1]`, `[US2]`, `[US3]`, or `[US4]`.
- Each task includes the exact repository-relative file path or command target.

## Path Conventions

- Application: `ts-app/src/`, `ts-app/public/`, `ts-app/scripts/`
- Feature docs: `specs/006-photo-privacy-and-profile/`
- Private originals: `PHOTO_ORIGINALS_DIR` (default `../myWebSite-originals/photos`, outside the repository)
- Repository profile: `README.md`, `PHOTO-POLICY.md`, `ts-app/public/robots.txt`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the local photo tooling and shared validation primitives.

- [x] T001 [P] Add `sharp` to `devDependencies` and add `photos:build`, `validate:photos`, `test:photo-privacy`, `validate:tsconfig`, and `test:tsconfig` scripts in `ts-app/package.json`; update `ts-app/package-lock.json` with `npm install`.
- [x] T002 [P] Add `/photos/` and `/photo-originals/` to `.gitignore` as safety entries so private originals cannot be committed accidentally.
- [x] T003 [P] Create `ts-app/scripts/lib/photo-limits.js` exporting the shared limits: thumbnail ≤ 120 KB and ≤ 600 px longest side; full ≤ 500 KB and ≤ 2000 px longest side; generated public photo set < 60 MB; thumbnail target 540 px; full target 1800 px; WebP only.
- [x] T004 [P] Create `ts-app/scripts/lib/photo-manifest.js` with helpers to read/validate `ts-app/photo-sources.json` and `ts-app/src/data/photo-manifest.json`, compute the 12-character `sourceId`, reject absolute or `..` paths, compare published album/photo ordering, and assert generated paths start with `photos/generated/`.
- [x] T005 [P] Create `ts-app/scripts/lib/test-fixtures.js` with temporary repository fixtures for source manifests, generated manifests, and image files so validator tests do not touch the real private originals directory.

---

## Phase 2: Foundational (Photo Pipeline Prerequisites)

**Purpose**: Establish the curation source of truth and the privacy validator that the photo stories and release gate depend on.

**⚠️ CRITICAL**: US1 and US2 must not begin until this phase is complete. US3 and US4 do not consume this pipeline and may start after Setup.

- [x] T006 [P] Create `ts-app/photo-sources.json` with `version: 1`, all 14 albums, all 172 album photos, and the `hero`/`portrait` featured entries from `ts-app/src/components/hobbies/Hobbies.tsx`; preserve album order and rotation values; every `source` MUST be a relative path with no `..` or absolute prefix; every source path MUST be unique; every `alt` MUST be non-empty; every `rotation` MUST be one of `0`, `90`, `180`, or `270`; every album `id` MUST match `^[a-z0-9]+(?:-[a-z0-9]+)*$`; default `published` is `true`.
- [x] T007 [P] Implement `ts-app/scripts/validate-photo-privacy.js` to fail when any tracked path is under `photos/` or `photo-originals/`, any tracked or build-output raster image outside `public/photos/generated/` exceeds 500 KB or 2000 px, any source/README/workflow references `raw.githubusercontent.com/.../photos/`, the manifest and source disagree, a derivative is missing or non-WebP, a derivative exceeds the thumbnail/full limits, an unpublished source appears, or the generated directory contains an orphan file; exit `1` on failure and `2` on unreadable prerequisites.
- [x] T008 Implement `ts-app/scripts/validate-photo-privacy.test.js` with temporary fixtures for each T007 failure: tracked original, raw photo link, oversized raster, manifest/source mismatch, missing derivative, oversized derivative, non-WebP file, unpublished entry, and orphan generated file; each test must pass without network access or `PHOTO_ORIGINALS_DIR`.
- [x] T009 [P] Update `ts-app/scripts/lib/routes.js` to replace the root `PHOTOS_DIR` export with `GENERATED_PHOTOS_DIR`, `PHOTO_MANIFEST_PATH`, and `PHOTO_SOURCES_PATH` constants, and update imports in `ts-app/scripts/validate-site-assets.js` and `ts-app/scripts/verify-release.js` so no script depends on the old root `photos/` directory.

**Checkpoint**: The source manifest, validator, and path constants are ready.

---

## Phase 3: User Story 1 - Keep original photographs out of the public repository (Priority: P1) 🎯 MVP

**Goal**: Publish only approved, metadata-stripped derivatives generated from private originals while preserving every album and featured image.

**Independent Test**: Inspect the repository and build output for original files and raw GitHub photo links; open every album and confirm all 14 albums render with usable navigation.

### Tests for User Story 1

- [x] T010 [P] [US1] Add `ts-app/scripts/build-photos.test.js` using a tiny generated source image and a temporary `PHOTO_ORIGINALS_DIR`; assert thumb/full outputs, 12-hex content names, thumbnail ≤ 120 KB / ≤ 600 px, full ≤ 500 KB / ≤ 2000 px, metadata removal, stale-file cleanup, and non-zero exit for a missing source.
- [x] T011 [P] [US1] Add `ts-app/src/components/hobbies/Hobbies.test.tsx` that mocks `ts-app/src/data/photo-manifest.json` with a 14-album fixture, asserts all 14 album names appear, asserts no `raw.githubusercontent.com` image URL is used, and asserts the featured hero resolves.

### Implementation for User Story 1

- [x] T012 [P] [US1] Copy the current `photos/` tree into `PHOTO_ORIGINALS_DIR` (default `../myWebSite-originals/photos`), copy `ts-app/public/photos/1BB3E15D-4298-4C6F-8739-81386C84431E.webp` to `featured/hero.webp`, copy `ts-app/public/photos/IMG_7833.webp` to `profile/portrait.webp`, and verify the store contains 172 album photos used by the source list plus 2 featured sources.
- [x] T013 [P] [US1] Implement `ts-app/scripts/build-photos.js` to read `ts-app/photo-sources.json`, resolve published sources under `PHOTO_ORIGINALS_DIR`, auto-orient via EXIF, strip metadata, resize without enlargement, write a 540 px thumbnail and 1800 px full WebP with a 12-hex content hash, write `ts-app/src/data/photo-manifest.json` atomically, remove stale files under `ts-app/public/photos/generated/`, and never write outside that directory.
- [x] T014 [US1] Run `npm run photos:build` from `ts-app` with the private originals available to create `ts-app/src/data/photo-manifest.json` and `ts-app/public/photos/generated/` for all 172 album photos and both featured images; verify total generated size is < 60 MB.
- [x] T015 [P] [US1] Update `ts-app/src/components/hobbies/Hobbies.tsx` to import `ts-app/src/data/photo-manifest.json`, remove the `raw.githubusercontent.com` base URL, map albums and photos from the manifest, and use the manifest `featured.hero` for the photography hero.
- [x] T016 [P] [US1] Update `ts-app/src/components/hobbies/PhotoAlbum.tsx` so film-strip images use `photo.thumbnail.src` with `width`/`height` and dialog images use `photo.full.src`; preserve album order, opening, previous/next, and closing behavior.
- [x] T017 [P] [US1] Update `ts-app/src/components/about-me/AboutMe.tsx` to use `photo-manifest.json` `featured.portrait` instead of `/photos/IMG_7833.webp`.
- [x] T018 [P] [US1] Update `ts-app/src/components/hobbies/Hobbies.scss` and `ts-app/src/components/hobbies/PhotoAlbum.scss` for thumbnail/full sizing, aspect ratio, lazy-loading presentation, and the existing rotated-photo classes.
- [x] T019 [P] [US1] Update `ts-app/scripts/validate-site-assets.js` to validate manifest-referenced generated photos and featured references instead of `photos/<country>/...`; remove the `assets.external` warning about `raw.githubusercontent.com` and fail when generated photo references do not resolve.
- [x] T020 [US1] Update `ts-app/scripts/validate-site-assets.test.js` fixtures and assertions for the generated manifest layout, missing generated photo, missing featured photo, and missing manifest icon; keep all existing manifest/icon/SPA checks passing.
- [x] T021 [US1] Update `ts-app/scripts/verify-release.js` to run `validate-photo-privacy.js` and add the `privacy.no-originals`, `privacy.no-raw-photo-links`, `photos.manifest`, `photos.limits`, and `photos.generated` checks; remove the raw GitHub photo URL from `EXTERNAL_URLS` and include failures in the release report.
- [x] T022 [US1] After T014 and the UI updates are verified, remove the tracked root `photos/` directory with `git rm -r photos`, remove `ts-app/public/photos/1BB3E15D-4298-4C6F-8739-81386C84431E.webp`, remove `ts-app/public/photos/IMG_7833.webp`, and confirm `git ls-files photos` is empty.
- [x] T023 [US1] Run `npm run validate:photos`, `npm test -- --watchAll=false`, and the gallery checks from `specs/006-photo-privacy-and-profile/quickstart.md`; confirm 14 albums render, no original or raw-link is present, and all album navigation still works.

**Checkpoint**: US1 is independently functional and is the MVP.

---

## Phase 4: User Story 2 - Deter casual downloading without breaking the gallery (Priority: P2)

**Goal**: Discourage common casual save actions and show the copyright notice without harming accessibility or navigation.

**Independent Test**: On desktop and mobile, attempt drag and context-menu saving; confirm the action is discouraged, the copyright notice is visible, and keyboard/assistive navigation still works.

### Tests for User Story 2

- [x] T024 [P] [US2] Add `ts-app/src/components/hobbies/PhotoAlbum.test.tsx` asserting gallery images are not draggable, drag starts are prevented, context-menu events are prevented, and previous/next buttons remain keyboard-accessible.

### Implementation for User Story 2

- [x] T025 [US2] Add a visible, screen-reader-reachable copyright notice equivalent to `Photographs © Isabel Soares. Please do not reuse without permission.` to `ts-app/src/components/hobbies/Hobbies.tsx` and style it in `ts-app/src/components/hobbies/Hobbies.scss`.
- [x] T026 [P] [US2] Add `draggable={false}`, `onDragStart` prevention, and `onContextMenu` prevention to the gallery images in `ts-app/src/components/hobbies/PhotoAlbum.tsx`; add `user-select: none` and `-webkit-user-drag: none` to the image rules in `ts-app/src/components/hobbies/PhotoAlbum.scss` without blocking clicks, focus, or keyboard navigation.
- [x] T027 [P] [US2] Add `Disallow: /myWebSite/photos/` under the existing `User-agent: *` rule in `ts-app/public/robots.txt`; keep the rest of the site crawlable.
- [x] T028 [P] [US2] Review the privacy statement in `ts-app/src/components/personal-projects/PhotoAssistant.tsx`; keep it accurate to the Cloudflare assistant behavior, do not claim casual deterrence prevents all copying, and update `ts-app/src/components/personal-projects/PhotoAssistant.test.tsx` only if the statement changes.
- [x] T029 [US2] Run the desktop/mobile accessibility pass from `specs/006-photo-privacy-and-profile/quickstart.md`: keyboard focus, screen-reader labels, dialog navigation, copyright visibility, and image drag/context-menu behavior.

**Checkpoint**: US2 works without changing US1's manifest or gallery structure.

---

## Phase 5: User Story 3 - Compile with current TypeScript settings without deprecation warnings (Priority: P2)

**Goal**: Move the target to ES2020 and suppress only the remaining `moduleResolution: node` deprecation for TypeScript 4.9/CRA 5.

**Independent Test**: Run `npx tsc --noEmit` and `npm run build`; confirm no ES5/node10 deprecation warning and all existing tests pass.

### Tests for User Story 3

- [x] T030 [P] [US3] Add `ts-app/scripts/validate-tsconfig.test.js` with temporary fixtures for valid ES2020 settings, ES5 target, missing `ignoreDeprecations`, and wrong `moduleResolution`; assert the validator exits `0` only for the accepted configuration.

### Implementation for User Story 3

- [x] T031 [P] [US3] Update `ts-app/tsconfig.json` to set `"target": "ES2020"`, keep `"moduleResolution": "node"` and `"module": "esnext"`, and add `"ignoreDeprecations": "6.0"`; do not change the existing `lib`, `jsx`, or strictness settings.
- [x] T032 [P] [US3] Create `ts-app/scripts/validate-tsconfig.js` to assert `target === "ES2020"`, `moduleResolution === "node"`, `ignoreDeprecations === "6.0"`, and target is not `ES5`; exit `1` with the offending field on failure.
- [x] T033 [US3] Update `ts-app/scripts/verify-release.js` to add the `types.deprecations` check by scanning `npx tsc --noEmit` output for `deprecated`/`deprecation` and the `config.tsconfig` check by running `ts-app/scripts/validate-tsconfig.js`; keep both in the release report.
- [x] T034 [US3] Add a TypeScript maintenance note to `README.md` documenting target ES2020, the temporary `ignoreDeprecations: "6.0"` for `moduleResolution: "node"`, and the follow-up to upgrade TypeScript and move to `moduleResolution: "bundler"`.
- [x] T035 [US3] Run `npx tsc --noEmit`, `npm run validate:tsconfig`, `npm test -- --watchAll=false`, and `npm run build` from `ts-app` against `ts-app/tsconfig.json` and `ts-app/package.json`; confirm zero deprecation output and no behavior change.

**Checkpoint**: US3 is independently complete; it does not require the photo pipeline.

---

## Phase 6: User Story 4 - Understand the repository at a glance (Priority: P3)

**Goal**: Make the repository card and README explain the portfolio, setup, deployment, and photo policy.

**Independent Test**: Open `isabelSoares/myWebSite` and its README; confirm purpose, live site, site sections, technology, structure, setup, verification, deployment, and photo-usage policy are understandable without reading source.

### Implementation for User Story 4

- [x] T036 [US4] Rewrite `README.md` with sections for project purpose, live site (`https://isabelsoares.github.io/myWebSite/`), site sections, technology summary, repository structure, local setup, verification commands (`verify:release`, `validate:photos`, `validate:tsconfig`, `load:smoke`), deployment, photo usage and copyright, and the TypeScript maintenance note from T034.
- [x] T037 [P] [US4] Create `PHOTO-POLICY.md` stating that photographs are © Isabel Soares; no permission is granted to copy, redistribute, sell, train models on, or republish them without written permission; the repository contains only web-sized derivatives; personal viewing is allowed; permission and takedown requests go to `isabel.srsoares@gmail.com`; the owner may remove photos; removal does not affect already downloaded, cached, indexed, or historically committed copies; the policy is not legal advice.
- [x] T038 [P] [US4] Apply the GitHub repository settings from `specs/006-photo-privacy-and-profile/contracts/repository-profile.md` with `gh repo edit isabelSoares/myWebSite`: description `Isabel Soares's personal portfolio: React, TypeScript, AI projects, résumé, and travel photography.`, homepage `https://isabelsoares.github.io/myWebSite/`, and topics `portfolio`, `react`, `typescript`, `personal-website`, `github-pages`, `photography`, `frontend`.
- [x] T039 [US4] Verify `README.md`, `PHOTO-POLICY.md`, `ts-app/public/robots.txt`, and the GitHub settings agree with `specs/006-photo-privacy-and-profile/contracts/repository-profile.md`; run `gh repo view isabelSoares/myWebSite --json description,homepageUrl,repositoryTopics,visibility` and confirm the values.

**Checkpoint**: US4 is independently complete and can ship before or after the photo pipeline, provided the final text matches the implemented behavior.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final release verification, performance confirmation, and privacy checks across all stories.

- [x] T040 [P] Run the full `npm run verify:release` from `ts-app` using `ts-app/scripts/verify-release.js` with the production `REACT_APP_AI_ASSISTANT_URL`; confirm every new check passes and fix any failing file or value.
- [x] T041 Run `npm run build` followed by `npm run load:smoke` using `ts-app/scripts/load-smoke.js`; record requests, errors, and p95 latency and compare them with the baseline in `specs/005-pre-launch-verification/scalability-report.md`.
- [x] T042 Execute the revocation drill in `specs/006-photo-privacy-and-profile/quickstart.md` on one album photo in `ts-app/photo-sources.json`: set `published: false`, rebuild, verify absence, restore, rebuild, and verify return.
- [x] T043 [P] Run the final accessibility and mobile pass on `/hobbies` and `/` through `ts-app/src/components/hobbies/Hobbies.tsx` and `ts-app/src/components/hobbies/PhotoAlbum.tsx`: keyboard navigation, focus visibility, screen-reader labels, album dialog controls, copyright notice, and drag/context-menu deterrence.
- [x] T044 [P] Run the final privacy audit: `git ls-files photos` is empty, `git ls-files '*.jpg' '*.jpeg' '*.png' '*.webp' '*.avif'` contains only generated derivatives, no `raw.githubusercontent.com/.../photos/` reference remains, and `du -sh ts-app/public/photos/generated` is below 60 MB.
- [x] T045 [P] Run `npx eslint src --ext .ts,.tsx` and remove any unused `PHOTOS_DIR` imports, dead raw-photo constants, or stale references left by the migration in `ts-app/scripts/lib/routes.js` and `ts-app/src/components/hobbies/Hobbies.tsx`.
- [x] T046 [P] Scan the final diff for committed secrets, private absolute paths, and unintended image files with `git diff --cached`, `git status --short`, and `git grep -n "PHOTO_ORIGINALS_DIR"`; confirm `.gitignore` covers `/photos/` and `/photo-originals/`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; start immediately.
- **Foundational (Phase 2)**: Depends on Setup; blocks US1 and US2.
- **US1 (Phase 3)**: Depends on Foundational; MVP.
- **US2 (Phase 4)**: Depends on US1's gallery updates.
- **US3 (Phase 5)**: Depends on Setup only; independent of US1/US2.
- **US4 (Phase 6)**: Depends on Setup only; final text verification should follow US1/US2 so the photo policy matches the implemented behavior.
- **Polish (Phase 7)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories after Foundational.
- **US2 (P2)**: Depends on US1 UI changes for `Hobbies.tsx` and `PhotoAlbum.tsx`.
- **US3 (P2)**: Independent of US1/US2; may run in parallel with them after Setup.
- **US4 (P3)**: Independent of US1/US2 for drafting; final verification should follow them.

### Within Each User Story

- Tests before implementation where a test is listed.
- Shared library and validator before generator/UI integration.
- Generate the manifest before updating components that import it.
- Remove old root photos only after the generated output and UI references are verified.
- Run the story's independent test before moving to the next priority.

### Parallel Opportunities

- Setup: T001-T005 can be prepared in parallel (different files), except T001's lockfile update should finish before running the new scripts.
- Foundational: T006, T007, and T009 can be authored in parallel; T008 follows T007.
- US1: T012 and T013 can run in parallel; after T014, T015-T018 can run in parallel; T019 and T020 can run in parallel; T010/T011 tests can be prepared alongside implementation.
- US2: T026, T027, and T028 can run in parallel; T024 follows the UI changes.
- US3: T030, T031, T032, and T034 touch different files and can be prepared in parallel; T033 follows T032 and must account for T021's earlier `verify-release.js` edits.
- US4: T036, T037, and T038 can run in parallel; T039 follows all three.
- Polish: T040-T046 are mostly independent verification commands, but T041 depends on a successful build and T042 mutates the source manifest temporarily.

---

## Parallel Example: User Story 1

```bash
# Prepare source and generator in parallel:
Task: "Copy originals into PHOTO_ORIGINALS_DIR and verify 172 used + 2 featured sources"
Task: "Implement ts-app/scripts/build-photos.js"

# After the manifest exists, update independent UI files in parallel:
Task: "Update ts-app/src/components/hobbies/Hobbies.tsx"
Task: "Update ts-app/src/components/hobbies/PhotoAlbum.tsx"
Task: "Update ts-app/src/components/about-me/AboutMe.tsx"
Task: "Update ts-app/src/components/hobbies/Hobbies.scss and PhotoAlbum.scss"

# Validate generated assets and site assets in parallel:
Task: "Update ts-app/scripts/validate-site-assets.js"
Task: "Add ts-app/src/components/hobbies/Hobbies.test.tsx"
```

## Parallel Example: User Story 3

```bash
# Independent TypeScript tasks:
Task: "Update ts-app/tsconfig.json"
Task: "Create ts-app/scripts/validate-tsconfig.js"
Task: "Add the TypeScript maintenance note to README.md"

# Then validate:
Task: "Update ts-app/scripts/verify-release.js with types.deprecations and config.tsconfig"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: US1.
4. Run T023 and validate the MVP independently.
5. Deploy/demo only after the privacy audit passes.

### Incremental Delivery

1. Setup + Foundational → tooling ready.
2. US1 → originals private, derivatives published, gallery preserved → deploy MVP.
3. US2 → deterrence, copyright notice, assistant statement → deploy.
4. US3 → clean TypeScript build → deploy.
5. US4 → README, photo policy, repository card → deploy.

### Parallel Team Strategy

- Developer A: US1 photo pipeline and gallery.
- Developer B: US3 TypeScript configuration and validation.
- Developer C: US4 README, photo policy, and GitHub settings.
- US2 follows US1 because it touches the same gallery components.

---

## Notes

- [P] tasks touch different files and have no incomplete dependency.
- [US1] and [US2] depend on the generated manifest; do not update UI references before T014.
- [US3] and [US4] can proceed without the private originals.
- Never commit `PHOTO_ORIGINALS_DIR`, raw GitHub photo URLs, or full-resolution originals.
- The revocation drill is a current-build removal test, not a guarantee against screenshots, caches, indexes, or old git commits.
- Commit after each task or logical group once the user requests commits.
