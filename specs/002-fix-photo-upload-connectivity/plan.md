# Implementation Plan: Fix Photo Upload Connectivity

**Branch**: `002-fix-photo-upload-connectivity` | **Date**: 2026-10-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/002-fix-photo-upload-connectivity/spec.md`

## Summary

Restore photo reviews from the published portfolio by routing submissions to the active Cloudflare-hosted analysis service, ensuring the service allows the portfolio origin to make and read review requests, and making failures recoverable within the 30-second user-facing deadline. The portfolio deployment already obtains its service URL from `AI_ASSISTANT_URL`; update validation so the retired Render host cannot be deployed again, and coordinate the required CORS and privacy behavior with the companion service repository, which is not present in this checkout.

## Technical Context

**Language/Version**: TypeScript 4.9.5 and JavaScript on the existing React application. The companion Worker runtime is outside this repository’s build and implementation boundary; this plan defines its external contract without prescribing its language.

**Primary Dependencies**: React 17, TypeScript 4.9.5, Create React App 5, Jest/React Testing Library, and the separately deployed photo-analysis service. No new frontend dependency is planned.

**Storage**: No portfolio storage. Photo data and results remain transient for the active review. The Worker and any inference provider must be reviewed to verify that their processing, logs, and upstream retention satisfy the specification.

**Testing**: Existing Jest/React Testing Library tests; assistant URL validation script tests; production build; focused browser and live-service verification from the published portfolio. Worker CORS and response tests must run in the companion service repository.

**Target Platform**: Published static portfolio on GitHub Pages and supported desktop/mobile browsers; Cloudflare-hosted analysis service as an external integration.

**Project Type**: Static web frontend integrated with an external HTTP photo-analysis service; the service implementation is not checked out in this repository.

**Performance Goals**: Show a visible in-progress state after review submission and show a completed result or actionable failure within 30 seconds, including client-side image preparation, request/response transfer, and response parsing.

**Constraints**: Keep the existing JSON review payload and result shape unless the companion service contract requires a coordinated change. Use the exact published origin `https://isabelsoares.github.io` for browser access; do not rely on wildcard CORS or frontend-embedded secrets. Preserve JPG/PNG/WEBP support, the 10 MB selection limit, retry without reselecting, and the no-retention privacy requirement. The actual Cloudflare URL is not stored in this repository and must be supplied through the existing GitHub repository variable before deployment.

**Scale/Scope**: Update the portfolio URL validation and review request UX, test the integration contract, and coordinate the companion Worker’s preflight/response policy. No new pages, databases, authentication layer, or frontend dependencies.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- The constitution file contains template placeholders only; it defines no ratified project principles or explicit gates.
- The design uses the existing app and deployment configuration, adds no dependencies or data persistence, and retains the stated photo privacy and file-validation expectations.
- Service-side CORS, request validation, and retention cannot be verified in this checkout; they are explicit companion-service integration and release checks rather than assumed frontend behavior.
- **Pre-research gate result**: Pass. No constitution-defined violations or unresolved architecture decisions block planning.
- **Post-design gate result**: Pass. Design adds no new storage, dependencies, or independently deployed service; the external service contract and privacy verification are documented below.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-photo-upload-connectivity/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── photo-review-service.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
.github/workflows/
└── deploy-pages.yml                 # Provides configured assistant URL to the build
ts-app/
├── scripts/
│   ├── validate-assistant-url.js    # Rejects missing/unsafe/retired service addresses
│   └── validate-assistant-url.test.js
└── src/
    ├── config/assistant.ts          # Reads the deployed assistant URL
    └── components/personal-projects/
        ├── PhotoAssistant.tsx       # Review lifecycle, deadline, feedback, retry
        └── PhotoAssistant.test.tsx  # Focused request and recovery tests (planned)

External integration (not checked out here):
ai-photographer-assistant/           # Cloudflare service; CORS and retention verification
```

**Structure Decision**: Keep portfolio behavior within its existing configuration, upload component, URL validation script, and tests. Treat the Worker as an external deployment boundary with a documented request/response contract; no backend source folder will be invented in this repository.

## Complexity Tracking

No constitution violations or additional architectural complexity require justification.
