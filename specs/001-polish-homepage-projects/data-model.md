# Data Model: Polish Homepage & Projects

This feature introduces no persistent data. The model below describes visitor-visible, transient UI state only.

## Photo Selection

Represents a photo chosen for an in-browser review session.

| Field | Description | Validation / lifecycle |
|---|---|---|
| File name | Name displayed after selection | Present when a file is selected |
| Media type | Image format selected by the visitor | JPG/JPEG, PNG, or WEBP |
| File size | Size of the selected image | Must be at most 10 MB |
| Preview | Temporary in-browser representation used to show the selected photo | Exists only for the current review session; not persisted |

## Photo Review State

Represents the uploader's visitor-visible progress and feedback.

| State | Entry condition | Visible result |
|---|---|---|
| Empty | Initial page state or reset | “No file chosen” status, “Choose photo” button, upload prompt, format/size guidance, disabled review action, privacy statement |
| Selected | A supported photo within the size limit is chosen through the picker or drop surface | Selected filename or preview and enabled review action |
| Reviewing | Visitor starts review | Progress/status feedback and disabled duplicate submission |
| Completed | Review returns usable guidance | Summary, tips, and relevant photo labels |
| Error | File validation, read, or review fails | Clear error message; visitor can choose another photo |

The photo is not persisted by this feature. Resetting or choosing another photo returns the interaction to an empty or selected state, respectively.

## Navigation and Photo Strip Presentation

- **Current route**: The active route determines which TopBar item is selected and exposes its current-page state.
- **Photo strip**: An album's ordered image list is horizontally scrollable; its adjacent instruction includes a right-arrow cue. No photo data or album ordering changes are required.
