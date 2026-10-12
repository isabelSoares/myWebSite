# Feature Specification: Polish Homepage & Projects

**Feature Branch**: `bugfix/proj-page-improvements`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "Change homepage button colors to white and show light teal for the selected state; remove the personal projects section from the homepage; make TopBar button hover states rounded; left-align all text on the Projects page and make its introduction full width; highlight the photo upload area; and add a rightward scrolling cue to hobby photo strips."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear homepage navigation and actions (Priority: P1)

As a visitor, I want the homepage actions and navigation to have consistent, clear states so that I can identify available destinations and the current page.

**Why this priority**: The homepage is the primary entry point, and its controls provide the main routes through the site.

**Independent Test**: Visit the homepage and inspect every action and navigation control in its resting, hovered, focused, and selected states.

**Acceptance Scenarios**:

1. **Given** the homepage is open, **When** its action buttons are displayed, **Then** each has a white background and legible text.
2. **Given** a homepage action is hovered, **When** its hover state appears in either theme, **Then** it uses a clearly darker theme teal than the selected light-teal state and the text remains high-contrast.
3. **Given** a homepage action is focused or activated, **When** its highlighted state appears, **Then** it uses light teal with readable contrast, visually distinct from pointer hover.
4. **Given** an unselected TopBar navigation button, **When** the pointer hovers over it, **Then** it uses a darker theme teal and rounded corners.
5. **Given** a TopBar navigation button is selected, **When** the pointer hovers over it, **Then** its light-teal selected state remains visually distinct from the hover state of unselected buttons.
6. **Given** the homepage is open, **When** the visitor scans its content, **Then** the personal-projects section and its project cards are not displayed there.

---

### User Story 2 - Scan the Projects page comfortably (Priority: P1)

As a visitor, I want the Projects page introduction and project content aligned to the left and the introduction to use the available content width so that I can read and scan the page consistently.

**Why this priority**: The Projects page is a primary destination from the homepage and contains the feature's main explanatory content.

**Independent Test**: Open the Projects page at desktop and mobile widths and inspect the introduction, headings, descriptions, project cards, and project actions.

**Acceptance Scenarios**:

1. **Given** the Projects page is open, **When** the visitor reads the introduction, **Then** its kicker, title, and paragraph are left-aligned and the intro content spans the available page content width rather than being constrained to half of it.
2. **Given** the Projects page contains headings and project content, **When** the visitor scans the page, **Then** all headings, descriptions, labels, and project actions are left-aligned.
3. **Given** the viewport narrows, **When** the Projects page reflows, **Then** text remains left-aligned and readable without horizontal page overflow.

---

### User Story 3 - Find and use the photo upload area (Priority: P2)

As a visitor, I want the photo uploader clearly separated from the Projects page description, with distinct file-selection and review actions, so that I know where and how to submit a photo.

**Why this priority**: Visitors currently have difficulty distinguishing explanatory project text from the photo-upload action; a clearly bounded control area makes the primary interaction discoverable.

**Independent Test**: Open `/projects`; verify the uploader is visually separate from the explanatory text, select a photo using its button, and verify empty, selected, invalid, and oversized-file states.

**Acceptance Scenarios**:

1. **Given** no photo is selected, **When** the Projects page is displayed, **Then** a distinct rounded box separates the uploader from explanatory copy and contains “No file chosen,” a “Choose photo” button, “Click or drag a photo here,” “JPG, PNG, or WEBP. Max 10 MB,” a disabled “Review photo” button, and the privacy message.
2. **Given** the visitor activates “Choose photo,” **When** the file picker opens, **Then** choosing a supported photo within the size limit displays its filename or preview inside the rounded box and enables “Review photo.”
3. **Given** the visitor drops a supported photo onto the upload area, **When** the selection is validated, **Then** the same selected-photo state appears as when using “Choose photo.”
4. **Given** the visitor chooses or drops an unsupported or oversized file, **When** validation runs, **Then** a clear error appears inside the upload area and “Review photo” remains disabled.
5. **Given** the Projects page is viewed at a narrow viewport or with a keyboard, **When** the visitor reaches the uploader, **Then** the rounded box remains readable, controls remain operable, and focus is visible.

---

### User Story 4 - Discover horizontal photo browsing (Priority: P2)

As a visitor browsing hobbies, I want a directional cue beside the photo-strip instruction so that I know more photos are available to the right.

**Why this priority**: The photo strips contain horizontally scrollable content that may not be apparent from the first visible frames.

**Independent Test**: Open the Hobbies page and inspect the instruction for each photo strip, then scroll the strip horizontally to view later photos.

**Acceptance Scenarios**:

