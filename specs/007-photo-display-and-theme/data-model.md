# Data Model: Photo Framing, Album Orientation, and Dark Theme Default

**Feature**: `007-photo-display-and-theme`
**Date**: 2026-10-23
**Source of truth**: `ts-app/src/data/photo-manifest.json` (generated, read-only for this feature) and browser `localStorage` for the appearance preference.

## Overview

The feature introduces no new persisted photo data. It derives presentation state from the existing manifest and adds one small persisted value for the visitor's appearance choice. All types below describe existing or derived data; only `AppearancePreference` is new runtime state.

## Entities

### FeaturedPhoto

A large presentation photo selected in the manifest for the About Me page or the Hobbies page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | `"portrait"` or `"hero"` | Yes | Which page placement uses the photo. |
| `sourceId` | string | Yes | Stable identifier from the generated manifest. |
| `alt` | string | Yes | Alternative text for the image. |
| `rotation` | `0` or `90` | Yes | Orientation correction; `0` for both current featured photos. |
| `thumbnail` | `PhotoDerivative` | Yes | Thumbnail metadata; not used for the large featured placement. |
| `full` | `PhotoDerivative` | Yes | Full derivative used by the featured placement. |
| `displayAspectRatio` | number (derived) | Yes | `full.width / full.height`; drives the natural, uncropped layout. |

**Relationships**:
- Selected by `photoManifest.featured.portrait` for About Me and `photoManifest.featured.hero` for Hobbies.
- Has one `PhotoDerivative` for the thumbnail and one for the full image.

**Validation rules**:
- `full.width` and `full.height` must be positive integers.
- `displayAspectRatio` must equal `full.width / full.height`.
- The rendered image must use the natural ratio, not a forced decorative ratio.
- The image must not reference an original file path; only the generated derivative path is allowed.

### AlbumPhoto

A single photograph inside an album's film strip and enlarged dialog.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceId` | string | Yes | Stable identifier from the generated manifest. |
| `alt` | string | Yes | Alternative text for the image. |
| `rotation` | `0` or `90` | Yes | Optional manual correction only; `0` for all current photos because derivatives are EXIF-normalized. |
| `thumbnail` | `PhotoDerivative` | Yes | Small derivative used in the film strip. |
| `full` | `PhotoDerivative` | Yes | Larger derivative used in the dialog. |
| `albumId` | string (derived) | Yes | Parent album identifier. |
| `index` | integer (derived) | Yes | Zero-based position in the album; also the visible frame number. |

**Relationships**:
- Belongs to exactly one `Album`.
- Uses one `PhotoDerivative` for the strip and one for the dialog.
- May derive a manual `PhotoOrientation` from an explicit non-zero `rotation`.

**Validation rules**:
- `rotation` must be `0` or `90`; all current photos are `0`.
- The generated derivative must not be rotated again when `rotation` is `0`.
- The same orientation must be applied to the strip and the dialog.
- `index` order must match the manifest order; it must not be sorted by orientation or filename.
- Previous/Next must not move below `0` or above `album.photos.length - 1`.
- Images must keep their alternative text and must not expose original file paths.

### PhotoDerivative

A published, web-sized image file.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | string | Yes | Public URL path, relative to the generated photos directory. |
| `width` | integer | Yes | Intrinsic width in pixels. |
| `height` | integer | Yes | Intrinsic height in pixels. |
| `bytes` | integer | Yes | File size in bytes, used by existing validation. |

**Validation rules**:
- Width and height must be positive.
- Files must remain within the existing thumbnail and full limits.
- The file must exist under `ts-app/public/photos/generated/`.
- No original photo path may be substituted.

### PhotoOrientation

A derived presentation value for an album photo that needs an explicit manual rotation.

| Field | Type | Description |
|-------|------|-------------|
| `rotation` | `0` or `90` | Source value from the manifest. |
| `isQuarterTurn` | boolean | `true` when `rotation` is `90`; false for every current photo. |
| `frameOrientation` | `"portrait"` or `"landscape"` | `portrait` for `0`; `landscape` for a manual `90`. |

