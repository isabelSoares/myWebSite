# Research: Photo Framing, Album Orientation, and Dark Theme Default

**Date**: 2026-10-23
**Status**: Complete — no `NEEDS CLARIFICATION` items remain.

## Context observed in the repository

- The About Me portrait and the Hobbies hero are rendered from `photoManifest.featured`. Their manifest dimensions are 1500 × 2000 (portrait ratio 0.75) and 1800 × 1601 (landscape ratio ~1.124).
- `AboutMe.scss` forces `aspect-ratio: 0.78` and `object-fit: cover` on the portrait. `Hobbies.scss` forces `aspect-ratio: 1.25` and `object-fit: cover` on the hero. Both force a different box ratio from the photo and crop with cover, which produces the zoomed/awkward framing the owner reported.
- Album photos carry a `rotation` value in `photo-manifest.json`. The current data has 19 photos with `rotation: 90` and the rest with `0`. `PhotoAlbum.tsx` applies a `rotation-90` class, but the frame stays portrait and the dialog rotation does not swap the layout box, so quarter-turn photos can be clipped or look wrong.
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

## Decision 2: Apply album orientation in the presentation layer, not by regenerating photos

**Decision**: Treat the manifest `rotation` value as authoritative and apply it consistently to the strip thumbnail and the dialog image. Keep the generated derivatives and `photo-sources.json` unchanged.

**Rationale**: The orientation metadata already exists and is already used by the UI. The derivatives are approved, validated, and content-hashed; regenerating them to bake in rotation would change filenames, require the private originals, and expand the scope into the privacy pipeline. Presentation-layer orientation fixes the symptom without touching the publishing boundary.

**Alternatives considered**:
- **Bake rotation into derivatives in `build-photos.js`**: would require originals and regeneration, change content hashes, and need new validation. Rejected for this fix.
- **Rely on EXIF auto-orientation only**: EXIF is stripped during derivative generation, and the manual rotation list exists precisely for photos the owner corrected by hand. Rejected.
- **Use JavaScript canvas pre-rotation**: adds client work, can reduce quality, and harms accessibility. Rejected.

## Decision 3: Swap the frame for quarter-turn photos

**Decision**: For `rotation: 90`, change the visible frame to landscape and fit the rotated image entirely inside it. Keep portrait frames for unrotated photos. Use the same rule in the film strip and the enlarged dialog.

**Rationale**: Rotation changes the visual bounding box. Rotating a portrait-layout image inside a portrait frame without swapping the frame causes clipping or accidental overflow. A landscape frame matches the post-rotation shape and lets `contain` preserve the whole photo.

**Alternatives considered**:
- **Rotate inside the existing portrait frame**: clips the long edge or leaves an oversized element that escapes the frame. Rejected.
- **Keep the portrait frame and shrink the image drastically**: shows the photo but wastes most of the frame. Rejected.
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

## Decision 9: No changes to photo assets, manifest, or privacy checks

**Decision**: Keep `photo-sources.json`, `photo-manifest.json`, the generated WebP derivatives, and the privacy/limit validators unchanged. The feature reads existing rotation and dimension metadata.

**Rationale**: The original-photo boundary and derivative limits were established by feature 006 and already pass validation. This fix should not require private originals, new generated files, or new public assets.

**Alternatives considered**:
- **Add higher-resolution or differently cropped hero variants**: increases payload and validation scope without being required by the spec. Rejected.
- **Remove rotation metadata and regenerate upright derivatives**: requires originals and changes content hashes. Rejected.
