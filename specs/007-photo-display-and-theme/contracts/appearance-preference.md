# Contract: Appearance Preference

**Feature**: `007-photo-display-and-theme`
**Applies to**: every route (`/`, `/resume`, `/projects`, `/hobbies`, and not-found), the top navigation, photo frames, dialogs, and the browser theme color.

## Storage contract

| Item | Value |
|------|-------|
| Storage mechanism | Browser `localStorage` |
| Key | `dark-mode` |
| Dark value | `"true"` |
| Light value | `"false"` |
| Missing key | Default appearance |
| Unreadable or inaccessible storage | Default appearance |

The existing key and value format MUST be reused so returning visitors keep their saved choice.

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
2. A visitor with no saved preference sees dark mode immediately; there is no flash of light mode.
3. A visitor with a saved light preference sees light mode immediately; there is no flash of dark mode.
4. The `theme-color` meta value matches the resolved background.
5. If the bootstrap cannot read storage, the page continues to load in dark mode and the React app still renders.

## React state contract

1. React initializes its appearance state from the same resolved value as the pre-paint bootstrap.
2. The root `dark-mode` class, CSS variables, and MUI palette mode all derive from that single value.
3. Toggling changes all of them in the same interaction.
4. Toggling persists `"true"` or `"false"` under `dark-mode`.
5. Navigating between routes does not reset or flip the resolved appearance.
6. A storage write failure does not block the toggle or crash the page; the in-memory appearance still updates.

## Toggle contract

- In dark mode, the toggle offers switching to light and exposes an accessible label describing that action.
- In light mode, the toggle offers switching to dark and exposes an accessible label describing that action.
- The toggle is reachable by keyboard and has a visible focus state.
- The toggle icon and label agree with the current appearance.

## Surface consistency

When the appearance changes, all of the following update together:

- page background and text;
- top navigation background, links, selected state, and toggle;
- section borders and muted text;
- project cards and social links;
- album film-strip background, frame background, frame numbers, and scrollbar colors;
- dialog content and navigation buttons;
- the not-found page;
- the browser theme color.

## Non-goals

- Following the operating-system color scheme automatically.
- Showing a first-run appearance prompt.
- Adding a third appearance mode (for example, high contrast or sepia).
- Migrating visitors to a new storage key.
