# Feature Specification: Fix Photo Upload Connectivity

**Feature Branch**: `bugfix/review-photo`

**Created**: 2026-10-12

**Status**: Draft

**Input**: User description: "be a full stack developer. when user upload a photo, it takes so much times then it failed because went to onrender, that is not exist anymore because i used cloudflare. I have this error: Access to fetch at 'https://ai-photographer-assistant.onrender.com/' from origin 'https://isabelsoares.github.io' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. ai-photographer-assistant.onrender.com/:1 Failed to load resource: net::ERR_FAILED on console, and for user \"Failed to fetch\" message appear"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Get photo guidance successfully (Priority: P1)

As a visitor, I want my selected photo to reach the active photo-analysis service and receive guidance so that I can use the assistant from the published portfolio.

**Why this priority**: Photo analysis is the primary value of the assistant; a retired service address currently prevents visitors from completing it.

**Independent Test**: From the published portfolio, submit a valid supported photo while the active analysis service is available and verify that a result is shown without a browser-origin access failure.

**Acceptance Scenarios**:

1. **Given** the visitor has selected a supported photo within the size limit and the analysis service is available, **When** the visitor starts a review, **Then** the photo is sent to the active analysis service and its guidance is displayed.
2. **Given** a review is submitted from the published portfolio, **When** the request is handled by the active service, **Then** the visitor receives the response without being blocked by cross-site access restrictions.
3. **Given** a photo review is in progress, **When** the service is processing the photo, **Then** the visitor sees that the request is still in progress.
4. **Given** a review session has ended, **When** the visitor starts a later session, **Then** the prior photo and analysis result are not retained for that session.

---

### User Story 2 - Understand and recover from a failed review (Priority: P2)

As a visitor, I want a clear explanation and a way to retry when photo analysis cannot complete so that I am not left with a generic network error or an indefinite wait.

**Why this priority**: Service interruptions and slow responses should not leave visitors uncertain about whether their photo was received or what to do next.

**Independent Test**: Submit a valid photo while the analysis service is unavailable or deliberately delayed; verify that the visitor receives a clear outcome within the request time limit and can retry.

**Acceptance Scenarios**:

1. **Given** the analysis service is unavailable or rejects the review, **When** the visitor submits a valid photo, **Then** the upload area displays a plain-language error and an available recovery action.
2. **Given** the analysis service does not complete the review before the allowed wait expires, **When** the request times out, **Then** the visitor sees a timeout message and can retry without refreshing the page.
3. **Given** a review fails, **When** the visitor retries with a valid photo, **Then** the assistant starts a new review and reports its result or a new actionable error.
4. **Given** the visitor selects an unsupported photo or a photo larger than 10 MB, **When** the selection is checked, **Then** the photo is rejected before submission and the visitor sees a clear validation message.

### Edge Cases

- The analysis service is unavailable, responds with an error, or returns an unreadable response.
- A review takes longer than the allowed wait time.
- The visitor loses network connectivity while a review is in progress.
- A visitor selects an unsupported file type or a photo larger than the existing size limit.
- A response is delayed after the visitor has already received a timeout message.
- The active service refuses requests from the published portfolio origin.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The photo review MUST use the active photo-analysis service rather than the retired service address.
- **FR-002**: Visitors MUST be able to submit a supported photo for analysis from the published portfolio and receive a response they can access in their browser.
- **FR-003**: The assistant MUST show a visible in-progress state after a visitor starts a photo review.
- **FR-004**: Every submitted review MUST reach either a completed result or a visitor-visible failure state within 30 seconds.
- **FR-005**: If a review cannot complete, the assistant MUST replace generic network-failure wording with a plain-language explanation and a recovery action.
- **FR-006**: After a failed review, visitors MUST be able to retry without reloading the page.
- **FR-007**: The assistant MUST continue to accept JPG, PNG, and WEBP photos up to 10 MB and reject unsupported or oversized photos before submission.
- **FR-008**: Photo handling MUST retain the existing temporary-analysis behavior and MUST NOT store uploaded photos or analysis results for later use.

### Key Entities *(include if feature involves data)*

- **Photo review request**: A visitor-submitted supported photo and the request to analyze it; exists only for the active review.
- **Photo review outcome**: The guidance returned for a completed request or a user-readable failure state, including whether the visitor can retry.
- **Review status**: The visitor-visible state of a review: ready, in progress, completed, failed, or timed out.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 19 out of 20 valid photo reviews complete and show guidance within 30 seconds when the analysis service is available and the visitor has a working internet connection.
- **SC-002**: In 20 consecutive verification submissions from the published portfolio, no visitor is blocked from completing a supported review because of cross-site access restrictions.
- **SC-003**: In all simulated unavailable-service, rejected-request, and timeout cases, visitors receive a clear result or actionable error within 30 seconds.
- **SC-004**: Visitors can retry every recoverable failed review without refreshing the page or reselecting a still-valid photo.
- **SC-005**: No submitted photo or analysis result is retained after its review session ends.

## Assumptions

- The photo-analysis service has already been moved to Cloudflare and remains the intended service for this assistant.
- The deployed service address will be supplied through the existing deployment configuration; the feature does not require hard-coding a deployment-specific address in user-facing requirements.
- The published portfolio origin is `https://isabelsoares.github.io`; local development origins may also be permitted for development and testing.
- A 30-second maximum wait is an acceptable default before presenting a timeout and retry option.
- Existing photo formats, 10 MB limit, analysis result content, and privacy promise remain in effect.
- The current repository contains the portfolio frontend but not the Cloudflare service source; service-side access behavior is a dependency of the end-to-end outcome.
