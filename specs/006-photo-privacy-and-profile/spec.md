# Feature Specification: Photo Privacy, Build Health, and Repository Profile

**Feature Branch**: `006-photo-privacy-and-profile`

**Created**: 2026-10-23

**Status**: Draft

**Input**: User description: "how can I protected my photos for not anybody download them, since github repo is public? Give a better description of my repo too." Additional clarification: resolve the TypeScript deprecation warnings for `target=ES5` and `moduleResolution=node10`, using a modern browser target and silencing the remaining deprecation for the current toolchain.

## Clarifications

### Session 2026-10-23

- Q: Should the TypeScript compiler deprecation fix be included in this photo-privacy feature or handled as a separate maintenance change? → A: Include in this feature.
- Q: How should the deprecated TypeScript compiler options be resolved? → A: Modernize to ES2020 and add `ignoreDeprecations: "6.0"` for the remaining `moduleResolution` node10 warning.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Keep original photographs out of the public repository (Priority: P1)

As the site owner, I want full-resolution originals to live outside the public repository so that visitors cannot bulk-download my photographs just by browsing the source code.

**Why this priority**: The repository is public. Any file committed to it can be cloned, indexed, or downloaded without visiting the site. Removing originals from the public source is the only reliable way to stop the repository itself from being the source of leaks.

**Independent Test**: Inspect the public repository and the published site for original photo files and direct links to them; confirm that the gallery still displays every album using approved web-sized images.

**Acceptance Scenarios**:

1. **Given** a public repository visitor, **When** they browse the repository file tree or clone it, **Then** they cannot obtain the full-resolution originals.
2. **Given** a portfolio visitor, **When** they open any album, **Then** the album displays approved web-sized photographs and remains fully usable.
3. **Given** a visitor copies a published image address, **When** they open it later, **Then** it does not expose a permanent path to the original file.
4. **Given** the owner adds a new photograph, **When** it is published, **Then** only the approved derived version becomes publicly available and the original stays private.

---

### User Story 2 - Deter casual downloading without breaking the gallery (Priority: P2)

As the site owner, I want casual attempts to save or reuse my photographs to be discouraged while keeping the browsing experience pleasant for normal visitors.

**Why this priority**: Determined visitors can always take a screenshot or capture a network response. The realistic goal is to remove easy shortcuts, protect the originals, and make reuse less attractive, not to promise impossible control.

**Independent Test**: Use the gallery on desktop and mobile, attempt common casual download actions, and confirm that normal navigation, album dialogs, and accessibility still work.

**Acceptance Scenarios**:

1. **Given** a visitor views a gallery image, **When** they use common casual save or drag actions, **Then** the site discourages the action without blocking legitimate browsing.
2. **Given** a visitor uses a keyboard or assistive technology, **When** they navigate the gallery, **Then** all controls remain reachable and usable.
3. **Given** a visitor views an image, **When** they look for usage information, **Then** a clear copyright and permission notice is available.
4. **Given** a visitor opens the photo assistant, **When** they upload a photo, **Then** the privacy behavior described on the site remains accurate.

---

### User Story 3 - Compile with current TypeScript settings without deprecation warnings (Priority: P2)

As the site owner, I want the project to use a modern compilation target and to be free of deprecated compiler-option warnings so that it keeps building cleanly as the TypeScript toolchain advances.

**Why this priority**: The current configuration targets ES5 and an old module-resolution mode that newer TypeScript versions will stop supporting. Cleaning it up now prevents the build from breaking later and matches the modern browsers the portfolio serves.

**Independent Test**: Run the project's type check and production build with the configured compiler; confirm that neither reports the ES5-target or node10-module-resolution deprecation warnings and that all existing tests still pass.

**Acceptance Scenarios**:

1. **Given** a developer runs the project type check, **When** compilation completes, **Then** no deprecation warning is reported for the compilation target or module-resolution mode.
2. **Given** the compiler target is ES2020, **When** the production build is created, **Then** the site still runs correctly on the browsers listed in the project's browser support policy.
3. **Given** the current TypeScript version cannot use the newer module-resolution mode, **When** the remaining deprecation is silenced, **Then** the reason and the future migration are documented.
4. **Given** a newer TypeScript version is adopted later, **When** the configuration is reviewed, **Then** the temporary deprecation suppression is removed or replaced with the supported mode.

---

### User Story 4 - Understand the repository at a glance (Priority: P3)

As a visitor, recruiter, or collaborator, I want the repository description and README to explain what the project is, how it is built, and how it is published so that I can understand it quickly.

**Why this priority**: A clear repository profile improves discoverability and credibility. It is independent of the photo changes and can ship separately.

**Independent Test**: Open the repository page and README; confirm that the purpose, live site, main sections, technology summary, structure, local setup, deployment, and photo-usage policy are understandable without reading the source code.

**Acceptance Scenarios**:

1. **Given** a visitor opens the repository, **When** they read the description and README, **Then** they can identify the project as Isabel's personal portfolio and find the live site.
2. **Given** a developer opens the repository, **When** they read the setup section, **Then** they can run, test, and build the project from a clean checkout.
3. **Given** a visitor wants to reuse a photograph, **When** they read the README, **Then** they find a clear statement about ownership and how to request permission.
4. **Given** a visitor scans the repository topics or summary, **When** they compare it with the site content, **Then** the description accurately reflects the project.

---

### Edge Cases

