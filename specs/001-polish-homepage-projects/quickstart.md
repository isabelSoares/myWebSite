# Quickstart: Polish Homepage & Projects

## Prerequisites

- Node.js and npm installed.
- Dependencies installed for `ts-app` (`npm --prefix ts-app install`) if they are not already present.

## Automated validation

Run from the repository root:

```sh
npm --prefix ts-app test -- --watchAll=false
npm --prefix ts-app run test:assistant-url
npm --prefix ts-app run build
```

Expected outcomes:

- The Jest/React Testing Library suite passes, including assertions for homepage project-section absence, route semantics, and uploader local-validation states.
- The assistant URL validation test passes.
- The production build completes without type or Sass compilation errors.

## Browser smoke validation

Start the app:

```sh
npm --prefix ts-app start
```

Check the following at a desktop width and a narrow mobile width, in both light and dark themes:

1. On `/`, in light and dark themes, verify homepage actions are white at rest, use a clearly darker teal with readable light text on pointer hover, and use light teal on focus/press. Verify unselected TopBar items use rounded darker-teal hover states while the selected item remains light teal, and confirm no personal-project listing appears.
2. On `/projects`, verify all text and action content is left-aligned, the intro spans the available width within page gutters, and the page has no unintended horizontal overflow.
3. On `/projects`, verify the rounded upload box is visually distinct from the page description and contains “No file chosen,” the “Choose photo” button, “Click or drag a photo here,” accepted formats/size, “Review photo,” and the privacy message. Select a supported image by button and by dropping it; confirm filename/preview and enabled review. Try an unsupported and oversized image; confirm error feedback and disabled review. Do not submit a live worker request for this presentation check.
4. On `/hobbies`, verify every strip has “Scroll to explore →”, then scroll a multi-image strip horizontally and open a frame. Confirm the cue also appears for a single-image album.

## Test boundary

Use automated tests for content, routes, accessibility attributes, and local file validation. Use a browser for actual hover/focus styling, visual alignment, color contrast, responsive layout, and horizontal scrolling.
