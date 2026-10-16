# Research: Keep Flower Browser Tab Icon

**Date**: 2026-10-16  
**Branch**: `fix/ai-photo-design`  
**Input**: `spec.md`

## Decision 1: Retain the existing flower icon

**Decision**: Continue using `flower.ico` as the browser-tab icon; do not replace it with the “IS.” header mark.

**Rationale**: The user explicitly clarified that the flower icon is preferred. The current `ts-app/public/index.html` already references `%PUBLIC_URL%/flower.ico`, so the likely implementation need is verification rather than an artwork change.

**Alternatives considered**:
- Replace the flower with an “IS.” favicon: rejected by the user's clarification.
- Change the “IS.” header control: rejected because it is a separate in-page homepage action and already navigates to `/`.

## Decision 2: Preserve the deployment-aware resource path

**Decision**: Keep the existing Create React App `%PUBLIC_URL%` icon reference and validate the generated asset and HTML under the `/myWebSite` deployment path.

**Rationale**: `ts-app/package.json` sets the published homepage to `https://isabelsoares.github.io/myWebSite`. `index.html` uses `%PUBLIC_URL%/flower.ico`, which CRA expands for the configured base path and works for client-side routes. A root-relative path could fail on GitHub Pages project hosting.

**Alternatives considered**:
- Replace the path with `/flower.ico`: rejected because that resolves from the domain root.
- Rely on an implicit default icon request: rejected because the current explicit icon reference is already the source of truth.

## Decision 3: Keep scope limited to verification

**Decision**: Verify the existing tab icon on all four routes and refreshes, and preserve the header homepage action. Only change icon metadata if a built artifact check reveals that the current reference is broken.

**Rationale**: The document already references the requested `flower.ico`; unnecessary asset churn could replace the preferred artwork. The manifest lists icon paths that may not exist in `public/`, so inspect whether they affect the required browser tab behavior and avoid a broad installable-app icon redesign.

**Alternatives considered**:
- Regenerate an icon set: rejected unless the validation shows a browser-required missing asset.
- Rewrite the existing header navigation: rejected because `TopBar.tsx` already calls `navigate('/')` for the “IS.” control.

## Repository evidence

- Current tab icon: `ts-app/public/index.html:5` uses `%PUBLIC_URL%/flower.ico`.
- Published base path: `ts-app/package.json:5` sets `https://isabelsoares.github.io/myWebSite`.
- Manifest metadata: `ts-app/public/manifest.json:4-19` contains icon references; its paths should be checked against the public directory.
- Existing homepage action: `ts-app/src/components/top-bar/TopBar.tsx:32-34` renders “IS.” and calls `navigate('/')`.
- Main routes: `ts-app/src/App.tsx:52-57` provides `/`, `/resume`, `/projects`, and `/hobbies`.

## Resolved unknowns

- The desired browser tab artwork is the existing flower icon; no new icon design is required.
- The active HTML reference already uses a base-path-aware public URL.
- The tab icon is not a clickable control; homepage navigation remains the header “IS.” button.
- No new persistent data, runtime code, or package dependency is required.