- A visitor uses browser developer tools, screen capture, or a screenshot to copy a displayed image.
- A visitor shares a direct image address, or a cached copy remains after the owner removes the image.
- A search engine indexes an image or a repository page.
- An old commit still contains a previously committed original.
- The private photo store is unavailable or a temporary access link expires.
- A visitor uses an older browser, a keyboard, or a screen reader.
- The owner needs to replace or revoke access to a photograph after publication.
- The repository description or README becomes outdated after a site change.
- A newer editor or CI runner uses a different TypeScript version than the project.
- A future TypeScript release removes support for a temporarily silenced option.
- The compilation target change affects browser support or build output.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Full-resolution original photographs MUST NOT be stored in the public repository or included in the published site output.
- **FR-002**: The public gallery MUST display only approved web-sized derivative images with unnecessary personal metadata removed.
- **FR-003**: Original files MUST remain in private storage that is accessible only to the owner and authorized publishing processes.
- **FR-004**: Published image addresses MUST NOT provide a permanent, directly reusable path to the original file.
- **FR-005**: The site MUST continue to display every existing album and support opening, navigating, and closing album photos.
- **FR-006**: The owner MUST be able to replace or revoke public access to a photograph without removing the entire site.
- **FR-007**: The site MUST discourage common casual saving actions on gallery images without blocking navigation, keyboard use, or assistive technology.
- **FR-008**: The site MUST provide a visible copyright and permission notice for photographs.
- **FR-009**: The site MUST keep the photo assistant's privacy statement accurate and MUST NOT claim that casual deterrence prevents all copying.
- **FR-010**: The repository MUST have a concise public description that identifies it as Isabel Soares's personal portfolio and states its purpose.
- **FR-011**: The repository MUST include relevant topics and a link to the published site.
- **FR-012**: The README MUST explain the project purpose, live site, main sections, technology summary, repository structure, local setup, verification commands, deployment, and photo-usage policy.
- **FR-013**: The README MUST clearly state that photographs are owned by Isabel Soares and require permission for reuse.
- **FR-014**: The release verification MUST fail if an original photograph or a direct original-file link is found in the public repository or build output.
- **FR-015**: The README and repository description MUST be updated together when the published site address or project scope changes.
- **FR-016**: The project MUST compile without deprecation warnings for the configured compilation target.
- **FR-017**: The compilation target MUST be ES2020 so that the build reflects the modern browsers supported by the portfolio.
- **FR-018**: The deprecated module-resolution mode MUST be explicitly suppressed for the current toolchain so that compilation is quiet without hiding the future migration.
- **FR-019**: The suppression and the planned migration to a supported module-resolution mode MUST be documented for the owner and future maintainers.
- **FR-020**: The release verification MUST fail when TypeScript compilation fails and MUST surface compiler deprecation warnings to the owner.
- **FR-021**: Modernizing the compiler settings MUST NOT change the site's visible behavior or break existing tests.

### Key Entities

- **Original Photograph**: The full-resolution source file, including any personal metadata; private and not published directly.
- **Published Derivative**: The web-sized, metadata-stripped image shown in albums; approved for public display.
- **Album**: A named collection of photographs shown on the Hobbies page.
- **Access Link**: A public image address that is revocable or time-limited and does not expose an original file.
- **Repository Profile**: The public description, topics, live-site link, README overview, and photo-usage policy.
- **Usage Notice**: The copyright and permission statement shown to visitors and documented in the repository.
- **Compiler Configuration**: The TypeScript target, library set, module-resolution mode, deprecation-suppression setting, and the documented migration follow-up.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero full-resolution original photographs are present in the public repository or published build output.
- **SC-002**: 100% of gallery images displayed on the public site are approved web-sized derivatives.
- **SC-003**: Every existing album remains viewable, with no regression in opening, navigating, or closing photographs.
- **SC-004**: Public image addresses do not resolve to a permanent original file for 100% of sampled photographs.
- **SC-005**: 100% of published derivatives have location metadata removed.
- **SC-006**: A reviewer can find the live site, project purpose, setup instructions, deployment instructions, and photo-usage policy in the repository within 2 minutes.
- **SC-007**: The repository description and README accurately describe the project in a review by the owner.
- **SC-008**: The release verification reports a failure when an original photo or direct original link is present in a test fixture.
- **SC-009**: The gallery remains usable on desktop and mobile, and all controls remain keyboard-accessible.
- **SC-010**: TypeScript compilation reports zero deprecation warnings for the compilation target and module-resolution mode in the configured toolchain.
- **SC-011**: The compilation target is ES2020, and the production build continues to pass all existing tests.
- **SC-012**: The release verification fails on any TypeScript compilation error and reports any deprecation warning it detects.
- **SC-013**: The module-resolution migration follow-up is documented clearly enough for a future maintainer to act on it.

## Assumptions

- The gallery should remain publicly viewable. The goal is to prevent bulk or original-file downloading from the public repository, not to make the portfolio private.
- Absolute prevention is impossible: a determined visitor can screenshot or capture any image displayed in a browser. The specification treats casual deterrence and original-file protection as the realistic outcome.
- The owner can use private storage for originals; a small hosting cost or account requirement is acceptable.
- Existing albums and the photo assistant remain in scope; no new social or e-commerce features are introduced.
- Public derivatives may be watermarked or visibly attributed, but the final visual treatment should remain suitable for a portfolio.
- The repository is public on GitHub, and its description, topics, and README are part of the public presentation.
- The current live site address remains the canonical published address.
- Previously committed originals may remain in git history; a separate history-rewrite decision is out of scope unless the owner explicitly requests it.
- The project currently uses TypeScript 4.9.5; the newer module-resolution mode recommended by current TypeScript releases is not available until the TypeScript version is upgraded, so the old mode remains temporarily with deprecation suppression.
- ES2020 is an acceptable compilation target because the portfolio serves modern browsers and the existing build pipeline handles browser compatibility.
- Silencing the module-resolution deprecation is temporary; replacing it with a supported mode is a documented follow-up, not a permanent solution.
- The compiler configuration change must not alter the site's visible behavior, routes, or tests.