1. **Given** a photo strip is displayed, **When** its instruction is shown, **Then** “Scroll to explore” is followed by a right-pointing arrow cue.
2. **Given** the visitor follows the cue, **When** they scroll right, **Then** additional photos in that strip become visible.

### Edge Cases

- At narrow viewport widths, rounded navigation states and white homepage buttons remain legible and usable.
- The Projects intro uses the available content width while respecting page gutters at all supported viewport sizes.
- Empty, valid, invalid, and oversized upload states retain clear guidance and feedback.
- Photo strips with only one image still display the directional instruction consistently; the strip itself remains operable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Homepage action buttons MUST use a white resting background with readable text.
- **FR-002**: Homepage action buttons MUST use a clearly darker theme teal on pointer hover and light teal on keyboard focus or activation in both themes. Hover text MUST use a contrasting foreground that remains readable against the hover color.
- **FR-003**: Unselected TopBar navigation buttons MUST use rounded corners and a darker theme teal on hover; a selected navigation button MUST retain its light-teal selected treatment while hovered.
- **FR-004**: The homepage MUST NOT display the personal-projects section or its project cards.
- **FR-005**: The Projects page MUST left-align its introductory kicker, title, and descriptive paragraph.
- **FR-006**: The Projects page introduction MUST use the available content width within the page's layout gutters.
- **FR-007**: All visible Projects page headings, descriptions, labels, and project actions MUST be left-aligned.
- **FR-008**: The photo uploader MUST visually distinguish its upload interaction and present the file prompt, accepted formats, maximum size, review action, and privacy message together as a highlighted area.
- **FR-009**: The uploader MUST continue to accept JPG, PNG, and WEBP photos up to 10 MB and provide clear feedback for invalid or oversized selections.
- **FR-010**: Each hobby photo-strip instruction MUST show a right-pointing arrow after “Scroll to explore.”
- **FR-011**: Photo strips MUST remain horizontally scrollable so visitors can reach photos beyond the initially visible frames.
- **FR-012**: Layout and control states MUST remain usable and readable on narrow and wide viewports.
- **FR-013**: The photo upload area MUST be a clearly bounded rounded box visually distinct from explanatory Projects page text.
- **FR-014**: Before selection, the upload box MUST display “No file chosen,” a “Choose photo” file-picker button, the instruction “Click or drag a photo here,” accepted formats and size limit, a disabled “Review photo” button, and the privacy message.
- **FR-015**: The upload area MUST allow a supported photo to be selected through the file-picker button or dropped onto the designated upload surface; both methods MUST use the same type and size validation.
- **FR-016**: After a valid selection, the upload box MUST show the chosen filename or preview and enable “Review photo”; invalid or oversized files MUST show an error and keep review disabled.

### Key Entities *(include if data involved)*

- **Photo selection**: A visitor-selected image with a supported file type and size, shown by filename or preview during its temporary review session.
- **Photo review state**: The uploader's visible state, such as empty, selected, reviewing, completed, or error; the photo is analyzed in real time and is not stored.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All homepage action buttons visibly use white at rest, a clearly distinct darker theme teal on hover, and light teal on focus/press in both themes; the homepage contains zero personal-project cards.
- **SC-002**: At desktop and mobile viewport sizes, 100% of the Projects page's visible text content is left-aligned, and the intro spans the available content width within the page gutters.
- **SC-003**: In the initial uploader state, 100% of the required status, file-selection, guidance, review, and privacy content is visible inside a rounded box distinct from the Projects description.
- **SC-004**: Every hobby photo strip displays the right-arrow cue, and visitors can horizontally reach all photos in that strip.
- **SC-005**: Visitors can distinguish pointer hover from the selected TopBar page by color, and both states retain rounded styling.
- **SC-006**: Visitors can select a valid photo by button or drag-and-drop, see its filename or preview, and reach the review action without ambiguity; invalid and oversized selections remain blocked with a clear error.

## Assumptions

- “Button colours to white” means a white button background with text colored for adequate contrast.
- A current/selected or pressed state uses light teal; pointer hover uses a darker teal from the existing theme palette so the states are distinguishable.
- A selected TopBar item retains its light-teal treatment when hovered; only unselected TopBar items switch to the darker hover color.
- Dark-mode hover uses a substantially darker teal surface with a light foreground; selected/pressed states retain the brighter light teal with dark foreground.
- The upload box groups the empty status, file-picker control, prompt, file guidance, review action, and privacy message, separately from descriptive project content.
- “Choose photo” is the visible file-picker button label; “Review photo” continues to start the existing analysis flow.
- The displayed drag instruction is functional: supported dropped images use the same validation as file-picker selections.
- Existing photo analysis behavior, privacy statement, supported file formats, and 10 MB limit are retained.
- The personal-projects content remains available on the Projects page; only its homepage section is excluded.
