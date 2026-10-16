# Data Model: Align AI Photo Assistant Theme

This feature introduces no persisted entities or service data. The records below describe the existing transient presentation state that the assistant renders from the active site theme and its existing photo-review state.

## Site Theme

Represents the active visual mode selected by the visitor.

| Field | Type | Description | Validation / source |
|---|---|---|---|
| mode | `light \| dark` | Active site-wide visual mode. | Existing app theme state; dark mode is represented by the app wrapper's `.dark-mode` class. |
| preference | boolean | Whether the existing saved preference selects dark mode. | Existing preference persisted by the app; this feature does not change its storage behavior. |

## Assistant Visual State

Represents the assistant's current visible interaction state, styled against the active site theme.

| Field | Type | Description | Validation / source |
|---|---|---|---|
| themeMode | `light \| dark` | Theme inherited from the site. | Must update when the global theme changes. |
| interaction | `empty \| selected \| drag-over \| reviewing \| error \| completed` | Existing photo-assistant interaction state. | Derived from existing component state; no additional state machine or persistence is introduced. |
| preview | temporary image reference or null | Selected photo preview while the review session is active. | Existing temporary handling; no retention changes. |
| message | text or null | Instruction, progress, validation/error message, or result content visible to the visitor. | Must remain readable and identifiable in both themes. |

## Relationships and transitions

- The active **Site Theme** determines the colors and text/background pairings used by every **Assistant Visual State**.
- Photo interaction transitions remain the existing flow: `empty → selected → reviewing → completed`, or `empty/selected/reviewing → error`; drag-over is a temporary selection cue and retry remains available after recoverable errors.
- Changing the site theme updates presentation only; it does not clear the selected photo, reset review progress, or change the review outcome.
- The feature adds no durable photo, result, or assistant-state storage.