**Validation rules**:
- EXIF normalization happens in the photo build, not in this presentation value.
- A current photo with `rotation: 0` must not receive a CSS rotation.
- A manual `rotation: 90` image must fit entirely inside the landscape frame.
- No orientation may cause clipping, stretching, mirroring, or horizontal overflow.

### Album

A named group of photographs on the Hobbies page.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Stable album identifier. |
| `name` | string | Yes | Display name. |
| `photos` | `AlbumPhoto[]` | Yes | Ordered list of published photos. |

**Validation rules**:
- Photo order is preserved exactly as curated.
- The visible frame count equals `photos.length`.
- Empty albums are not rendered.
- Albums and photo counts remain unchanged by this feature.

### AppearancePreference

The visitor's explicit appearance choice, stored in the browser.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `storageKey` | string (constant) | Yes | `"dark-mode"`. |
| `rawValue` | string or null | No | The stored value, if any. |
| `explicitChoice` | `"dark"`, `"light"`, or `null` | Yes | `"dark"` for `"true"`, `"light"` for `"false"`, `null` for missing or unreadable values. |
| `resolvedAppearance` | `"dark"` or `"light"` | Yes | `explicitChoice` when present; otherwise `"dark"`. |
| `isExplicit` | boolean (derived) | Yes | `true` when `explicitChoice` is not `null`. |

**Validation rules**:
- A missing, empty, or unreadable value resolves to dark.
- An explicit `"false"` resolves to light and must survive reloads.
- An explicit `"true"` resolves to dark and must survive reloads.
- The stored value is written only for an explicit choice, using `"true"` or `"false"`.
- The resolved appearance must drive the document-root class, CSS variables, MUI palette, and the `theme-color` meta tag together.

### SiteAppearance

The effective visual appearance for the current render.

| Field | Type | Description |
|-------|------|-------------|
| `mode` | `"dark"` or `"light"` | Resolved appearance. |
| `documentClass` | `"dark-mode"` or none | Class applied to the document root and app root. |
| `muiPaletteMode` | `"dark"` or `"light"` | MUI palette mode derived from the same resolution. |
| `themeColor` | CSS color | Browser chrome color matching the background. |

**Validation rules**:
- All four fields must be derived from the same resolved value.
- The document-root class must be applied before first paint for the resolved mode.
- Toggling must update all four fields in the same interaction.

## State transitions

### Appearance preference

```text
No saved value
  └─ resolve → dark
       ├─ visitor leaves it → remain dark on every load
       ├─ visitor toggles to light → store "false" → light
       └─ visitor toggles to dark → store "true" → dark

Saved "false"
  └─ resolve → light
       └─ visitor toggles → store "true" → dark

Saved "true"
  └─ resolve → dark
       └─ visitor toggles → store "false" → light

Stored value unreadable or storage unavailable
  └─ resolve → dark without crashing the page
```

### Album photo orientation

```text
Manifest rotation 0 (all current photos)
  └─ portrait frame → already-upright image contained → strip and dialog match

Manifest rotation 90 (future manual correction only)
  └─ landscape frame → image rotated and contained → strip and dialog match

Browsing
  └─ Previous index - 1 (disabled at 0)
  └─ Next index + 1 (disabled at last)
  └─ Strip order = manifest order
```

## Invariants

- The generated derivatives, album order, photo count, and privacy limits remain unchanged.
- The manifest change is limited to correcting EXIF-orientation metadata from `rotation: 90` to `rotation: 0` for the 19 affected photos.
- Every displayed image keeps meaningful alternative text.
- Every displayed image comes from an approved generated derivative.
- No featured or album framing introduces horizontal overflow or unintended layout shift.
- The appearance default is dark; an explicit light or dark choice always wins over the default.
