# Feature Specification: Add AgentFlow AI Project to Portfolio

**Feature Branch**: `010-agentflow-ai-project`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Create a new branch based on main branch where you integrate the repository 'agentFlow-ai' on Repos folder into mywebsite. Analyze how you integrate the cv-detect-people-my-gallery project and integrate agentFlow-ai project on the same way."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover AgentFlow AI on the Projects page (Priority: P1)

As a visitor exploring my portfolio, I want to see AgentFlow AI presented alongside my other personal projects so that I can understand what the project is and recognize it as part of my body of work.

**Why this priority**: The Projects page is the single destination for personal projects; without an entry there, the project is not part of the portfolio experience at all.

**Independent Test**: Open the Projects page and verify that an AgentFlow AI project card appears in the projects grid with a distinct heading, a short summary, a technology tag line, and a view-project action, matching the treatment of the existing CV Photo AI entry.

**Acceptance Scenarios**:

1. **Given** the Projects page is open, **When** the visitor scans the projects grid, **Then** an AgentFlow AI card is displayed with a kicker, title, summary, and technology tags in the same visual structure as the existing CV Photo AI card.
2. **Given** the AgentFlow AI card is displayed, **When** the visitor compares it with the CV Photo AI card, **Then** both use the same layout, typography, spacing, and responsive behavior.
3. **Given** the visitor is on the homepage, **When** the homepage content is displayed, **Then** no AgentFlow AI project card appears there, consistent with the other personal project cards.

---

### User Story 2 - Open the AgentFlow AI repository safely (Priority: P1)

As a visitor who is interested in AgentFlow AI, I want to open its source repository from the card so that I can review the implementation details and project documentation.

**Why this priority**: The repository link is the only action on the card and the primary reason to include the project; a broken or unsafe link undermines the whole entry.

**Independent Test**: Activate the AgentFlow AI card's view-project action from the Projects page and verify that the correct public repository opens in a new tab, that the current page is not replaced, and that the action is announced accessibly.

**Acceptance Scenarios**:

1. **Given** the AgentFlow AI card is displayed, **When** the visitor activates its view-project action, **Then** the public AgentFlow AI repository opens in a new browser tab.
2. **Given** the visitor uses a keyboard or screen reader, **When** they reach the view-project action, **Then** focus is visible and the action is announced as opening in a new tab.
3. **Given** the visitor activates the action, **When** the new tab opens, **Then** the portfolio page remains loaded and unchanged in the original tab.

---

### User Story 3 - Trust that the portfolio stays accurate and verifiable (Priority: P2)

As the site owner, I want the new project entry and its external repository address to be covered by the existing verification process so that a broken link or missing entry is caught before publication.

**Why this priority**: The portfolio is published automatically; verification keeps the new project from silently regressing during future changes.

**Independent Test**: Run the existing project verification and confirm that the AgentFlow AI repository address is checked and that the Projects page tests assert the new card and link.

**Acceptance Scenarios**:

1. **Given** the project verification runs, **When** it checks the published external destinations, **Then** the AgentFlow AI repository address is included in the checked links.
2. **Given** the automated interface tests run, **When** the Projects page is rendered, **Then** the tests assert that the AgentFlow AI card and its repository link are present with the expected destination and safe external-link attributes.
3. **Given** the AgentFlow AI repository address becomes unavailable or malformed, **When** verification runs, **Then** the mismatch is reported rather than silently passing.

---

### Edge Cases

