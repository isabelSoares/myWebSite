# Research: Polish Homepage & Projects

## Existing UI and test conventions

**Decision**: Keep the feature within the existing React application and use its Jest/React Testing Library setup for semantic and interaction checks, supplemented by a targeted browser smoke check for CSS and scrolling.

**Rationale**: `ts-app/package.json` already provides `react-scripts test`, `@testing-library/react`, `@testing-library/user-event`, and `@testing-library/jest-dom`. `src/App.test.tsx` already tests the routed application. There is no existing Playwright or Cypress setup. RTL is appropriate for visible content, route state, file validation, and alerts; browser checks are more reliable for hover/focus pseudo-classes, responsive geometry, contrast, and actual scroll behavior.

**Alternatives considered**:

- Adding an end-to-end testing framework: rejected as unnecessary setup for this focused presentation feature.
- Testing CSS pseudo-classes only with jsdom: rejected because jsdom does not reliably represent rendered visual states and layout.
- Relying only on a production build: rejected because a build cannot verify routes, visible content, upload feedback, responsive layout, or horizontal scrollability.

## Technology and component boundaries

**Decision**: Use the current React 17 / TypeScript 4.9 / React Router 6 / Material UI 5 / Sass stack and CSS custom properties for color and theme behavior. Use a dedicated, substantially darker dark-mode hover teal with a light foreground; keep selected/pressed states light teal with dark text. Do not add dependencies or change the remote photo-analysis interface.

**Rationale**: The relevant routes and components already exist in `src/App.tsx`, `components/top-bar/`, `components/about-me/`, `components/personal-projects/`, and `components/hobbies/`. The app defines light/dark color tokens in `src/index.css`. The feature changes presentation and local user guidance, not service or data architecture.

**Alternatives considered**:

- Replacing the existing component or styling approach: rejected because it increases scope without addressing a requirement better than the established patterns.
- Modifying or calling the photo-analysis worker as part of validation: rejected because upload visualization and local file validation can be checked without a live service.

## Validation findings and risks

**Decision**: Verify empty, valid, invalid, and oversized uploader states locally; verify CSS and strip behavior in a browser at desktop and narrow mobile widths. Preserve the actual horizontal strip overflow while checking that the page itself has no horizontal overflow.

**Rationale**: `PhotoAssistant.tsx` validates MIME type and the 10 MB limit in the browser and exposes errors with `role="alert"`. The worker is only contacted after form submission. `PhotoAlbum.tsx` renders the hint for each album and the corresponding Sass enables horizontal scrolling. Focus visibility, contrast in both themes, and narrow TopBar behavior require visual checks.

The existing `App.test.tsx` contains a homepage assertion for project-card text even though the current homepage component does not render the project section and the feature explicitly excludes it. Update that assertion to verify absence rather than preserving stale expected content.

The existing file input is hidden inside the upload label and there is no separate visible file-picker button or drag-and-drop event handling. The revised interaction contract requires a visible “Choose photo” control and working drop behavior; both should feed the existing file-type and size validation without changing the remote review request.

**Alternatives considered**:

- Exercise a live photo review request in tests: rejected because it depends on the remote worker and tests service behavior unrelated to this UI update.
- Add new persistence or model/service layers: rejected because selected image state is ephemeral and no new data lifecycle is required.

## Interface contract decision

**Decision**: Document the public, visitor-facing route and interaction expectations in `contracts/ui.md`. No new API contract is needed.

**Rationale**: The application exposes its behavior through browser routes and accessible controls. The existing worker request and response contract remains unchanged and outside this feature's scope.

**Alternatives considered**:

- Add a new backend/API contract: rejected because no endpoint, payload, or service behavior is changing.
