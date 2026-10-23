# Quickstart Validation: Photo Framing, Album Orientation, and Dark Theme Default

**Feature**: `007-photo-display-and-theme`
**Purpose**: Prove the three reported problems are fixed without regressing photo privacy, album order, or accessibility.

## Prerequisites

- Node.js 24 or newer and npm.
- Repository checked out at the feature branch.
- Dependencies installed from `ts-app/`.

```sh
cd ts-app
npm i
```

## Run the site locally

```sh
cd ts-app
npm start
```

Open <http://localhost:3000>. Use a fresh browser profile or clear the site's storage when testing the default. The production build is checked later with `npm run build`.

## Scenario 1: Dark mode is the default

1. Open browser developer tools and remove the `dark-mode` key from `localStorage` for `localhost:3000` (or use a fresh private window).
2. Load `/`, then `/resume`, `/projects`, `/hobbies`, and an unknown path such as `/not-in-the-album`.
3. Reload each route.

**Expected**:
- Every route opens in dark mode.
- The top bar, page background, cards, photo strip, dialog, and not-found page are all dark.
- No light flash appears before the dark page.
- The browser theme color matches the dark background.

## Scenario 2: An explicit light choice is remembered

1. Start from the dark default.
2. Use the theme toggle to switch to light.
3. Reload the page and navigate to another route.

**Expected**:
- The page stays light after reload and route changes.
- The toggle label and icon describe switching back to dark.
- No dark flash appears before the light page.

## Scenario 3: An explicit dark choice is remembered

1. Switch back to dark from light.
2. Reload and navigate to another route.

**Expected**:
- The page stays dark after reload and route changes.
- The explicit dark choice is stored as dark, not inferred from the default.

## Scenario 4: Featured photos use natural framing

1. Open `/` and inspect the featured portrait.
2. Open `/hobbies` and inspect the featured hero.
3. Resize the browser to 320 px, 768 px, and 1440 px widths.

**Expected**:
- The full portrait and the full hero photo are visible.
- Neither photo is zoomed or cropped by a forced decorative frame.
- The portrait keeps its tall ratio and the hero keeps its landscape ratio.
- The images do not stretch, squash, or overflow horizontally.
- The page does not jump when the images finish loading.

## Scenario 5: Album orientation and direction

1. Open `/hobbies`.
2. Review every album. The manifest currently records 19 quarter-turn photos across Portugal, UK, USA, Italy, Netherlands, Austria, Croatia, France, and Spain.
3. Open each quarter-turn photo from the film strip and review it in the dialog.
4. Use Previous and Next to move through an album, including the first and last frame.
5. Scroll each film strip horizontally.

**Expected**:
- Quarter-turn photos appear upright in both the strip and the dialog.
- The visible frame becomes landscape for quarter-turn photos and portrait for unrotated photos.
- No photo is clipped, stretched, mirrored, or hidden behind the dialog controls.
- Previous moves backward and Next moves forward in manifest order.
- The first frame disables Previous and the last frame disables Next.
- The strip scrolls left-to-right following the right-pointing hint.
- Album order and frame numbers match the curated order.
- Every image keeps its alternative text.

## Scenario 6: Cross-cutting regression checks

1. Open every route directly and refresh.
2. Use only the keyboard to reach the theme toggle, album frames, dialog close, Previous, and Next.
3. Check that photos still use generated WebP derivatives and never an original path.
4. Check that the photo copyright notice and privacy behavior are unchanged.

**Expected**:
- All routes load directly without a blank page.
- Focus is visible on every interactive control.
- No original photo path appears in the rendered HTML or network requests.
- No horizontal page scrollbar appears at any tested width.

## Automated checks

Run from `ts-app/`:

```sh
npm test -- --watchAll=false
npm run validate:photos
npm run validate:site-assets
npm run build
```

Run the full release check with the production assistant URL:

```sh
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release
```

**Expected**:
- Jest and React Testing Library pass, including the new appearance and orientation cases.
- Photo privacy, manifest, derivative, and site-asset validation pass.
- The production build succeeds.
- The release check reports no failures.

## Related artifacts

- Requirements: [spec.md](./spec.md)
- Design decisions: [plan.md](./plan.md) and [research.md](./research.md)
- Data contract: [data-model.md](./data-model.md)
- UI contracts: [contracts/photo-presentation.md](./contracts/photo-presentation.md) and [contracts/appearance-preference.md](./contracts/appearance-preference.md)
