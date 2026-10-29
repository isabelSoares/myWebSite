# Implementation Plan: Dark Mode Default Appearance

**Branch**: `fix/verify-launch` (feature `009-dark-mode-default`) | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/009-dark-mode-default/spec.md`

**Note**: The source already implements the dark default. This plan verifies that behavior and closes the remaining browser-surface and regression-guard gaps rather than rewriting the appearance system.

## Summary

Make dark mode the unambiguous default appearance for visitors without an explicit preference. The existing pre-paint bootstrap, appearance helper, React state, CSS variables, MUI palette, and tests are treated as the baseline. The remaining work is to:

- align the static web-app manifest's `theme_color` and `background_color` with the dark default;
- declare the resolved `color-scheme` so native browser controls and scrollbars follow the theme;
- add an automated guard that the manifest keeps the dark default;
- verify every route, first paint, explicit light/dark persistence, invalid storage, the production build, and the deployed site.

No content, routes, photo assets, privacy rules, or visitor-facing features change.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 17.0.2, Node.js 24, SCSS

**Primary Dependencies**: `react-scripts` 5.0.1, React Router 6, MUI 5, Emotion, `sass`. No new dependency is planned.

**Storage**: Browser `localStorage` under the existing `dark-mode` key, with `"true"` for explicit dark and `"false"` for explicit light. No backend or database.

**Testing**: Jest + React Testing Library through `react-scripts test`; Node `assert` script tests; `npm run validate:site-assets`; `npm run build`; `npm run verify:release`; manual browser checks from `quickstart.md`.

**Target Platform**: Static GitHub Pages site at `https://isabelsoares.github.io/myWebSite/`; modern desktop and mobile browsers per the existing `browserslist` production policy.

**Project Type**: Static single-page web application.

**Performance Goals**: No added network payload, no extra render pass, and no delay to first paint. Appearance resolution remains synchronous and pre-React.

**Constraints**: Static hosting only; no server-side theme selection; the pre-paint decision must live in `index.html`; the default must not depend on the operating-system color scheme; the existing storage key and values must be preserved; all routes and theme-dependent surfaces must agree.

**Scale/Scope**: Five routes (`/`, `/resume`, `/projects`, `/hobbies`, and not-found), one appearance preference per browser, and one static manifest.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the unfilled template: it contains placeholder principle names, descriptions, and version fields. There are no ratified gates to evaluate.

**Gate result: PASS with advisory gates.** Until the constitution is ratified, this plan applies the specification's own gates:

- **Static hosting**: the solution must work on GitHub Pages with no runtime backend or secrets.
- **Default correctness**: a visitor with no valid preference must receive dark mode before first paint, regardless of OS appearance.
- **Preference integrity**: an explicit light or dark choice must survive reloads and route changes.
- **Surface consistency**: navigation, pages, cards, photo frames, dialogs, not-found page, browser chrome, and installed-app surfaces must agree.
- **No regression**: content, routes, albums, photo privacy, assistant behavior, and existing automated gates must remain unchanged.
- **Testability**: the default, persistence, and manifest appearance must have automated or repeatable verification.
- **Scope discipline**: no redesign, no new appearance modes, no new dependency, no photo regeneration.

No constitution violations or complexity exceptions are required.

**Post-design re-check: PASS.** Phase 1 adds theme metadata, one CSS declaration, and regression tests. It introduces no service, dependency, data collection, privacy change, or visitor-facing feature.

## Project Structure

### Documentation (this feature)

```text
specs/009-dark-mode-default/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
└── contracts/
    └── appearance-default.md
```

`tasks.md` is produced later by `/speckit.tasks`.

### Source Code (repository root)

```text
ts-app/
├── public/
│   ├── index.html                     # existing pre-paint bootstrap; verify only
│   └── manifest.json                  # change theme_color/background_color to dark
├── src/
│   ├── index.css                      # add color-scheme for light and dark roots
│   ├── App.tsx                        # existing resolution/toggle; verify only
│   ├── App.test.tsx                   # default, persistence, toggle, route coverage
│   └── theme/
│       ├── appearance.ts              # existing resolver/helpers; verify only
│       └── appearance.test.ts         # resolution and storage-failure coverage
└── scripts/
    ├── validate-site-assets.js        # guard manifest dark default colors
    └── validate-site-assets.test.js   # pass/fail coverage for the guard
```

**Structure Decision**: Keep the existing single static React application. Reuse the appearance helper and pre-paint bootstrap introduced by feature 007. The only production changes are theme metadata in `manifest.json` and `color-scheme` in `index.css`; the rest is verification and regression protection.

## Design Decisions

### Existing dark-default behavior is the baseline

- `ts-app/public/index.html` applies `dark-mode` to the document root before first paint.
- `ts-app/src/theme/appearance.ts` resolves missing, invalid, or unreadable values to dark and persists only explicit choices.
- `ts-app/src/App.tsx` initializes from the same resolution and keeps the CSS class, MUI palette, and `theme-color` meta tag in sync.
- `ts-app/src/App.test.tsx` and `ts-app/src/theme/appearance.test.ts` already cover the default, explicit light/dark, toggling, and storage failures.

Do not rewrite these. Verify them and add only the missing protections.

### Align installed-app and browser surfaces with the dark default

- Set `theme_color` and `background_color` in `ts-app/public/manifest.json` to `#17262b`, the existing dark background.
- Keep the `theme-color` meta tag and its runtime update as-is; they already resolve to dark by default.
- The manifest is static, so it can only express one default. Dark is correct for this feature because the default is dark and no preference exists at install time.

### Declare the native color scheme

- Add `color-scheme: light` to `:root` and `color-scheme: dark` to `:root.dark-mode`.
- This makes native scrollbars, form controls, and browser-rendered UI follow the same resolved mode instead of defaulting to light.

### Preserve the appearance preference contract

- Keep the `dark-mode` storage key and the `"true"` / `"false"` values.
- Treat absent, invalid, or unreadable values as dark.
- Honor an explicit light or dark choice across reloads and route changes.
- Do not consult `prefers-color-scheme`.

### Add a regression guard for the dark default

- Extend `validate-site-assets.js` with a check that the public manifest declares the dark `theme_color` and `background_color`.
- Extend `validate-site-assets.test.js` with a failing fixture whose manifest colors drift from dark and a passing fixture that matches.
- Keep the check specific to the site's dark default, not to the UI framework.

### Verification strategy

- Automated: Jest/RTL appearance and route tests; site-asset validator and its tests; production build; release verification.
- Manual: fresh storage on every route, OS set to light, saved light/dark persistence, blocked/invalid storage, first-paint observation, browser/PWA chrome, and the deployed site.
- Production check: confirm the deployed commit contains the appearance helper and pre-paint bootstrap. A stale deployment or a previously saved light value can explain a first-hand report of light mode even when the source is correct.

## Complexity Tracking

No constitution violations. The production diff is limited to theme metadata, one CSS declaration, and regression checks. No additional project, service, dependency, or data store is introduced.
