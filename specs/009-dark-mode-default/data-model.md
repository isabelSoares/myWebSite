# Data Model: Dark Mode Default Appearance

**Feature**: `009-dark-mode-default`
**Date**: 2026-10-26

The feature introduces no database, server state, or persisted content. The entities below describe the browser-side appearance state and the surfaces it drives.

## AppearancePreference

The visitor's explicit appearance choice, stored in the browser.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `storageKey` | string (constant) | Yes | `"dark-mode"`. |
| `rawValue` | string or null | No | The stored value, if any. |
| `explicitChoice` | `"dark"`, `"light"`, or `null` | Yes | `"dark"` for `"true"`, `"light"` for `"false"`, `null` for missing, empty, invalid, or unreadable values. |
| `isExplicit` | boolean (derived) | Yes | `true` when `explicitChoice` is not `null`. |

**Validation rules**:

- The key `dark-mode` is reused; no migration is performed.
- A saved `"true"` means explicit dark; a saved `"false"` means explicit light.
- Missing, empty, invalid, or unreadable storage resolves to dark.
- Only an explicit choice is written back, as `"true"` or `"false"`.
- A storage write failure must not block the toggle or crash the page.

## ResolvedAppearance

The appearance that applies to the current page load.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mode` | `"dark"` or `"light"` | Yes | Effective appearance for the current visitor. |
| `source` | `"default"` or `"explicit"` | Yes | Whether the mode came from the dark default or a saved choice. |
| `resolvedBeforePaint` | boolean | Yes | `true` when the mode was applied to the document root before first paint. |

**Validation rules**:

- `source = "default"` always implies `mode = "dark"`.
- `source = "explicit"` uses the saved choice and may be dark or light.
- `resolvedBeforePaint` must be `true` for every load; the appearance must not wait for React.
- The operating-system color scheme must not change the result.

## ThemeSurface

A visible surface whose appearance changes with the resolved mode.

| Surface | Dark default expectation |
|---------|--------------------------|
| Page background and text | Dark background `#17262b` with light text. |
| Top navigation | Dark translucent background, readable links, selected state, and toggle. |
| Page sections, cards, links | Dark surfaces, borders, and text from the dark palette. |
| Photo strip and frames | Dark strip and frame backgrounds with legible frame numbers. |
| Photo dialog | Dark content and navigation controls. |
| Not-found page | Dark background and text. |
| `theme-color` meta tag | `#17262b` when dark. |
| Web-app manifest `theme_color` | `#17262b`. |
| Web-app manifest `background_color` | `#17262b`. |
| Native color scheme | `dark` when the resolved mode is dark; `light` when explicit light. |

**Validation rules**:

- All surfaces derive from the same resolved appearance.
- No surface may remain light while the resolved mode is dark.
- The manifest colors are static and express the dark default.
- Native `color-scheme` must match the resolved document-root state.

## FirstPaintState

The visible state before and at the first painted frame.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `documentClass` | `"dark-mode"` or none | Yes | Class applied to the document root during head parsing. |
| `themeColor` | CSS color | Yes | Value of the `theme-color` meta tag at first paint. |
| `flashOfWrongTheme` | boolean | Yes | Must be `false` for both default and explicit visits. |

**Validation rules**:

- The bootstrap runs in the document head and resolves the saved value before the app renders.
- A missing or unreadable value yields a dark first paint.
- An explicit light value yields a light first paint without a dark flash.
- An explicit dark value yields a dark first paint without a light flash.
- The `theme-color` meta tag matches the resolved mode at first paint.

## State transitions

### First-time or reset visitor

```text
No saved value
  └─ resolve → dark (default)
       ├─ visitor leaves the site → dark again on the next load
       ├─ visitor toggles to light → store "false" → light
       └─ visitor toggles to dark → store "true" → dark
```

### Returning visitor

```text
Saved "false"
  └─ resolve → light (explicit)
       └─ visitor toggles → store "true" → dark

Saved "true"
  └─ resolve → dark (explicit)
       └─ visitor toggles → store "false" → light
```

### Invalid or unavailable preference

```text
Stored value empty, invalid, or storage throws
  └─ resolve → dark (default)
       └─ page renders without an error or light flash
```
