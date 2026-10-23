# Research: Photo Framing, Album Orientation, and Dark Theme Default

**Date**: 2026-10-23
**Status**: Complete — no `NEEDS CLARIFICATION` items remain.

## Context observed in the repository

- The About Me portrait and the Hobbies hero are rendered from `photoManifest.featured`. Their manifest dimensions are 1500 × 2000 (portrait ratio 0.75) and 1800 × 1601 (landscape ratio ~1.124).
- `AboutMe.scss` forces `aspect-ratio: 0.78` and `object-fit: cover` on the portrait. `Hobbies.scss` forces `aspect-ratio: 1.25` and `object-fit: cover` on the hero. Both force a different box ratio from the photo and crop with cover, which produces the zoomed/awkward framing the owner reported.
- Album photos carry a `rotation` value in `photo-manifest.json`. Nineteen photos were marked `rotation: 90`, but their source files all have EXIF orientation `6`, and `build-photos.js` calls `sharp().rotate()`. The generated derivatives are already upright. Applying the `rotation-90` CSS rule therefore double-rotated them and made them sideways.
- `App.tsx` resolves the appearance with `localStorage.getItem('dark-mode') === 'true'`. A missing value therefore becomes `false` (light), which is the regression. The CSS variables are defined under `.dark-mode`, and the class is applied only after React renders, so a default change alone would still flash the light theme first.
- The site is a static GitHub Pages build. There is no server or runtime configuration layer.

## Decision 1: Display featured photos at their intrinsic proportions

**Decision**: Remove the forced decorative aspect ratios and cover-cropping from the About Me portrait and the Hobbies hero. Let each image keep the intrinsic ratio from the manifest, use full-width sizing with automatic height, and keep the intrinsic width/height attributes to reserve space.

**Rationale**: The manifest already contains the correct dimensions. Using them preserves the photographer's framing, removes the zoom effect, and keeps the page stable while images load. It is a presentation-only change with no effect on image files or privacy.

**Alternatives considered**:
- **Keep the forced ratio and change `cover` to `contain`**: avoids cropping but leaves empty bands inside an artificial frame. Rejected because the natural ratio is known and produces a cleaner result.
- **Keep cover and add a focal point**: still hides part of the photo and requires per-photo focal data. Rejected.
- **Regenerate cropped derivatives per placement**: adds asset variants, changes the privacy/limits pipeline, and is unnecessary. Rejected.
- **Make the featured images decorative backgrounds**: loses image semantics and alternative text. Rejected.

## Decision 2: Treat generated derivatives as orientation-normalized

**Decision**: Set the current album `rotation` values to `0` in `photo-sources.json` and `photo-manifest.json`. Keep the existing presentation-layer rotation capability for future manually rotated photos, but do not rotate the current derivatives.

**Rationale**: All 19 album photos previously marked `rotation: 90` have source files with EXIF orientation `6`. `build-photos.js` calls `sharp().rotate()`, so the generated derivatives are already upright (`1333 × 2000`), and the extra CSS rotation made them sideways. The `rotation` metadata now represents an explicit manual correction only; it must not duplicate EXIF auto-orientation. Generated derivative files remain unchanged.

**Alternatives considered**:
- **Keep `rotation: 90` and rotate in the presentation layer**: double-rotates every auto-oriented derivative and was the cause of the sideways photos. Rejected.
- **Bake an additional rotation into derivatives**: would rotate already-upright images and change content/add unnecessary processing. Rejected.
- **Use JavaScript canvas pre-rotation**: adds client work, can reduce quality, and harms accessibility. Rejected.

## Decision 3: Do not swap the frame for auto-oriented photos

**Decision**: Current album photos all use `rotation: 0`, so every frame keeps the portrait `3 / 4` box and the image is contained without CSS rotation. The landscape-frame rule remains only for an explicit future `rotation: 90` value.

**Rationale**: A quarter-turn frame is only needed when the displayed image is actually rotated in the browser. The generated derivatives are already upright, so applying a landscape frame would change the layout without correcting orientation.

**Alternatives considered**:
- **Rotate inside the existing portrait frame**: unnecessary for auto-oriented derivatives and still double-rotates them. Rejected.
- **Keep the portrait frame and shrink the image drastically**: no rotation is needed, so this would only waste space. Rejected.
- **Rotate the thumbnail only**: would make the strip and dialog disagree. Rejected.

## Decision 4: Preserve album order and visible navigation direction

**Decision**: Keep every album's manifest order. Previous moves to the lower index, Next moves to the higher index, and the strip stays left-to-right with the existing right-pointing scroll hint. The visible frame orientation follows the photo, not the navigation controls.

**Rationale**: The owner reported that the direction of album photos was lost. Restoring a single consistent order across the strip, dialog, and controls removes ambiguity and matches the existing scroll hint. Changing order or reversing controls would be surprising and would rewrite curation data.

