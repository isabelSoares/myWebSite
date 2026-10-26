# Feature Specification: Launch Readiness Remediation

**Feature Branch**: `fix/launch-readiness-remediation`

**Created**: 2026-10-26

**Status**: Draft

**Input**: User description: "create a new branch based on main and solve the previous improvements"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Owner can prove the site is ready to announce (Priority: P1)

As the site owner, I want every launch verification step to be executed and its result recorded so that I can announce the website without relying on assumptions or stale checklists.

**Why this priority**: The site is already deployed and its automated gate passes, but several manual launch checks are still marked incomplete. A launch decision is only trustworthy when the evidence exists and is written down.

**Independent Test**: Review the remediation record and confirm that every formerly open launch task has an explicit pass or fail result, that the full release check was run against the production assistant endpoint, and that a single reviewer can tell whether the site is ready to announce.

**Acceptance Scenarios**:

1. **Given** the feature task list contains incomplete manual launch checks, **When** the remediation is complete, **Then** every such check is either marked complete with a recorded result or left open with a clearly stated blocker and owner.
2. **Given** the production assistant endpoint is available, **When** the full release check is run, **Then** the run reports zero failed checks and its result, date, and endpoint identity are recorded.
3. **Given** a manual check cannot be performed in the current environment, **When** the result is recorded, **Then** it is marked unverified rather than passed, and the consequence for the launch decision is stated.

---

### User Story 2 - Project records describe the website that actually shipped (Priority: P2)

As a maintainer, I want the specification, plan, and capacity records to match the current manifest, photo pipeline, and deployed site so that future changes are based on the truth rather than on outdated counts and architecture notes.

**Why this priority**: Several records still describe an earlier architecture and contradictory invariants. Incorrect project records cause future regressions and make the launch evidence untrustworthy even when the site itself is correct.

**Independent Test**: Compare the planning records against the current manifest and generated photo output and confirm that counts, rotation metadata, photo footprint, and image-delivery behavior agree with no contradictions.

**Acceptance Scenarios**:

1. **Given** the photo manifest contains two featured photos and 172 album photos, **When** the plan is reviewed, **Then** its scope and counts describe that composition accurately.
2. **Given** the album photos are stored with zero rotation metadata because their derivatives are already upright, **When** the data model is reviewed, **Then** its invariants describe the corrected metadata rather than claiming the manifest was unchanged.
3. **Given** the site publishes locally generated WebP derivatives, **When** the capacity report is reviewed, **Then** it describes that architecture and contains no reference to retired external photo hotlinking or full-size images used as thumbnails.
4. **Given** a reader moves between the README and the feature records, **When** they compare page and assistant names, **Then** the same concepts use the same names throughout.

---

### User Story 3 - Launch capacity and deep-link behavior are decided, not assumed (Priority: P3)

As the site owner, I want the site's traffic ceiling, photo-size headroom, and deep-link behavior to be measured or explicitly accepted so that a successful announcement does not expose an untested limit.

**Why this priority**: The remaining launch risks are operational rather than visual: the large-audience target is unproven, the generated photo budget has almost no headroom, and deep links return a not-found status while still rendering content. These should be known and decided before announcing.

**Independent Test**: Review the capacity and routing records and confirm that each risk has a measured result or an explicit accepted limitation, and that adding a normal new photo would not unexpectedly break the release gate.

**Acceptance Scenarios**:

1. **Given** a stated large-audience target, **When** the capacity record is reviewed, **Then** it shows either a measured result at that target or the highest concurrency actually tested, clearly labeled as unproven for the original target.
2. **Given** the generated photo footprint is close to its configured limit, **When** the release check runs, **Then** it reports the remaining headroom, and the project records state either a restored headroom margin or an approved limit change.
3. **Given** a visitor opens a main section through a direct address, **When** the response is inspected, **Then** the rendered section is correct and the project records state the observed status-code behavior and the launch decision about it.

---

### Edge Cases