- The projects grid contains an odd number of cards because of the new entry; the layout remains balanced and readable at desktop and mobile widths.
- The visitor views the page in either the light or dark appearance; the card text, tags, and action remain legible and consistent with the existing cards.
- The visitor uses a narrow viewport; the card reflows to a single column without horizontal page overflow.
- The visitor navigates with only a keyboard; the action receives a visible focus treatment and the project card content is read in a logical order.
- The repository address is unreachable, private, renamed, or returns an error; the card still renders and the verification process surfaces the problem.
- An assistive technology announces the link; the new-tab behavior is communicated without relying on visual cues alone.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Projects page MUST display an AgentFlow AI project entry alongside the existing personal projects.
- **FR-002**: The AgentFlow AI entry MUST present a project kicker, a title, a short plain-language summary, and a technology tag line.
- **FR-003**: The AgentFlow AI entry MUST use the same visual structure, typography, spacing, card sizing, and responsive behavior as the existing CV Photo AI entry.
- **FR-004**: The AgentFlow AI entry MUST include a view-project action that opens the public AgentFlow AI source repository.
- **FR-005**: The view-project action MUST open in a new tab and MUST preserve the current portfolio tab.
- **FR-006**: The view-project action MUST use safe external-link behavior and MUST NOT expose the portfolio page to the opened repository.
- **FR-007**: The view-project action MUST provide an accessible name that identifies the project and MUST communicate that it opens in a new tab.
- **FR-008**: The AgentFlow AI entry MUST remain legible and visually consistent in both the light and dark appearances.
- **FR-009**: The AgentFlow AI entry MUST reflow without horizontal page overflow at supported narrow viewport widths.
- **FR-010**: The AgentFlow AI entry MUST NOT appear on the homepage, matching the behavior of the other personal project entries.
- **FR-011**: The existing CV Photo AI entry, the AI Photographer Assistant section, and all other Projects page content MUST remain present and unchanged in behavior.
- **FR-012**: The AgentFlow AI source repository address MUST be included in the existing external-link verification so that an unreachable or incorrect address is reported.
- **FR-013**: Automated interface tests MUST assert the presence of the AgentFlow AI entry, its repository destination, its safe external-link attributes, and its new-tab announcement.
- **FR-014**: The AgentFlow AI entry MUST use the project's actual public repository address rather than a placeholder or local path.

### Key Entities *(include if data involved)*

- **Project entry**: A single personal project shown on the Projects page, described by a category kicker, title, short summary, technology tags, and a destination for more information.
- **Repository destination**: The public address a visitor reaches through the project entry's view-project action, including new-tab and safe-navigation behavior.
- **Verification record**: The set of externally checked project addresses used by the publication process to detect broken or incorrect links.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The Projects page displays two personal project cards (CV Photo AI and AgentFlow AI) with identical structural treatment, and the homepage displays zero project cards.
- **SC-002**: 100% of the AgentFlow AI card's required content — kicker, title, summary, technology tags, and view-project action — is visible on first render without interaction.
- **SC-003**: In 10 out of 10 attempts, activating the AgentFlow AI view-project action opens the correct public repository in a new tab while the portfolio tab remains unchanged.
- **SC-004**: The AgentFlow AI card and action pass the same accessibility checks as the existing project cards, including keyboard focus, accessible naming, and new-tab announcement.
- **SC-005**: The Projects page has no horizontal overflow at the site's supported narrow viewport width, and the AgentFlow AI card remains readable in both appearances.
- **SC-006**: The publication verification run checks the AgentFlow AI repository address and fails visibly when it is incorrect or unreachable.

## Assumptions

- The integration follows the existing CV Photo AI pattern exactly: a project card on the Projects page plus a link to the public source repository. The project is not embedded as a live interactive demo, and no service, backend, or runtime endpoint is added to the portfolio.
- The public repository address is `https://github.com/isabelSoares/agentflow-ai`.
- The project title is "AgentFlow AI"; the category kicker identifies it as an AI/agent engineering project; the summary describes secure multi-agent patient support; and the technology tags reflect the technologies named in the project's documentation (Python, FastAPI, LangGraph, React).
- The portfolio remains a static published site; the new entry introduces no new runtime dependency, storage, authentication, or network integration beyond the outbound repository link.
- The existing publication verification and interface test approach is reused rather than replaced.
- Visitors have working internet access when they choose to open the repository link.
- Language, tone, and content conventions follow the existing Projects page copy.