**Alternatives considered**:
- **Reverse the strip or controls**: would conflict with the existing right-pointing hint and the manifest order. Rejected.
- **Add wrap-around navigation**: changes the current bounded behavior and is not part of the report. Rejected.
- **Sort by orientation**: would break the curated album narrative. Rejected.

## Decision 5: Default to dark when no explicit preference exists

**Decision**: Reuse the existing `dark-mode` key and `'true'`/`'false'` values. Treat `'false'` as explicit light, `'true'` as explicit dark, and a missing or unreadable value as the dark default.

**Rationale**: The owner wants dark mode as the default again, and returning visitors should keep an explicit choice. Reusing the key avoids a migration and keeps the existing toggle contract. A default of dark when the key is absent exactly matches the requested behavior.

**Alternatives considered**:
- **Use a new storage key**: would discard existing preferences and require migration logic. Rejected.
- **Default dark only when the OS is dark**: contradicts the explicit requirement that dark is the default. Rejected.
- **Always force dark on every load**: ignores the visitor's explicit light choice and makes the toggle ineffective. Rejected.
- **Default light and add an onboarding prompt**: does not satisfy the requested default. Rejected.

## Decision 6: Resolve and apply appearance before first paint

**Decision**: Add a small inline bootstrap in `ts-app/public/index.html` that resolves the stored preference and applies the `dark-mode` class to the document root before the app renders. The React app initializes from the same resolved value and keeps the root class and MUI theme in sync on toggle. The bootstrap also sets the `theme-color` meta tag to the matching background.

**Rationale**: The current light-first CSS would still paint before a React `useEffect` changes it, causing the flash the spec forbids. An inline head script runs during document parsing and is the standard static-site way to apply a stored theme before paint.

**Alternatives considered**:
- **Change the CSS default to dark without a bootstrap**: explicit light users would see a dark flash before React applies their choice. Rejected.
- **Apply the class in `useEffect`**: still flashes. Rejected.
- **Server-side theme selection**: not available on static GitHub Pages. Rejected.
- **Use `prefers-color-scheme`**: conflicts with the required dark default and does not represent the site's explicit preference. Rejected.

## Decision 7: Centralize the appearance contract in one helper

**Decision**: Add `ts-app/src/theme/appearance.ts` with the storage key, the storage-value parsing, the default resolution, and helpers to read/write/apply the root class. Use the same constants in the bootstrap and in React.

**Rationale**: The theme is decided in two places (pre-paint and React). Duplicating the key or parsing logic invites drift and makes the flash-free behavior fragile. A tiny shared module keeps one contract and is easy to unit test.

**Alternatives considered**:
- **Duplicate the logic in `index.html` and `App.tsx`**: simple but easy to desynchronize. Rejected.
- **Put the logic in a React context**: does not help the pre-paint bootstrap, which runs before React. Rejected.
- **Add a state-management dependency**: unnecessary for one boolean. Rejected.

## Decision 8: Verify with existing Jest/RTL plus targeted manual checks

**Decision**: Extend the existing Jest + React Testing Library tests for theme resolution, persistence, toggle behavior, featured intrinsic dimensions, and album orientation classes. Add manual breakpoint and full-album review steps in `quickstart.md` because jsdom does not perform responsive layout or visual clipping.

**Rationale**: The project already uses CRA's Jest and RTL setup, and the feature is largely presentational. Automated tests can lock the contract and regression-prone logic; manual checks cover the visual outcomes that jsdom cannot.

**Alternatives considered**:
- **Add Playwright for visual screenshots**: stronger visual coverage but adds a browser dependency, CI time, and configuration outside the current toolchain. Not justified for three presentation fixes.
- **Rely only on manual review**: would not protect the default-dark logic or orientation classes from regressions. Rejected.
- **Add image snapshot tests**: brittle across environments and not necessary for ratio/rotation contracts. Rejected.

## Decision 9: Correct rotation metadata without changing photo assets

**Decision**: Keep the generated WebP derivatives and privacy/limit validators unchanged, but correct the 19 stale `rotation: 90` values to `0` in `photo-sources.json` and `photo-manifest.json`. The manifest stays generated from the source list, and no photos are regenerated.

**Rationale**: The original-photo boundary and derivative limits were established by feature 006 and already pass validation. The derivative files were already upright; only the metadata and presentation rule were wrong. Keeping the assets unchanged avoids new content hashes and a large binary diff.

**Alternatives considered**:
- **Add higher-resolution or differently cropped hero variants**: increases payload and validation scope without being required by the spec. Rejected.
- **Regenerate all derivatives after the metadata correction**: unnecessary because the orientation was already normalized; would add processing and risk unrelated binary churn. Rejected.