- The production assistant endpoint is unavailable or returns an error during the release check: record a failure and do not mark the launch gate as passed.
- The owner cannot run an external large-audience test: record the highest tested concurrency and explicitly mark the original target unproven instead of inferring success.
- A manual photo review finds a genuinely wrong orientation or crop: record the failure and open a corrective change; do not mark the check as passed because the automated tests are green.
- The generated photo footprint is reduced or the configured limit is changed: update the README, photo policy, and release check so they state the same limit and margin.
- A deep link returns a not-found status while rendering the correct content: distinguish visible behavior from crawler and status-code behavior in the record.
- A record and the current code disagree: treat the shipped code and manifest as the source of truth and correct the record.
- A formerly open task is discovered to be unnecessary: mark it cancelled with the reason instead of silently deleting it.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST record a completed launch verification run, including the date, the verified assistant endpoint identity, the pass/fail status per check, and the final overall result.
- **FR-002**: Every manual launch check that is currently open MUST be executed and recorded as pass, fail, or unverified with a reason; none may remain silently unchecked.
- **FR-003**: The feature task list MUST reflect the actual state of the delivered work, with completed items marked complete and any remaining item accompanied by a stated blocker.
- **FR-004**: The data model MUST state accurately which photo metadata was corrected and which data, derivatives, albums, and ordering remained unchanged.
- **FR-005**: The implementation plan MUST describe the current photo composition and generated output counts consistently with the manifest.
- **FR-006**: The capacity report MUST describe the current image-delivery architecture and MUST NOT describe retired external photo hosting, full-size images used as thumbnails, or superseded footprint figures.
- **FR-007**: The capacity report MUST state the highest concurrency actually measured for the published site and MUST mark the larger target as proven only if it was measured.
- **FR-008**: The project records MUST document the observed direct-link status behavior for the main sections and state whether it is accepted for launch or scheduled for correction.
- **FR-009**: The release check MUST report the remaining generated-photo headroom against the configured limit so that the margin is visible before a new photo is added.
- **FR-010**: The project MUST establish at least 1 MB of generated-photo headroom below the configured footprint limit, or record an approved limit change with a stated rationale and matching documentation updates.
- **FR-011**: Any obsolete task artifact stored outside the feature specifications location MUST be relocated to the appropriate feature directory or removed.
- **FR-012**: Terminology for the experience section, the AI Photographer Assistant, and the hobbies section MUST be consistent across the README and feature records.
- **FR-013**: All existing automated gates — release verification, photo privacy and limits, site assets, tests, type checking, linting, and production build — MUST continue to pass after the remediation.
- **FR-014**: The remediation MUST NOT change the visitor-facing behavior of the site except for a documented, explicitly approved change to the photo budget or direct-link handling; no photo derivatives may be regenerated unless required by such a change.

### Source Findings Addressed

The remediation covers the findings from the prior specification analysis:

| Finding | Coverage |
|---------|----------|
| A1 — open launch tasks with delivered work | FR-001, FR-002, FR-003 |
| A2 — contradictory data-model invariant | FR-004 |
| A3 — stale capacity architecture | FR-006 |
| A4 — unproven large-audience target | FR-007 |
| A5 — deep links return a not-found status | FR-008 |
| A6 — plan photo count drift | FR-005 |
| A7 — photo budget headroom | FR-009, FR-010 |
| A8 — unfilled project constitution | Out of scope; requires a separate governance decision |
| A9 — stray root task artifact | FR-011 |
| A10 — terminology drift | FR-012 |

### Key Entities

- **Launch Verification Record**: The dated result of the release check and the manual launch checks, including the endpoint verified and any unverified items.
- **Requirement-to-Task Trace**: The mapping between recorded launch requirements and the tasks that prove them complete.
- **Capacity Record**: The measured published-site concurrency, error rate, latency, and the statement of what remains unproven.
- **Photo Footprint Budget**: The configured generated-photo limit, the current footprint, and the remaining headroom.
- **Direct-Link Behavior Record**: The observed response status and visible content for each main section address, plus the launch decision.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of formerly open launch tasks have a recorded pass, fail, unverified, or cancelled outcome with a reason.
- **SC-002**: A full release verification run reports zero failed checks and its result is recorded in the project.
- **SC-003**: Zero contradictions remain between the project records and the current manifest for featured-photo count, album-photo count, rotation metadata, and generated-derivative count.
- **SC-004**: The capacity report contains zero references to retired external photo hotlinking or full-size images used as thumbnails, and its footprint figure matches the current generated output within 1 MB.
- **SC-005**: The capacity record either proves the large-audience target with an error rate below 1% or clearly states the highest tested concurrency and that the original target remains unproven.
- **SC-006**: The direct-link behavior and its launch decision are recorded for all main section addresses.
- **SC-007**: The generated photo footprint has at least 1 MB of headroom below the configured limit, or an approved limit change is documented together with the updated release check output.
- **SC-008**: Zero obsolete task artifacts remain outside the feature specifications location.
- **SC-009**: All automated gates pass in a single run after the remediation.
- **SC-010**: Zero unintended visitor-facing changes are introduced, evidenced by the automated test suite and a review of the changed files.

## Assumptions

- The site remains a static website published through its existing host with locally generated web-sized image derivatives; no new runtime service or photo host is introduced.
- The production assistant endpoint remains the currently deployed endpoint, and its availability is outside the site's control.
- A full external large-audience load test may not be feasible before launch; in that case, recording the tested ceiling and the unproven target satisfies the requirement.
- The 1,000-simultaneous-visitor figure is a launch stress target, not a permanent capacity commitment.
- Direct main-section links may continue to return a not-found status on the current host; accepting that limitation is a valid decision if it is recorded.
- Restoring photo headroom may be achieved by reducing the generated footprint or by an explicitly approved limit change; either outcome is acceptable if the documentation and release check agree.
- Ratifying or replacing the project constitution is a separate governance action and is outside this remediation.
- No new photos, albums, or visitor-facing features are added by this remediation.

## Dependencies

- The repository's existing release verification, photo validation, and site-asset commands remain the required automated gates.
- The deployed assistant endpoint must be reachable to complete the release verification record.
- The current deployed site must be reachable to record direct-link behavior.
