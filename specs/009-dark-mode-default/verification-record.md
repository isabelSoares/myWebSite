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

This confirms the default, invalid-value fallback, and explicit-choice behavior before React renders. A real-browser visual inspection was not available in this CLI environment.

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
