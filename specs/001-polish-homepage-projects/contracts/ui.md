# Visitor-Facing UI Contract: Polish Homepage & Projects

This contract describes browser-visible behavior for the existing site routes. It does not introduce a new API or alter the photo-analysis worker interface.

## Homepage (`/`)

- Homepage action buttons have a white resting background and legible text.
- Pointer hover uses a clearly darker theme teal in both themes; hover text uses a contrasting theme foreground. Keyboard focus and activation use light teal, with a visible focus outline.
- The personal-projects listing and its project cards do not appear on this route.
- TopBar navigation indicates the current route with a light-teal selected state. Unselected items use rounded, clearly darker-teal hover states with high-contrast text; hovering the selected item does not replace its selected color.

## Projects (`/projects`)

- Introductory kicker, title, lead text, section headings, project details, and actions are left-aligned.
- The intro occupies the available content width within normal page gutters.
- A rounded upload box is visually separate from the Projects page description and groups “No file chosen,” a “Choose photo” button, “Click or drag a photo here,” “JPG, PNG, or WEBP. Max 10 MB,” “Review photo,” and the privacy statement.
- The file-picker button and drag-and-drop surface select photos using the same validation. A valid choice shows its name or preview and enables review; an invalid or oversized file shows an error and leaves review disabled.
- Accepted images remain JPG/JPEG, PNG, and WEBP up to 10 MB. Invalid selections provide visible feedback.
- Existing analysis status, results, and privacy behavior remain available and unchanged.

## Hobbies (`/hobbies`)

- Every photo-strip instruction reads “Scroll to explore” followed by a right-pointing arrow cue.
- Each strip remains horizontally scrollable and each frame remains operable as an image-opening control.

## Shared accessibility and responsive behavior

- Interactive controls remain keyboard reachable and have a visible focus treatment.
- Text and control states remain legible in light and dark themes.
- At narrow viewports, navigation, page content, and upload controls remain usable without page-level horizontal overflow. Intentional photo-strip overflow is allowed.
