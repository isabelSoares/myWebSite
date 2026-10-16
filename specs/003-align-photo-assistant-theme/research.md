# Research: Align AI Photo Assistant Theme

**Date**: 2026-10-16  
**Branch**: `fix/ai-photo-design`  
**Input**: `spec.md`

## Decision 1: Treat the existing site theme as the source of truth

**Decision**: Keep the shared site light/dark palette and map the assistant's theme-dependent surfaces and controls to its existing semantic tokens. Do not retain a second fixed assistant palette.

**Rationale**: `ts-app/src/index.css` defines light/dark values for page background, surface, text, muted text, borders, accent, teal, and foreground-on-accent colors. `App.tsx` applies `.dark-mode` on the application wrapper and persists the existing setting. CSS variables inherit to routed components, so the assistant can follow a theme change without adding component theme state or new persistence.

**Alternatives considered**:
- Keep assistant-local colors and add dark-mode overrides: rejected because this duplicates the site's theme and risks drift.
- Add a new theme provider or preference model: rejected because the app already provides both the active theme and persistence.
- Redesign colors across the portfolio: rejected because the request is to align the assistant with the established design, not to change the brand baseline.

**Repository evidence**:
- Theme tokens: `ts-app/src/index.css:1-31`.
- Theme state and wrapper: `ts-app/src/App.tsx:39-58`.
- Toggle: `ts-app/src/components/top-bar/TopBar.tsx:46-53`.
- Shared-token examples: `AboutMe.scss`, `ResumeCV.scss`, `Hobbies.scss`, `PersonalProjects.scss`.
- Assistant-local palette: `ts-app/src/components/personal-projects/photo-assistant.scss:1-29`.

## Decision 2: Use token roles for actual surfaces and foregrounds

**Decision**: Use the site's surface, text, muted, border, accent, teal, and on-color tokens for assistant content. Use an intentional foreground token with each filled action. Keep helper/secondary text on a contrast-appropriate text token rather than the low-contrast subtle color. Validate contrast on the final foreground/background pair for default, hover, focus, disabled, drag-over, error, and result states.

**Rationale**: The site's primary text and muted text pairs are designed for the site backgrounds; by contrast, `--site-subtle` on the light surface is approximately 3.58:1 and is not suitable for normal-size body text. Existing assistant white-on-rust button text is approximately 4.41:1, below WCAG AA's 4.5:1 threshold for normal text. Token reuse and explicit foreground pairing avoid inheriting those shortcomings.

**Alternatives considered**:
- Use `--site-subtle` for all helper text: rejected because it does not meet the normal-text contrast target in the light theme.
- Continue hard-coded white button text: rejected because the background changes by theme and the site already defines on-color tokens.
- Add a separate assistant semantic color palette: rejected for this feature; keep state cues in the established theme and use text/border/icon cues in addition to color.

## Decision 3: Retain explicit non-color interaction cues

**Decision**: Preserve clear visible focus indication, readable state text, and structural cues for drag-over, disabled, error, loading, and completed states. Do not make color the only signal.

**Rationale**: The uploader supports keyboard selection as well as drag-and-drop. A clear state remains perceivable across themes and users. WCAG 2.2 AA includes 4.5:1 normal text contrast, 3:1 large text and relevant non-text control/focus contrast, keyboard operation, dragging alternatives, and status-message expectations.

**Alternatives considered**:
- Color-only changes for drag/error/completion: rejected because state recognition would depend on color perception.
- Make drag-and-drop the only selection path: rejected because the existing file-picker button is the accessible single-pointer and keyboard alternative.
- Add new animations to emphasize each state: rejected because the status is already conveyed by text and additional motion is unnecessary; respect reduced-motion preferences for existing animation.

## Decision 4: Verify the existing visual baseline without broad redesign

**Decision**: Audit About, Experience, Projects, and Hobbies in both theme modes, document shared conventions and intentional exceptions, then limit appearance changes to the AI assistant.

**Rationale**: The routed pages predominantly use `--site-*` tokens. Hobbies photo-strip frames deliberately switch black/white as a photographic presentation, while image saturation treatments are not theme-color inconsistencies. About-page white action buttons are an existing documented design choice. These should not be silently removed as part of the assistant-only alignment.

**Alternatives considered**:
- Normalize all page-specific visual choices: rejected because that expands the scope and would override established design decisions.
- Review only the Projects page: rejected because the request explicitly asks to verify the theme across the site.

## Decision 5: Validate with existing tests, build, and a manual visual matrix

**Decision**: Run the assistant and app tests plus production build, and manually review both themes, responsive widths, keyboard focus, and all assistant states. Use 320 CSS px as the narrow reflow check.

