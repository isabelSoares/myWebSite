# Quickstart Validation: Dark Mode Default Appearance

**Feature**: `009-dark-mode-default`
**Purpose**: Prove that dark mode is the default, that first paint never flashes the wrong theme, and that explicit choices and browser surfaces stay consistent.

See [contracts/appearance-default.md](./contracts/appearance-default.md) for the resolution and surface rules, and [data-model.md](./data-model.md) for the state definitions.

## Prerequisites

- Node.js 24 or newer and npm.
- Repository checked out with this feature.
- Dependencies installed from `ts-app/`.

```sh
cd ts-app
npm i
```

## Automated checks

Run from `ts-app/`:

```sh
npm test -- --watchAll=false
npm run validate:site-assets
npm run build
npm run verify:release
```

**Expected**: all commands exit successfully. The site-asset check reports a passing manifest theme/color check, and the release verification reports zero failed checks.

## Run the site locally

```sh
cd ts-app
npm start
```

Open <http://localhost:3000>. Use a fresh private window or clear the site's storage when testing the default. For a production-like check, serve the generated build output according to the repository's existing deploy workflow.

## Scenario 1: Dark mode is the default on every route

1. Clear the `dark-mode` key from `localStorage` for the site, or use a fresh private window.
2. Load `/`, then `/resume`, `/projects`, `/hobbies`, and an unknown path such as `/not-in-the-album`.
3. Reload each route.

**Expected**:

- Every route opens in dark mode.
- The top bar, page background, cards, photo strip, dialog, and not-found page are all dark.
- The toggle offers switching to light mode.
- No light flash appears before the dark page.
- The browser theme color matches the dark background.

## Scenario 2: The OS light setting does not override the default

1. Set the operating system or browser to light appearance.
2. Clear the site's `dark-mode` value or use a fresh private window.
3. Load the site.

**Expected**: the site still opens in dark mode.

## Scenario 3: An explicit light choice is remembered

1. Start from the dark default.
2. Use the toggle to switch to light.
3. Reload and navigate to another route.

**Expected**:

- The page stays light after reload and route changes.
- The toggle label and icon describe switching back to dark.
- No dark flash appears before the light page.
- Native scrollbars and controls use the light scheme.

## Scenario 4: An explicit dark choice is remembered

1. Switch back to dark from light.
2. Reload and navigate to another route.

**Expected**:

- The page stays dark after reload and route changes.
- The explicit dark choice is stored as dark, not inferred from the default.
- Native scrollbars and controls use the dark scheme.

## Scenario 5: Invalid or unavailable storage falls back to dark

1. Set `localStorage.setItem('dark-mode', 'unexpected')` and reload.

**Expected**: the site opens in dark mode without an error.

2. In a browser configuration that blocks storage, load the site.

**Expected**: the site opens in dark mode and the page still renders. The toggle may update the current page even if the preference cannot be saved.

## Scenario 6: Installed-app and browser surfaces

1. Inspect the page's `theme-color` meta value in dark mode.

**Expected**: `#17262b`.

2. Inspect `public/manifest.json` or the deployed manifest.

**Expected**: `theme_color` and `background_color` are `#17262b`.

3. If the browser supports installing the site, install it and launch it.

**Expected**: the install/splash and installed-app chrome use the dark colors and do not present a light frame around the dark site.

## Scenario 7: Deployed site

1. Open the production URL in a fresh private window.
2. Confirm every route opens in dark mode.
3. Toggle to light, reload, and confirm light persists.
4. Return to dark and confirm it persists.

**Expected**: the deployed site behaves the same as the local build. If it does not, record whether the deployment is stale or the browser had a saved light preference; do not infer a code defect from a pre-existing saved choice.
