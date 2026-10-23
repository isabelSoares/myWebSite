# Feature Specification: Photo Framing, Album Orientation, and Dark Theme Default

**Feature Branch**: `007-photo-display-and-theme`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "all the photos as hero banner on about me and hobbies are not well, more vertical and with zoom. You removed the direction of the photos on photo albums. Solve the photos problems. The default was dark mode and now is light mode, i want to have dark mode as default."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Featured photos display without vertical stretching or zoom (Priority: P1)

As a portfolio visitor, I want the featured photo on the About Me page and the featured photo on the Hobbies page to appear naturally framed so that I can see the whole photograph without an uncomfortable vertical crop or zoomed-in view.

**Why this priority**: These are the largest, most prominent photographs on the site. Poor framing distorts the subject and makes the portfolio look unfinished, so it directly affects the first impression of every visitor.

**Independent Test**: Open the About Me page and the Hobbies page at desktop, tablet, and mobile widths; confirm that each featured photograph is shown in full, keeps its natural proportions, and has no forced vertical crop or zoom.

**Acceptance Scenarios**:

1. **Given** a visitor opens the About Me page, **When** the featured portrait is displayed, **Then** the full subject is visible and the image keeps its natural proportions.
2. **Given** a visitor opens the Hobbies page, **When** the featured photograph is displayed, **Then** the image is shown without a zoomed-in crop and keeps its natural proportions.
3. **Given** the viewport narrows on a phone or tablet, **When** the featured photographs reflow, **Then** they remain fully visible and undistorted.
4. **Given** the featured photograph loads slowly, **When** it appears, **Then** the reserved space matches the final image proportions and the surrounding layout does not jump.

---

### User Story 2 - Album photos keep their intended orientation and browsing direction (Priority: P2)

As a portfolio visitor, I want every album photograph to appear in the correct orientation and to browse in the expected direction so that photos are never sideways, upside down, or navigated the wrong way.

**Why this priority**: Orientation errors make the albums confusing and can make landscape photos look broken. Restoring the intended direction preserves the photographer's framing and the browsing experience.

**Independent Test**: Open every album, visit each photo in the film strip and in the enlarged dialog, and confirm that rotated photos are upright, uncropped, and that previous/next and horizontal browsing move in the expected direction.

**Acceptance Scenarios**:

1. **Given** an album contains a photo that needs rotation, **When** it appears in the film strip, **Then** it is shown upright and fully within its frame.
2. **Given** an album contains a photo that needs rotation, **When** it is opened in the enlarged dialog, **Then** it is shown upright and not stretched, mirrored, or cropped.
3. **Given** a visitor browses an album, **When** they move forward or backward, **Then** the movement matches the direction indicated by the control.
4. **Given** a visitor mixes portrait and landscape photos in one album, **When** they browse the album, **Then** each photo keeps its own proportions and no frame distorts the image.

---

### User Story 3 - Dark mode is the default appearance (Priority: P2)

As a portfolio visitor arriving for the first time, I want the site to open in dark mode as it did before so that the portfolio feels consistent and comfortable from the first page load.

**Why this priority**: The site owner considers dark mode part of the site's identity. A first-time visitor currently sees light mode, which is a visible regression in the intended presentation.

**Independent Test**: Open the site in a fresh browser session with no saved appearance choice and confirm that every page loads in dark mode; then switch to light mode, reload, and confirm that the explicit choice is remembered.

**Acceptance Scenarios**:

1. **Given** a first-time visitor with no saved appearance preference, **When** any page of the site loads, **Then** the page is presented in dark mode.
2. **Given** a visitor has explicitly chosen light mode, **When** they reload the site or open another page, **Then** light mode remains their chosen appearance.
3. **Given** a visitor has explicitly chosen dark mode, **When** they reload the site or open another page, **Then** dark mode remains their chosen appearance.
4. **Given** a visitor toggles the appearance, **When** the switch completes, **Then** every visible section, navigation element, photo frame, and dialog updates consistently.
5. **Given** a first-time visitor loads a page, **When** the site first appears, **Then** there is no visible flash of the wrong appearance before dark mode is applied.

---

### Edge Cases

