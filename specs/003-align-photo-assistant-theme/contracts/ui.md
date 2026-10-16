# UI Contract: AI Photo Assistant Theme Alignment

## Scope

This contract describes the user-visible appearance and state behavior of the AI photo assistant embedded on the Projects page. It is not a new network API. Existing selection, validation, review, retry, result, and privacy behavior remains authoritative.

## Theme contract

- The assistant follows the active site light or dark theme without a reload.
- Theme-dependent surfaces, text, borders, controls, tags, and state messages use the established site visual palette and typography.
- Every filled control pairs its background with a foreground intended for that theme.
- Normal text meets WCAG 2.2 AA contrast of at least 4.5:1 against its actual background; large text and meaningful control/focus indicators meet the applicable 3:1 contrast requirement.
- No state is conveyed by color alone.

## Observable state contract

| State | Required visible behavior |
|---|---|
| Empty | Upload prompt, accepted file guidance, privacy message, and unavailable review action remain legible and clearly grouped. |
| Selected | Filename or preview and enabled review action remain visible and fit the available width. |
| Drag-over | A visible border/surface cue and existing prompt make the drop target clear; the file-picker path remains available. |
| Reviewing | An explicit in-progress message remains readable and distinguishable from the idle state. |
| Error | The message is clearly identifiable as an error, readable, and accompanied by the existing recovery path. |
| Completed | The result summary, guidance, labels, and next-photo action remain legible and visually grouped. |
| Keyboard focus | The focused control has a visible indicator against both its control surface and nearby background. |
| Disabled | The unavailable action is visibly unavailable while its label remains understandable. |

## Responsive and input behavior

- At a 320 CSS px viewport, the assistant must reflow without horizontal page scrolling, clipped controls, or inaccessible messages.
- File selection remains possible with the existing browse/file-picker control; drag-and-drop is an additional method, not a requirement.
- Long filenames, result text, and error text wrap within the assistant's content area.
- Theme changes do not discard the selected file, interrupt the existing review state, or alter an existing result.
