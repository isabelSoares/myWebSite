# Research: Dark Mode Default Appearance

**Date**: 2026-10-26
**Status**: Complete — no `NEEDS CLARIFICATION` items remain.

## Context observed in the repository

- `ts-app/public/index.html` already contains an inline bootstrap that reads the saved `dark-mode` value and applies the `dark-mode` class to the document root before the app renders. Its initial `theme-color` meta value is already dark (`#17262b`).
- `ts-app/src/theme/appearance.ts` already resolves absent, invalid, and unreadable values to dark. It writes only explicit `"true"` or `"false"` choices and updates the `theme-color` meta tag.
- `ts-app/src/App.tsx` already initializes from the shared resolver, keeps the root class and MUI palette aligned, and toggles without a reload.
- `ts-app/src/App.test.tsx` already covers the dark default, explicit light and dark values, toggling, and route changes. `ts-app/src/theme/appearance.test.ts` covers missing, invalid, and throwing storage.
- `ts-app/public/manifest.json` still declares light `theme_color` and `background_color` values (`#f4f0e8`).
- `ts-app/src/index.css` defines light variables on `:root` and dark variables on `:root.dark-mode`, but neither declares `color-scheme`.
- `ts-app/scripts/validate-site-assets.js` validates icons and build assets but does not check manifest theme colors.
- The site is a static GitHub Pages build with no server or runtime configuration layer.

## Decision 1: Treat the existing implementation as the baseline

**Decision**: Keep the current appearance helper, pre-paint bootstrap, React state, CSS variables, MUI palette, and tests. Verify and harden them instead of replacing them.

**Rationale**: The source already resolves a missing preference to dark, honors explicit light/dark choices, and applies dark before first paint. Re-implementing the same behavior would add risk without satisfying any new requirement.

**Alternatives considered**:
- **Rewrite theme handling in a context or state library**: adds structure and dependencies without changing behavior. Rejected.
- **Move resolution into the React render only**: would reintroduce the first-paint flash. Rejected.
- **Change the storage key**: would discard returning visitors' explicit choices and require migration. Rejected.

## Decision 2: Keep dark as the default independent of the OS setting

**Decision**: Resolve the default to dark regardless of `prefers-color-scheme`.

**Rationale**: The specification requires dark as the site default, not a system-following theme. The site's identity is dark for first-time visitors, and an explicit site choice is the only override.

**Alternatives considered**:
- **Follow the OS appearance by default**: a visitor on a light OS would see light, contradicting the requirement. Rejected.
- **Use the OS only as a tiebreaker**: adds behavior the spec does not request and makes the default device-dependent. Rejected.

## Decision 3: Preserve the explicit preference contract

**Decision**: Keep the `dark-mode` key and the values `"true"` (dark) and `"false"` (light). Absent, empty, invalid, or unreadable values resolve to dark.

**Rationale**: Existing visitors already have preferences stored under this key. Reusing it preserves their choice and avoids migration logic. The resolution table is small, testable, and already implemented.

**Alternatives considered**:
- **New key with versioning**: unnecessary migration and temporary dual-read logic. Rejected.
- **Force dark on every load**: makes the light option ineffective and violates the spec's persistence requirements. Rejected.
- **Store the theme in a cookie**: the preference is local presentation only and does not need server visibility. Rejected.

## Decision 4: Make the static manifest express the dark default

**Decision**: Change `theme_color` and `background_color` in `ts-app/public/manifest.json` from `#f4f0e8` to `#17262b`.

**Rationale**: The manifest is served statically and cannot resolve a per-visitor preference. It is used for installed-app chrome and splash surfaces, where light values contradict the site's dark default. Dark matches the default and the static `theme-color` meta tag.

**Alternatives considered**:
- **Generate a per-visitor manifest**: requires a server or dynamic manifest URL and is not possible on the current static host without extra machinery. Rejected.
- **Leave the manifest light**: installed users would see a light splash or chrome around a dark site. Rejected.
- **Remove the manifest color fields**: browsers would fall back to their own defaults, which may also be light and would remove intent. Rejected.

## Decision 5: Declare the native color scheme

**Decision**: Add `color-scheme: light` to `:root` and `color-scheme: dark` to `:root.dark-mode` in `ts-app/src/index.css`.

**Rationale**: CSS variables and the MUI palette style the site's own elements, but native scrollbars, form controls, and browser-rendered surfaces otherwise default to light. Declaring `color-scheme` makes the whole surface follow the resolved mode with no JavaScript.

**Alternatives considered**:
- **Rely on MUI `CssBaseline`**: it does not cover every native surface and would leave browser chrome inconsistent. Rejected.
- **Add `color-scheme` only to the dark block**: light mode would inherit the browser default instead of an explicit light value. Rejected.
- **Style every native control individually**: more code, more maintenance, and incomplete coverage. Rejected.

## Decision 6: Guard the dark default in the existing asset validator

**Decision**: Extend `ts-app/scripts/validate-site-assets.js` and its test to assert that the public manifest declares `theme_color` and `background_color` as `#17262b`.

**Rationale**: The manifest is easy to overlook during theme work, and a future edit could silently reintroduce a light installed-app surface. The project already runs this validator in its release checks, so the guard adds no new tool or workflow.

**Alternatives considered**:
- **Add a browser visual test**: broader coverage but adds a browser dependency and CI time disproportionate to a color constant. Rejected.
- **Check only in documentation**: not enforceable and prone to drift. Rejected.
- **Validate any valid hex color**: would allow light values and fail to protect the default. Rejected.

## Decision 7: Verify the deployed build, not only local source

**Decision**: Include a production verification step that confirms the deployed page applies dark before paint and that a saved light preference still persists.

**Rationale**: The source already defaults to dark, so a first-hand report of light mode can come from a stale deployment, browser cache, or an explicit light choice saved from an earlier visit. Confirming the deployed behavior distinguishes a code defect from an environment or deployment condition.

**Alternatives considered**:
- **Assume the source is the deployed site**: would leave the reported symptom unexplained. Rejected.
- **Clear the visitor's storage automatically**: would override an explicit choice and violate the persistence contract. Rejected.

## Decision 8: Use existing test and release tooling

**Decision**: Rely on Jest/React Testing Library, `axe-core` route smoke tests, the Node asset validator, `npm run build`, and `npm run verify:release`, plus a manual quickstart.

**Rationale**: The project already uses Jest and the release tooling. `axe-core` adds semantic accessibility checks as a development-only dependency without introducing a new test runner or browser automation framework.

**Alternatives considered**:
- **Add Playwright or Puppeteer**: stronger visual and first-paint automation but a new dependency, configuration, and CI cost. Not justified for this scope.
- **Manual checks only**: would not protect the manifest or the storage resolution from regressions. Rejected.
