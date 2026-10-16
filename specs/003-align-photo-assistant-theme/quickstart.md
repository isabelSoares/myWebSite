# Quickstart: Validate AI Photo Assistant Theme Alignment

## Prerequisites

- Node.js and npm installed.
- Dependencies installed in `ts-app/` (`npm ci` if the local installation is absent).
- The app can be run locally with its existing assistant URL configuration. Visual-state checks can use the existing test mocks; no live analysis request is needed to inspect styling.

## Automated checks

From `ts-app/`, run the focused existing app and assistant tests:

```bash
npm test -- --watchAll=false --runTestsByPath src/App.test.tsx src/components/personal-projects/PhotoAssistant.test.tsx
```

Run the full test suite and production build:

```bash
npm test -- --watchAll=false
npm run build
```

Expected: tests pass, the app builds, and existing selection, validation, review, retry, result, and privacy behavior remains unchanged.

## Manual visual and interaction checks

1. Start the app with `npm start` from `ts-app/` and open the Projects route.
2. Review the About, Experience, Projects, and Hobbies pages in light and dark modes; record shared typography, surface, border, and control treatments. Preserve intentional photography treatments such as the Hobbies film-strip frame colors.
3. In each theme, inspect the assistant's empty, selected-photo, drag-over, reviewing, error, and completed states.
4. Switch theme while the assistant has a selected photo and while it shows a result. Confirm appearance updates without reloading or losing the state.
5. Use only the keyboard to reach and operate the file-picker and review controls. Confirm focus is visible and progress/error/result messages remain perceivable.
6. Repeat at desktop width and at 320 CSS px. Confirm there is no horizontal page overflow, clipped controls, or unreadable long filename/message.
7. Check contrast for actual text/background and focus/control-indicator pairs in all states. Normal text target: at least 4.5:1; large text and meaningful non-text indicators: at least 3:1.

Expected: the assistant reads as part of the Projects page in both themes; all controls and states remain distinguishable; the existing photo-review journey continues to work.
