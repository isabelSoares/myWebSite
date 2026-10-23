# Contract: Photo Presentation

**Feature**: `007-photo-display-and-theme`
**Applies to**: About Me featured portrait, Hobbies featured hero, album film strips, and album photo dialog.

## Featured photo placement

### Inputs

- `photoManifest.featured.portrait` for the About Me page.
- `photoManifest.featured.hero` for the Hobbies page.
- Each entry provides `alt`, `rotation`, `full.src`, `full.width`, and `full.height`.

### Required behavior

1. The image is displayed in full; no intentional crop hides part of the photograph.
2. The rendered box uses the intrinsic ratio `full.width / full.height`.
3. The image is not stretched or squashed.
4. The image keeps its intrinsic `width` and `height` attributes so space is reserved before load.
5. At 320 px, 768 px, and 1440 px viewport widths, the image fits the content area without horizontal overflow.
6. On narrow screens, the image may stack above or below the intro copy but must not be reduced below a readable size or cropped to fit.
7. The alternative text from the manifest is used unchanged.

### Out of scope

- Changing which featured photos are selected.
- Adding new photo files or regenerating derivatives.
- Cropping for art direction or adding focal-point controls.

## Album photo orientation

### Inputs

- `photoManifest.albums[].photos[]`, each with `alt`, `rotation`, `thumbnail`, and `full`.
- The current data uses `rotation: 0` and `rotation: 90`.

### Required behavior

| Manifest rotation | Strip frame | Dialog frame | Image behavior |
|-------------------|-------------|--------------|----------------|
| `0` | Portrait (`3 / 4`) | Portrait | Image contained; no crop, stretch, or mirror. |
| `90` | Landscape (swapped to `4 / 3` or the image's rotated ratio) | Landscape | Image rotated clockwise into the landscape frame and fully contained. |

Additional requirements:

1. The strip thumbnail and the dialog image use the same orientation rule.
2. A quarter-turn image must fit entirely inside its frame; no edge may be clipped by an overflow-hidden ancestor.
3. The dialog image must remain fully visible while the dialog content scrolls or resizes.
4. The rotated image must not overlap the previous/next buttons or the close control.
5. The image keeps its alternative text in both the strip and the dialog.
6. The existing drag prevention, context-menu prevention, and keyboard focus behavior remain in effect.

## Album order and navigation

1. The strip renders photos in manifest order, left to right.
2. Frame numbers match `index + 1` and the total frame count matches the album length.
3. `Previous` goes to `index - 1` and is disabled at index `0`.
4. `Next` goes to `index + 1` and is disabled at the last index.
5. The visible scroll hint keeps pointing in the direction of the next photo.
6. Navigation never wraps around or reorders photos.
7. Opening a frame sets the dialog to that frame's index.

## Accessibility

1. Every image has non-empty alternative text from the manifest.
2. Every frame is reachable by keyboard and opens with Enter or Space through its button.
3. The dialog exposes a close control with an accessible name.
4. Focus remains visible on frames, navigation buttons, and the close control.
5. Motion used for rotation must not interfere with reduced-motion preferences; rotation is a static orientation correction, not an animation.

## Failure handling

- If a featured entry is absent, the page renders without the image and without crashing.
- If a manifest dimension is missing or invalid, the image still renders with automatic height; no forced ratio is applied.
- If a rotation value is unsupported, the photo is treated as `0` and remains fully visible; the owner is expected to correct the manifest.
- No error path may fall back to an original photo path.
