# Feature Specification: Align AI Photo Assistant Theme

**Feature Branch**: `fix/ai-photo-design`

**Created**: 2026-10-16

**Status**: Draft

**Input**: User description: "verify the design theme of all site and update ai photo assistant to have the same design theme like the remaining site"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Use the assistant in either site theme (Priority: P1)

As a visitor, I want the AI photo assistant to look and feel like the rest of the site in both light and dark themes so that the assistant feels like an integrated part of the Projects page and remains comfortable to use after I change themes.

**Why this priority**: The assistant is a prominent interactive feature on the Projects page and currently has a separate warm palette that clashes with the site-wide theme, especially in dark mode.

**Independent Test**: Open the Projects page, inspect the assistant in light mode, switch to dark mode, and inspect its empty, selected-photo, in-progress, error, and result states at desktop and mobile widths.

**Acceptance Scenarios**:

1. **Given** the Projects page is displayed in light mode, **When** a visitor views the assistant, **Then** its surfaces, text, borders, and controls use the same visual theme as the surrounding site.
2. **Given** the assistant is visible, **When** the visitor switches the site to dark mode, **Then** the assistant updates to the dark theme without requiring a page reload and its text and controls remain legible.
3. **Given** a visitor selects, drags, reviews, or receives a result for a photo, **When** the assistant displays each interaction state, **Then** the state is distinguishable and uses the current site theme.
4. **Given** a visitor navigates by keyboard, **When** focus reaches an assistant control, **Then** its focus state is visible against the current theme.

---

### User Story 2 - Confirm the site-wide visual baseline (Priority: P2)

As a site owner, I want the visual theme across the site's main sections reviewed so that the assistant can follow the established design language rather than introducing another visual system.

**Why this priority**: A concise review establishes a consistent reference for the assistant and verifies its appearance against the site's existing pages and theme modes.

**Independent Test**: Review About, Experience, Projects, and Hobbies in both theme modes, record the shared color, typography, surface, border, and control treatments, and compare the assistant against that baseline.

**Acceptance Scenarios**:

1. **Given** the site's main sections are reviewed, **When** their light and dark appearances are compared, **Then** the established shared theme and any intentional page-specific exceptions are identified.
2. **Given** the baseline is identified, **When** the assistant is compared with the Projects page and site controls, **Then** no unrelated assistant-only palette remains in its theme-dependent interface.

### Edge Cases

- Theme changes while the assistant is showing a selected photo, an in-progress review, an error, or a result.
- Drag-over, disabled, hover, active, and keyboard-focus states must remain distinguishable in both themes.
- Long filenames, guidance text, and errors must remain readable and fit within narrow layouts.
- The photo preview and result content must remain visible without forcing the visitor to use a particular theme.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site's About, Experience, Projects, and Hobbies sections MUST be reviewed in light and dark modes to establish the existing visual baseline for colors, typography, surfaces, borders, and controls.
- **FR-002**: The AI photo assistant MUST use the established site theme for its theme-dependent backgrounds, text, borders, buttons, labels, status messages, and result content in both light and dark modes.
- **FR-003**: The assistant MUST update its appearance when the visitor changes the site theme, without requiring a page reload.
- **FR-004**: The assistant MUST provide visually distinguishable hover, focus, disabled, drag-over, in-progress, error, and completed states in both themes.
- **FR-005**: Text and interactive controls in the assistant MUST remain readable and identifiable against their backgrounds in both themes.
- **FR-006**: The assistant MUST remain usable at narrow and wide viewport sizes without horizontal page overflow or clipped controls and messages.
- **FR-007**: Theme alignment MUST preserve the existing photo-selection, validation, review, retry, result, and privacy-notice behavior.

### Key Entities *(include if data involved)*

- **Site theme**: The visitor-selected light or dark visual presentation shared by the site's main sections and controls.
- **Assistant visual state**: The assistant's appearance for the current theme and interaction state, including empty, selected, drag-over, reviewing, error, and completed states.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four main site sections and the AI photo assistant are reviewed in both light and dark modes, and the shared visual baseline is documented.
- **SC-002**: In both theme modes, 100% of the assistant's visible theme-dependent surfaces and controls are consistent with the established site palette and typography.
- **SC-003**: Visitors can distinguish each assistant interaction state and read its visible text in both themes at desktop and mobile viewport sizes.
- **SC-004**: Switching themes updates the assistant immediately in every tested state, without a reload or loss of the current assistant state.
- **SC-005**: Existing photo selection, review, retry, result, and privacy behavior continues to pass its current user-facing checks after the visual update.

## Assumptions

- The site's existing light and dark themes are the source of truth; this feature does not introduce new brand colors or redesign the other sections.
- About, Experience, Projects, and Hobbies are the site's main sections to include in the visual review.
- The assistant's photo-analysis workflow, validation limits, and privacy behavior remain unchanged.
- Any intentionally distinct photography presentation elsewhere on the site is not an inconsistency to remove; the review is focused on the shared site interface and its controls.
