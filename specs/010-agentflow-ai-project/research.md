# Research: Add AgentFlow AI Project to Portfolio

## Decision 1: Reuse the CV Photo AI project-card pattern

**Decision**: Add AgentFlow AI as a second item in the existing `moreProjects` collection in `ts-app/src/components/personal-projects/PersonalProjects.tsx`, rendered by the current card markup.

**Rationale**: The specification explicitly asks for the same integration used by `cv-detect-people-my-gallery`. The CV Photo AI entry is a data-driven card containing a kicker, title, summary, tags, and a repository link. The existing collection already supports additional items without markup or style changes, so the change is small, consistent, and low-risk.

**Alternatives considered**:
- Embed the AgentFlow AI frontend as an interactive demo. Rejected because the user asked for the CV Photo AI treatment, the portfolio is a static site with no application backend, and a live demo would require hosting the separate frontend and its API or relying on its offline demo mode.
- Add a dedicated AgentFlow AI section above the project grid. Rejected because it would diverge from the CV Photo AI pattern and duplicate existing assistant-section styling for no confirmed user need.
- Link to a deployed AgentFlow AI service instead of the repository. Rejected because no stable public deployment is identified and the spec requires the public source repository.

## Decision 2: Card content and project metadata

**Decision**: Use the title `AgentFlow AI`, an AI/agent-engineering kicker, a plain-language summary of secure multi-agent patient support, and the technology tag line `Python · FastAPI · LangGraph · React`, linking to `https://github.com/isabelSoares/agentflow-ai`.

**Rationale**: The AgentFlow AI repository describes a Python, FastAPI, LangGraph, React, and TypeScript platform for secure multi-agent patient support with deterministic identity verification, classification, and routing. The proposed content mirrors that description and follows the existing CV card's concise format.

**Alternatives considered**:
- Use the full repository tagline as the title. Rejected because existing cards use short titles (`CV Photo AI`) and put the longer explanation in the summary.
- Omit technology tags. Rejected because every existing project card presents a tag line and the spec requires one.

## Decision 3: External link behavior

**Decision**: Render the link with `target="_blank"`, `rel="noopener noreferrer"`, and the existing visually hidden “(opens in a new tab)” announcement.

**Rationale**: This matches the current CV Photo AI and AI Photographer Assistant links, preserves the portfolio tab, prevents the opened page from accessing the portfolio window, and communicates new-tab behavior to assistive technology.

**Alternatives considered**:
- Open the repository in the same tab. Rejected because existing project links open in a new tab and the spec requires preserving the current tab.
- Use `rel="noreferrer"` alone. Rejected because `noopener` is the explicit safety control the existing links use.

## Decision 4: External-link verification

**Decision**: Add `https://github.com/isabelSoares/agentflow-ai` to the `EXTERNAL_URLS` list in `ts-app/scripts/verify-release.js`.

**Rationale**: `verify-release.js` already treats `EXTERNAL_URLS` as the canonical set of published outbound destinations and probes them when `--online` is requested. Registering the new repository address keeps release verification aligned with the page content.

**Alternatives considered**:
- Add a separate verification script. Rejected because it duplicates existing capability and adds maintenance overhead.
- Skip verification. Rejected because the spec requires the repository address to be covered by the publication check.

## Decision 5: Test strategy

**Decision**: Extend the existing Projects page test in `ts-app/src/App.test.tsx` to locate the AgentFlow AI link by its destination and assert the card content, destination, `target`, and `rel`. Keep the homepage test that asserts no project cards appear.

**Rationale**: The current test already finds project links with `getAllByRole` and filters by repository destination, which is robust to the number of cards. Extending it preserves the existing test style and confirms the new entry without a new test file.

**Alternatives considered**:
- Add a dedicated AgentFlow AI test file. Rejected because the behavior is identical to the CV card and the existing Projects test is the natural home.
- Assert only that two “View project” links exist. Rejected because it would not verify the correct destination or safe-link attributes.

## Decision 6: Layout, theme, and responsive behavior

**Decision**: Rely on the existing `.project-grid`, `.project-card`, and theme token styles without CSS changes; verify the two-card layout and single-column mobile reflow during validation.

**Rationale**: The grid already uses `repeat(2, minmax(0, 1fr))` at wide widths and collapses to one column below 760 px. All card colors come from existing semantic tokens, so both appearances are inherited automatically.

**Alternatives considered**:
- Add AgentFlow-specific styles. Rejected because the spec requires the same visual treatment and the existing classes already deliver it.
- Change the grid to fit more than two cards. Rejected because two cards already fit the current grid and no additional cards are in scope.