**Rationale**: Current Jest tests cover upload/review outcomes but do not test theme rendering, and the repository has no visual regression or browser automation suite. A manual matrix complements functional tests and checks the actual rendered colors and responsive layout.

**Alternatives considered**:
- Rely only on unit tests: rejected because current tests do not inspect computed visual styles or all routes.
- Introduce a new visual-regression dependency in this feature: rejected because it adds tooling for a focused component style update; manual visual review is sufficient within the current project setup.

## Accessibility references

- [WCAG 2.2 Contrast (Minimum), 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 Non-text Contrast, 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
- [WCAG 2.2 Keyboard, 2.1.1](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html)
- [WCAG 2.2 Dragging Movements, 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [WCAG 2.2 Reflow, 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
- [WCAG 2.2 Status Messages, 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
- [MDN: Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties)

## Resolved unknowns

- No implementation dependency or service integration needs new research; this is a client-side visual alignment in the existing React/Sass app.
- Use existing theme token roles instead of inventing an independent assistant palette.
- No change to the theme's initial default, photo-review workflow, or privacy behavior is required.

## Site-wide theme audit and implementation comparison

The source-level audit covers the four routed sections in `ts-app/src/App.tsx` in both token modes. The light/dark pairs below come from `ts-app/src/index.css` and establish the shared baseline:

| Role | Light | Dark |
|---|---|---|
| Page background | `--site-background` `#f4f0e8` | `--site-background` `#17262b` |
| Raised/content surface | `--site-surface` `#fffdf8` | `--site-surface` `#20383d` |
| Primary text | `--site-text` `#17262b` | `--site-text` `#f4f0e8` |
| Supporting text | `--site-muted` `#53676a` | `--site-muted` `#c4d0d0` |
| Borders | `--site-border` `#cdd2c9` | `--site-border` `#486269` |
| Accent | `--site-accent` `#243b53` | `--site-accent` `#f2c94c` |
| Teal control accent | `--site-teal` `#155e63` | `--site-teal` `#63b3b5` |

### Section findings

- **About** (`AboutMe.scss`): section copy, headings, borders, links, and project cards use shared tokens. The white pill-style homepage actions and portrait saturation treatment are established presentation choices; they are outside the embedded assistant's scope.
- **Experience** (`ResumeCV.scss`): headings, body/supporting copy, separators, and accents use the shared site tokens.
- **Projects** (`PersonalProjects.scss`): page headings, descriptions, links, project cards, and section separators use the shared tokens. The embedded assistant was the distinct component-local palette before this change.
- **Hobbies** (`Hobbies.scss`, `PhotoAlbum.scss`): page copy, separators, and cues use shared tokens. Film-strip frames intentionally invert black/white between themes to present photography consistently; image saturation filters are image treatments, not theme inconsistencies.
- **Navigation** (`TopBar.scss`): navigation, selected/hover states, toggle, and focus styling use site theme variables.

### Assistant comparison

`photo-assistant.scss` no longer defines an independent `--pa-*` color or font palette. Its card and content surfaces use `--site-surface`/`--site-background`; body and supporting copy use `--site-text`/`--site-muted`; dividers, actions, tags, progress, drag-over, and focus states use the shared border, accent, and teal roles. Filled buttons pair site accent/hover backgrounds with their corresponding `--site-on-*` foreground tokens. Error content remains explicitly labeled by its existing `role="alert"` and is distinguished by a themed accent border as well as message text.

The assistant keeps its temporary preview and existing selection/review/error/result DOM states; inherited CSS variables allow these states to update when the app wrapper toggles `.dark-mode`. The uploader's dashed boundary and spinner were assigned higher-contrast token roles, and disabled button text remains legible without opacity fading. No page-wide styles or intentional photography treatments were changed.

### Implementation validation

Contrast ratios were calculated from the site's configured token values for the actual assistant pairings. Normal text and filled button pairs meet the 4.5:1 WCAG AA target; focus accents and meaningful control cues exceed 3:1 in both themes.

| Pair | Light | Dark |
|---|---:|---:|
| Primary text on content surface | 15.32:1 | 10.90:1 |
| Supporting text on content surface | 5.88:1 | 7.84:1 |
| Teal label on content surface | 7.34:1 | 5.10:1 |
| Filled primary button foreground/background | 11.32:1 | 9.81:1 |
| Filled button hover foreground/background | 7.34:1 | 7.03:1 |
| Focus accent against page background | 10.12:1 | 9.81:1 |
| Disabled button text on disabled surface | 10.13:1 | 5.73:1 |

The focused assistant/app tests passed (9 tests across 2 suites), the full existing suite passed (9 tests), and the production build compiled. A source scan confirms `photo-assistant.scss` contains no component-local color palette or fixed color literals. No browser executable or browser automation package is installed in this environment, so rendered visual inspection at desktop and 320 CSS px remains a manual quickstart check.
