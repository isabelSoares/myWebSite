# Implementation Plan: Photo Framing, Album Orientation, and Dark Theme Default

**Branch**: `007-photo-display-and-theme` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-photo-display-and-theme/spec.md`

**Note**: This plan keeps the portfolio static on GitHub Pages. It changes presentation plus stale rotation metadata: featured-photo framing, album orientation handling, and the initial appearance preference. It does not add a backend, new photo files, regenerated derivatives, or new runtime dependencies.

## Summary

Fix the two featured photographs so they render at their natural proportions without an artificial crop or zoom. Restore correct album orientation by relying on the already-normalized generated derivatives: correct the stale `rotation: 90` metadata to `0`, stop double-rotating EXIF-oriented photos, and keep previous/next and horizontal browsing moving in the displayed direction. Make dark mode the resolved default when no explicit appearance preference exists, apply it before first paint to avoid a flash, and continue to honor an explicit light or dark choice.

The photo-generation pipeline, published derivatives, photo privacy boundary, album order, and site routes stay unchanged. The only new state is a small appearance-preference helper shared by the pre-paint bootstrap and the React app.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 17.0.2, Node.js 24, SCSS

**Primary Dependencies**: `react-scripts` 5.0.1, React Router 6, MUI 5, Emotion, `sass`, `sharp` (local photo tooling only). No new runtime dependency is planned.

**Storage**: Browser `localStorage` under the existing `dark-mode` key for the explicit appearance preference; generated photo manifest at `ts-app/src/data/photo-manifest.json`; static WebP derivatives under `ts-app/public/photos/generated/`; no backend or database.

**Testing**: Jest + React Testing Library through `react-scripts test`; Node `assert` script tests; `npm run validate:photos`, `npm run validate:site-assets`, `npm run build`, and `npm run verify:release`; manual responsive checks at 320 px, 768 px, and 1440 px; manual album review for all EXIF-oriented photos.

**Target Platform**: Static GitHub Pages site at `https://isabelsoares.github.io/myWebSite/`; modern desktop and mobile browsers per the existing `browserslist` production policy.

**Project Type**: Static web application with local photo publishing tooling.

**Performance Goals**: No increase in image payload; keep thumbnails ≤ 120 KB and full derivatives ≤ 500 KB; keep gallery images lazy-loaded; preserve intrinsic width/height to avoid layout shift; keep the generated photo footprint below 60 MB.

**Constraints**: No server runtime, no committed secrets, no private originals in CI; TypeScript 4.9/CRA 5 compatibility; the pre-paint theme decision must work in a static `index.html`; the photo privacy and derivative limits must not regress; all photo controls must remain keyboard- and screen-reader-accessible.

**Scale/Scope**: 2 featured images (portrait and hero), 14 albums, 174 album photos, 19 photos whose EXIF-oriented originals are now normalized and marked `rotation: 0`, and 348 generated derivatives; all five routes (`/`, `/resume`, `/projects`, `/hobbies`, and not-found) inherit the appearance behavior.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the unfilled template: it has placeholder principle names, descriptions, and version fields. There are no ratified gates to evaluate.

**Gate result: PASS with advisory gates.** Until the constitution is ratified, this plan applies the feature specification's own gates:

- **Static hosting**: The solution must work on GitHub Pages with no runtime backend or secrets.
- **Privacy**: Only approved published derivatives are displayed; no original photo paths or files are introduced.
- **Accessibility**: Images keep meaningful alternative text, controls remain keyboard-accessible, and no motion or color change blocks use.
- **No layout regression**: Featured and album photos must not introduce horizontal overflow, distortion, or layout shift.
- **Testability**: Theme default, saved preference, featured framing, and album orientation must have automated or repeatable verification.
- **Scope discipline**: No photo regeneration, reordering, new albums, new photos, or unrelated redesign.

No constitution violations or complexity exceptions are required.

**Post-design re-check: PASS.** The Phase 1 design adds one small appearance helper, a pre-paint bootstrap snippet, presentation-only component/style changes, and tests. It introduces no runtime service, no secret, no new photo asset, no privacy regression, and no new dependency.

## Project Structure

### Documentation (this feature)

```text
specs/007-photo-display-and-theme/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── photo-presentation.md
    └── appearance-preference.md
```

### Source Code (repository root)

