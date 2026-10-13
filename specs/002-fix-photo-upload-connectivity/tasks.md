---
description: "Task list for restoring Cloudflare photo-review connectivity"
---

# Tasks: Fix Photo Upload Connectivity

**Input**: Design documents from `/specs/002-fix-photo-upload-connectivity/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/photo-review-service.md, quickstart.md

**Organization**: Tasks are grouped by user story so each visitor outcome can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies).
- **[Story]**: User story label from `spec.md`.
- All task descriptions include the relevant file path.

## Phase 1: Setup

The portfolio application and companion Cloudflare Worker are already initialized; no project setup changes are required.

## Phase 2: Foundational

No shared blocking infrastructure is needed. The two stories use the existing URL configuration and photo-review request contract.

## Phase 3: User Story 1 - Get photo guidance successfully (Priority: P1) 🎯 MVP

**Goal**: Send photo reviews to the active Cloudflare service and allow the published portfolio origin through the Worker CORS contract.

**Independent Test**: With the configured active Cloudflare endpoint, submit a supported photo from the portfolio and verify a guidance response is readable without a browser CORS error; verify the retired Render host fails URL validation.

### Implementation for User Story 1

- [x] T001 [P] [US1] Update `ts-app/scripts/validate-assistant-url.test.js` to reject the retired Render host and accept a valid Cloudflare HTTPS endpoint.
- [x] T002 [US1] Update `ts-app/scripts/validate-assistant-url.js` to reject the retired `onrender.com` host while preserving validation of the configured public HTTPS endpoint.
- [x] T003 [US1] Update `ts-app/src/components/about-me/AboutMe.tsx` and `ts-app/src/App.test.tsx` so the assistant invitation routes to the embedded Projects experience instead of opening the review API URL as a standalone app.
- [x] T004 [P] [US1] Update `worker/src/index.ts` to answer preflight before body parsing, allow only the configured portfolio origin, include CORS headers on successful and error responses, add `Vary: Origin`, and remove the wildcard fallback.

**Checkpoint**: A Cloudflare endpoint passes configuration validation, the retired Render endpoint fails, and the Worker CORS policy permits the published portfolio origin.

## Phase 4: User Story 2 - Understand and recover from a failed review (Priority: P2)

**Goal**: Show a useful outcome within 30 seconds and let visitors retry recoverable failures without reselecting a valid photo.

**Independent Test**: Submit a valid photo against a successful, failing, invalid-response, and delayed endpoint; verify progress, readable results or plain-language errors, timeout handling, and explicit retry.

### Tests for User Story 2

- [x] T005 [P] [US2] Add component tests in `ts-app/src/components/personal-projects/PhotoAssistant.test.tsx` for successful review, network/HTTP/invalid-response errors, timeout, and retry while retaining the selected photo.

### Implementation for User Story 2

- [x] T006 [US2] Update `ts-app/src/components/personal-projects/PhotoAssistant.tsx` to enforce the 30-second end-to-end deadline, abort or ignore late work, validate response shape, and replace raw network errors with actionable messages.

**Checkpoint**: Every review ends in a result or recoverable visitor-facing failure within 30 seconds, and a valid selected photo can be retried.

## Phase 5: Polish & Cross-Cutting Concerns

- [x] T007 [P] Update `README.md` to state that `AI_ASSISTANT_URL` must contain the active public Cloudflare review endpoint and that the retired Render host is unsupported.
- [x] T008 Run the focused URL validation, portfolio component tests, and production build in `ts-app/`; run `npm run typecheck` in `worker/`.
- [ ] T009 After Cloudflare public endpoint activation, replace the retired Render value in the GitHub repository variable `AI_ASSISTANT_URL` and complete the published-origin preflight and photo-review checks in `specs/002-fix-photo-upload-connectivity/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Existing projects; no tasks.
- **Foundational (Phase 2)**: No shared prerequisites; no tasks.
- **User Story 1 (Phase 3)**: May proceed immediately. T001 and T004 touch separate repositories and can run in parallel; T002 follows T001, and T003 routes the visitor to the embedded assistant.
- **User Story 2 (Phase 4)**: T005 and T006 are the test-first pair; write and run T005 before T006. It is independent of User Story 1 implementation.
- **Polish (Phase 5)**: T007 can run in parallel with story work. T008 depends on T001-T006. T009 depends on T008, successful Cloudflare public endpoint activation, and access to the portfolio repository settings.

### User Story Dependencies

- **User Story 1 (P1)**: Independent; uses the existing URL configuration and service contract.
- **User Story 2 (P2)**: Independent of User Story 1; improves the visitor outcome for failed or slow requests.

### Parallel Opportunities

- T001 and T004 can run in parallel because they touch distinct repositories and files.
- T005 test authoring can begin independently of the URL/CORS work; T006 follows T005.
- T007 documentation can run in parallel with implementation.

## Parallel Example: User Story 1

```text
Task: Update URL validation cases in ts-app/scripts/validate-assistant-url.test.js
Task: Update Worker CORS behavior in worker/src/index.ts
```

## Implementation Strategy

1. Deliver the P1 endpoint-validation and CORS path first.
2. Add and pass the P2 component tests, then implement the deadline and recovery behavior.
3. Run local verification before updating the deployed repository variable.
4. Complete the published Cloudflare smoke checks when the active endpoint and repository settings are available.

## Notes

- Test tasks are included because the implementation plan and quickstart define automated and end-to-end verification scenarios.
- The deployed Cloudflare hostname is not stored in either repository; do not guess or hard-code it.
- `AI_ASSISTANT_URL` is provider-neutral configuration. Its value must be updated to the active Cloudflare endpoint; the existing Pages workflow maps it to `REACT_APP_AI_ASSISTANT_URL`.
- The homepage assistant action routes to the embedded Projects experience; `AI_ASSISTANT_URL` is used only as the photo-review service endpoint.
- CORS permits browser access but is not authentication. The Worker must not use wildcard CORS or log image payloads.
