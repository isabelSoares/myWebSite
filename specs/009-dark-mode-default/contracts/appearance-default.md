# Contract: Dark Mode Default Appearance

**Feature**: `009-dark-mode-default`
**Applies to**: every route (`/`, `/resume`, `/projects`, `/hobbies`, and not-found), the top navigation, page content, photo frames, dialogs, browser chrome, and installed-app surfaces.

## Storage contract

| Item | Value |
|------|-------|
| Storage mechanism | Browser `localStorage` |
| Key | `dark-mode` |
| Explicit dark value | `"true"` |
| Explicit light value | `"false"` |
| Missing, empty, or invalid value | Dark default |
| Unreadable or inaccessible storage | Dark default |

The existing key and value format MUST be reused so returning visitors keep their saved choice. No migration is performed.

## Resolution contract

| Stored value | Explicit choice | Resolved appearance |
|--------------|-----------------|---------------------|
| absent | none | **dark** |
| `"true"` | dark | **dark** |
| `"false"` | light | **light** |
| any other value | none | **dark** |
| storage throws | none | **dark** |

The default MUST be dark regardless of the operating system's color-scheme setting.

## First-load contract

1. The resolved appearance is applied to the document root before the first visible paint.
2. A visitor with no saved preference sees dark immediately; there is no flash of light.
3. A visitor with a saved light preference sees light immediately; there is no flash of dark.
4. A visitor with a saved dark preference sees dark immediately; there is no flash of light.
5. The `theme-color` meta value matches the resolved background at first paint.
6. If storage cannot be read, the page continues to load in dark mode and the app still renders.
7. The appearance does not wait for React or a user interaction.

## Surface contract

When the resolved appearance is dark, all of the following MUST use the dark appearance:

- page background and text;
- top navigation background, links, selected state, and toggle;
- section borders, muted text, cards, and social links;
- album film-strip background, frame background, frame numbers, and scrollbar colors;
- dialog content and navigation buttons;
- not-found page;
- browser `theme-color` meta value;
- web-app manifest `theme_color` and `background_color`;
- native `color-scheme`.

When the resolved appearance is light, the same surfaces MUST use the light appearance and native `color-scheme: light`.

## Manifest contract

| Field | Required value | Rationale |
|-------|----------------|-----------|
| `theme_color` | `#17262b` | Matches the dark default for installed-app chrome. |
| `background_color` | `#17262b` | Matches the dark default for the install/splash surface. |

The manifest is static and expresses the default only. A visitor's explicit light choice still applies inside the site after load.

## Toggle contract

- In dark mode, the toggle offers switching to light and exposes an accessible label describing that action.
- In light mode, the toggle offers switching to dark and exposes an accessible label describing that action.
- The toggle is reachable by keyboard and has a visible focus state.
- Activating the toggle updates the document-root class, CSS variables, MUI palette, and `theme-color` meta value in the same interaction.
- Activating the toggle persists `"true"` or `"false"` under `dark-mode`.
- A storage write failure does not block the in-memory toggle or crash the page.
- Navigating between routes does not reset or flip the resolved appearance.

## Automated guard contract

- The site-asset validator MUST fail when the public manifest's `theme_color` or `background_color` is not `#17262b`.
- The validator's test suite MUST include a passing fixture and a failing fixture for the manifest colors.
- Existing asset, photo, privacy, build, and route checks MUST continue to pass.

## Non-goals

- Following the operating-system color scheme automatically.
- Showing a first-run appearance prompt.
- Adding a third appearance mode (for example, high contrast or sepia).
- Migrating visitors to a new storage key.
- Generating a per-visitor manifest.
- Changing site content, routes, photos, or photo privacy behavior.