```text
ts-app/
├── public/
│   └── index.html                         # pre-paint appearance bootstrap; theme-color sync
├── src/
│   ├── index.css                          # dark theme variables usable from the document root
│   ├── App.tsx                            # resolve default dark; sync state, storage, root class
│   ├── App.scss
│   ├── theme/
│   │   └── appearance.ts                  # new: shared resolve/read/write/apply helpers
│   ├── components/
│   │   ├── about-me/AboutMe.tsx           # featured portrait natural framing
│   │   ├── about-me/AboutMe.scss
│   │   ├── about-me/AboutMe.test.tsx      # framing regression coverage
│   │   ├── hobbies/Hobbies.tsx            # featured hero natural framing
│   │   ├── hobbies/Hobbies.scss
│   │   ├── hobbies/Hobbies.test.tsx       # hero framing regression coverage
│   │   ├── hobbies/PhotoAlbum.tsx         # optional manual rotation; stable previous/next
│   │   ├── hobbies/PhotoAlbum.scss        # portrait frames; optional manual rotation
│   │   └── hobbies/PhotoAlbum.test.tsx    # strip, dialog, and navigation coverage
│   ├── data/
│   │   ├── photo-manifest.json            # corrected rotation values; dimensions unchanged
│   │   └── photo-url.ts                   # unchanged public URL helper
│   └── App.test.tsx                       # dark default, light/dark persistence, toggle
├── photo-sources.json                     # corrected rotation values; curation order unchanged
└── scripts/                               # unchanged photo pipeline and release checks
```

**Structure Decision**: Keep the existing single static React application. Add a tiny `ts-app/src/theme/appearance.ts` module so the React app and the pre-paint bootstrap follow the same preference contract. Keep the photo pipeline untouched; correct only the stale rotation metadata because `sharp().rotate()` already normalized the generated derivatives.

## Design Decisions

### Featured photo framing

- Use the intrinsic `width`/`height` from `photoManifest.featured` as the layout ratio for the About Me portrait and the Hobbies hero.
- Remove the forced decorative aspect ratios (`0.78` for the portrait and `1.25` for the hero) and the `object-fit: cover` behavior that causes zoom-style cropping.
- Let the photo keep its natural proportions with `width: 100%` and automatic height. Keep the intrinsic width/height attributes so the browser reserves the correct space and avoids layout shift.
- Preserve the existing responsive grid. On narrow screens the featured photo remains full-width within the content column and is never taller than its natural ratio.
- If a crop is ever needed for a specific layout, use a non-zooming container policy; the default for this feature is full-image display.

### Album orientation and direction

- Generated derivatives are orientation-normalized by `sharp().rotate()`. Current album photos all use `rotation: 0`, so they must not be rotated again in CSS.
- Apply the same orientation rule to the strip thumbnail and the enlarged dialog.
- The optional landscape-frame rule remains available only for an explicit future `rotation: 90` value that represents a manual correction of a non-EXIF sideways image.
- Current photos keep the portrait (`3 / 4`) frame and are shown with `object-fit: contain`.
- Keep album order exactly as it exists in the manifest. Previous/Next moves to the lower/higher index, and the strip remains left-to-right with the existing scroll hint pointing right.
- Keep all existing drag and context-menu deterrence, alternative text, lazy loading, and keyboard focus behavior.

### Default appearance

- Resolve the appearance in one place:
  - a saved `dark-mode` value of `false` means the visitor explicitly chose light;
  - a saved `dark-mode` value of `true` means the visitor explicitly chose dark;
  - a missing or unreadable value means the default, which is dark.
- Reuse the existing `dark-mode` storage key and `'true'`/`'false'` values so returning visitors keep their current choice.
- Add a small inline bootstrap in `ts-app/public/index.html` that reads the saved value, resolves the default, and applies the `dark-mode` class to the document root before first paint. It also updates the `theme-color` meta tag to the matching background color.
- Initialize React state from the same resolved value, keep the document root class in sync on toggle, and persist only explicit choices.
- Keep the MUI theme and CSS variables driven by the same resolved boolean so navigation, pages, photo frames, dialogs, and the not-found page change together.
- Do not consult the operating-system color-scheme preference; the specified default is dark regardless of the OS setting.

### Tests

- Add React Testing Library coverage for:
  - first visit without a saved preference resolves to dark;
  - a saved `false` stays light after render;
  - a saved `true` stays dark after render;
  - toggling updates the root theme and stored value;
  - the About Me portrait and Hobbies hero expose intrinsic dimensions and no forced zoom ratio;
  - an explicitly rotated fixture still applies the manual orientation class in both the strip and the dialog;
  - all album photos remain in manifest order and previous/next remain bounded.
- Keep tests isolated by clearing `localStorage` before each case.
- Add manual breakpoint checks because jsdom does not compute responsive layout. The quickstart records the required visual review.

### Release and privacy checks

- Correct only the stale rotation values in `photo-sources.json` and `photo-manifest.json`; do not change generated derivatives or the privacy validators.
- Reuse the existing `npm run validate:photos`, `npm run validate:site-assets`, `npm test -- --watchAll=false`, `npm run build`, and `npm run verify:release` gates.
- A release fails if a featured photo or album frame references an original file, if manifest rotation/dimensions become invalid, or if the generated photo limits are exceeded.

## Complexity Tracking

No constitution violations. The only added structure is a small appearance helper and a pre-paint bootstrap snippet, both required to keep the default and explicit preference behavior consistent without a flash.