- A featured photograph is portrait on one page and landscape on another; each must keep its own proportions.
- A featured photograph is much taller or wider than the page area reserved for it.
- Album photos are a mix of portrait, landscape, and photos that require a quarter-turn correction.
- An album photo's recorded orientation is missing, invalid, or already corrected in the generated image.
- A visitor opens an album and moves from the first photo to the last photo, including when the first or last navigation control is unavailable.
- A visitor uses a very narrow phone screen or a very wide desktop screen.
- A visitor has saved an appearance preference from an earlier version of the site.
- A visitor changes appearance while an album or photo dialog is open.
- A visitor uses a keyboard, screen reader, or reduced-motion setting.
- A featured photograph fails to load or loads after the surrounding content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The About Me featured portrait MUST be displayed in full with its natural proportions and without an intentional vertical crop or zoom.
- **FR-002**: The Hobbies featured photograph MUST be displayed in full with its natural proportions and without an intentional vertical crop or zoom.
- **FR-003**: Featured photographs MUST remain undistorted and fully visible at phone, tablet, and desktop widths.
- **FR-004**: The layout MUST reserve space that matches each featured photograph's proportions so that the page does not shift when the image loads.
- **FR-005**: Album photos MUST respect their recorded orientation in both the film strip and the enlarged dialog.
- **FR-006**: Album photos that require correction MUST appear upright, not sideways, upside down, stretched, or mirrored.
- **FR-007**: Album film strips and dialogs MUST show the whole photograph without unintended cropping or zoom.
- **FR-008**: Album browsing controls MUST move in the direction they indicate, and the visible scroll direction MUST match the order of the photos.
- **FR-009**: Each album MUST preserve its existing photo order.
- **FR-010**: The site MUST present dark mode by default when a visitor has no saved appearance preference.
- **FR-011**: An explicit visitor appearance choice MUST be remembered across reloads and page visits and MUST override the default.
- **FR-012**: The default appearance MUST apply consistently to every page, the top navigation, photo frames, dialogs, and the not-found page.
- **FR-013**: The appearance change MUST NOT cause a visible flash of the opposite theme during the first page load.
- **FR-014**: All existing albums, photo usage notices, copyright messaging, and image privacy protections MUST remain unchanged in scope.
- **FR-015**: Featured and album images MUST keep meaningful alternative text and remain usable with a keyboard or assistive technology.
- **FR-016**: Featured and album images MUST continue to use the approved published photo derivatives rather than original files.

### Key Entities

- **Featured Photograph**: The large portrait on the About Me page or the large photograph on the Hobbies page.
- **Album Photograph**: A photo shown in an album's film strip and enlarged dialog, with a recorded orientation.
- **Photo Orientation**: The intended upright direction of an album photograph, including photos that require a quarter-turn correction.
- **Appearance Preference**: A visitor's explicit choice between dark and light appearance, remembered for future visits.
- **Default Appearance**: The appearance shown when no explicit choice exists; dark mode is the intended default.
- **Visitor Session**: The context in which a first-time or returning visitor loads the site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of featured photographs on the About Me and Hobbies pages are fully visible and undistorted at 320 px, 768 px, and 1440 px viewport widths.
- **SC-002**: Zero featured photographs show an intentional vertical crop or zoom that hides the main subject in a review by the site owner.
- **SC-003**: 100% of photos with a recorded quarter-turn orientation appear upright in both the film strip and the enlarged dialog.
- **SC-004**: Zero album photographs appear sideways, upside down, stretched, or mirrored in a full album review.
- **SC-005**: 100% of previous/next and horizontal browsing actions move in the direction shown to the visitor.
- **SC-006**: 100% of fresh visits with no saved appearance preference open in dark mode, on every route.
- **SC-007**: 100% of explicit light or dark choices survive a reload and remain in effect across pages.
- **SC-008**: Zero visible flashes of the wrong appearance are observed during first load in a standard modern browser.
- **SC-009**: The site has no new horizontal overflow or layout shift caused by featured or album photos on phone, tablet, or desktop.
- **SC-010**: Existing automated checks for photo privacy, generated derivatives, and site routes continue to pass.

## Assumptions

- "Direction of the photos" means the intended orientation of album photos (for example, portrait versus landscape and photos needing a quarter-turn), together with the direction in which album navigation moves.
- Featured photographs should be shown whole rather than artistically cropped; preserving the full image is preferred over filling the available area.
- The existing portrait and hero photograph chosen for the site remain the featured photographs; this feature changes how they are framed, not which photos are selected.
- Dark mode is the default for every visitor without an explicit preference, regardless of the operating system's appearance setting.
- A visitor's explicit light or dark choice is stored in the browser and takes precedence over the default on later visits.
- Existing site routes, content, albums, photo privacy rules, and photo generation workflow remain in scope and must not regress.
- The current published web-sized photo derivatives are the correct sources; no new original photographs need to be added.
- The site continues to support current desktop and mobile browsers in the project's browser policy.
