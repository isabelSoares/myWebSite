# Verification Record: Dark Mode Default Appearance

**Feature**: `009-dark-mode-default`
**Date**: 2026-10-26
**Branch**: `fix/verify-launch`

## Automated checks

| Check | Command | Result |
|-------|---------|--------|
| Baseline tests | `cd ts-app && npm test -- --watchAll=false` | PASS — 7 suites, 29 tests before changes |
| Baseline assets | `cd ts-app && npm run validate:site-assets` | PASS — 3 checks |
| Focused appearance tests | `cd ts-app && npm test -- --watchAll=false --testPathPattern='(App\|appearance)\.test'` | PASS — 2 suites, 26 tests |
| Site-asset script tests | `cd ts-app && node scripts/validate-site-assets.test.js` | PASS — 7 fixtures, including the new dark-manifest guard |
| Asset validation | `cd ts-app && npm run validate:site-assets` | PASS — manifest colors accepted |
| Full tests | `cd ts-app && npm test -- --watchAll=false` | PASS — 7 suites, 35 tests |
| Production build | `cd ts-app && npm run build` | PASS — compiled successfully |
| Release verification | `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` | PASS — 19 passed, 0 failed, 1 skipped (external links not requested) |

The release check was first run without `REACT_APP_AI_ASSISTANT_URL` and reported only `assistant-url` as failed. Re-running with the documented production endpoint, as specified in `specs/008-launch-readiness-remediation/quickstart.md`, passed every check. This was an environment prerequisite, not a code failure.

## First-paint bootstrap check

The inline `public/index.html` bootstrap was executed in jsdom with four storage states:

| Stored `dark-mode` | Document class | `theme-color` |
|--------------------|----------------|---------------|
| missing | dark | `#17262b` |
| `"unexpected"` | dark | `#17262b` |
| `"false"` | light | `#f4f0e8` |
| `"true"` | dark | `#17262b` |

This confirms the default, invalid-value fallback, and explicit-choice behavior before React renders. The initial first-paint check did not include a real-browser visual inspection; a later light-mode headless Chrome render is recorded below.

## Surface checks

- `ts-app/src/index.css` now declares `color-scheme: light` on `:root` and `color-scheme: dark` on `:root.dark-mode`.
- `ts-app/public/manifest.json` now declares `theme_color` and `background_color` as `#17262b`.
- `ts-app/scripts/validate-site-assets.js` rejects manifests whose theme colors are not `#17262b`.
- `ts-app/scripts/validate-site-assets.test.js` covers both passing and failing manifest colors.

## Deployed-site check

`https://isabelsoares.github.io/myWebSite/` returned HTTP 200. Its inline bootstrap already resolves a missing preference to dark and sets `theme-color` to `#17262b`. Its deployed `manifest.json` still returns `#f4f0e8` for `theme_color` and `background_color` because this change has not been deployed yet. After deployment, the manifest should return `#17262b`.

## Notes

- A saved light preference remains respected; dark is the default only when no valid explicit choice exists.
- No content, routes, photo assets, privacy behavior, or storage keys changed.
- The production diff is limited to `manifest.json`, `index.css`, the site-asset validator and its test, and the appearance/App tests.

## Post-analysis accessibility remediation (2026-10-29)

The `/speckit.analyze` pass found that FR-012's contrast and keyboard-focus requirements had no repeatable verification. This remediation adds that coverage without changing the storage contract, routes, or content.

| Check | Command | Result |
|-------|---------|--------|
| Theme accessibility script tests | `cd ts-app && node scripts/validate-theme-accessibility.test.js` | PASS — 11 cases |
| Theme accessibility | `cd ts-app && npm run validate:theme-accessibility` | PASS — `theme.contrast` (31 pairs) and `theme.keyboard` (16 targets) |
| Full tests | `cd ts-app && npm test -- --watchAll=false` | PASS — 7 suites, 37 tests |
| Production build | `cd ts-app && npm run build` | PASS — compiled successfully |
| Release verification | `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` | PASS — 21 passed, 0 failed, 1 skipped |

Accessibility changes:

- `ts-app/scripts/validate-theme-accessibility.js` computes WCAG contrast for 15 color pairs in both themes plus a light-only action-border pair: normal text at 4.5:1 and focus/disabled UI at 3:1.
- The same script requires a global `:focus-visible` fallback and visible accent outlines on the top bar, photo frames, primary/text actions, project links, and assistant controls, and rejects `outline: none` or `outline: 0`.
- `ts-app/scripts/validate-theme-accessibility.test.js` covers passing and failing contrast, a low-contrast action border, missing variables, missing global focus styles, missing control selectors, and outline suppression.
- `ts-app/src/index.css` darkens the light-theme `--site-subtle` value from `#7a8989` to `#5f7071` so small secondary text reaches 4.57:1 on the light background, and adds the global keyboard focus fallback.
- `ts-app/src/index.css` adds `--site-action-border: #53676a` for light mode; that border is 5.25:1 against the page and 5.97:1 against the white pill. Dark mode uses `transparent` because the white pill already contrasts 15.57:1 against the dark page.
- `ts-app/src/components/about-me/AboutMe.scss` applies the border to `.primary-action` and `.text-action`, switches it to teal on hover, and to light teal on active/focus-visible. This covers all five About-page actions without changing the white fill.
- `ts-app/src/components/top-bar/TopBar.scss` adds explicit keyboard focus outlines for the site mark and appearance toggle.
- `ts-app/src/App.test.tsx` adds tab-order and Enter-key coverage for the top bar and appearance toggle.
- `npm run verify:release` now runs the accessibility script tests and includes `theme.contrast` and `theme.keyboard` checks.

A headless Chrome render of `/` in light mode confirmed the five action pills now have visible outlines against `#f4f0e8`; the dark render was unchanged. Hover and focus border transitions are covered by the new CSS rules and the existing keyboard-focus checks.

## Accessibility semantics remediation (2026-10-29)

The follow-up accessibility audit was implemented across the application:

- Route-specific document titles and a polite route-change announcement are now applied for all routes.
- A skip-to-content link, focusable main target, primary navigation landmark, and semantic router links were added.
- Route changes move focus to the new main content, while the photo dialog now has an accessible name and announces the active photo.
- Photo-strip thumbnails are decorative because their enclosing buttons provide the accessible names; full-size images retain their source descriptions.
- External links identify new-tab behavior, the article link has descriptive text, and global reduced-motion handling was added.
- The contrast validator now covers accent text and action-pill text at WCAG AA thresholds.
- `axe-core` route smoke tests cover the homepage, resume, projects, hobbies, and not-found views.

| Check | Command | Result |
|-------|---------|--------|
| Full tests | `cd ts-app && CI=true npm test -- --watchAll=false --runInBand` | PASS — 8 suites, 43 tests |
| JSX accessibility lint | `cd ts-app && npx eslint "src/**/*.ts" "src/**/*.tsx"` | PASS |
| Axe route checks | Included in full Jest suite | PASS — 5 routes, color contrast delegated to token validator |
| Theme accessibility | `cd ts-app && npm run validate:theme-accessibility` | PASS — 37 contrast pairs and 16 focus targets |
| Production build | `cd ts-app && npm run build` | PASS — compiled successfully |
| Release verification | `cd ts-app && REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` | PASS — 21 passed, 0 failed, 1 skipped |

Meaningful descriptions for the photographic content itself remain source content in `ts-app/photo-sources.json`; the implementation prevents duplicate thumbnail announcements and preserves the existing source descriptions for full-size images.
