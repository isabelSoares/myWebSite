# Implementation Plan: Launch Readiness Remediation

**Branch**: `fix/launch-readiness-remediation` | **Date**: 2026-10-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-launch-readiness-remediation/spec.md`

**Note**: This plan closes the evidence and record gaps identified before announcing the site. It changes documentation and the generated-photo budget reporting; it does not change the visitor-facing site, the photo set, or the deployment pipeline.

## Summary

The site is deployed and its automated release gate already passes, but the launch evidence is incomplete and several records describe an earlier photo architecture. This remediation:

1. Executes and records every formerly open launch check, including the responsive framing review, album orientation review, dark-mode behavior, capacity measurement, and direct-link observation.
2. Corrects the 007 data-model invariant and plan counts so they match the current manifest.
3. Rewrites the 005 capacity report around locally generated WebP derivatives and records the measured concurrency instead of the retired external-host assumption.
4. Raises the generated-photo budget from 60 MB to 64 MB, reports the remaining headroom in the release check, and aligns the documentation.
5. Removes the stray root task artifact and standardizes documentation terminology.

No photo derivatives are regenerated and no visitor-facing behavior changes.

## Technical Context

**Language/Version**: Markdown records plus the existing Node.js 24 verification scripts; the React 17 / TypeScript 4.9 application is not modified.

**Primary Dependencies**: Existing `verify:release`, `validate:photos`, `validate:site-assets`, `load:smoke`, Jest, and Node assertion tests. No new runtime or development dependency. Google Chrome is used only for visual evidence.

**Storage**: Committed Markdown records, the existing photo manifest and generated WebP derivatives, and the existing browser storage behavior. No database or backend.

**Testing**: `npm run verify:release`, the Jest suite, Node assertion tests for the photo-budget helper, headless Chrome captures at 320/768/1440 px, published-route HTTP checks, and the published load smoke test.

**Target Platform**: Repository documentation and the existing GitHub Pages deployment. No hosting change.

**Project Type**: Static web application with local verification and photo-publishing tooling.

**Performance Goals**: Keep the generated photo footprint below the configured 64 MB limit with at least 1 MB of headroom (expected ~4.08 MB). Measure the published site at 1,000 concurrent route requests and report the actual error rate and p95 latency.

**Constraints**: No photo regeneration; no new dependencies; no visitor-facing changes; no secret values in records; historical 005 research and plan documents are not rewritten as if they were always correct; the release check remains the automated launch gate.

**Post-verification exception (approved 2026-10-26)**: The 320 px visual check found a 27 px top-bar horizontal overflow. The owner explicitly approved the `ts-app/src/components/top-bar/TopBar.scss` `@media (max-width: 400px)` correction. It is the only visitor-facing change and is recorded in `specs/008-launch-readiness-remediation/verification-record.md`.

**Scale/Scope**: 14 albums, 172 album photos, 2 featured photos, 348 generated derivatives, 5 route experiences, 6 formerly open tasks, 1 verification record, 1 budget constant plus its reporting, and targeted documentation corrections.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the unfilled template. No ratified principles exist, so there are no constitution violations to evaluate. Ratifying the constitution remains a separate governance action outside this remediation.

**Gate result: PASS with advisory gates.** The plan applies the same advisory gates used by the 007 plan:

- **Static hosting**: No runtime backend, server, or secret is introduced.
- **Privacy**: Only generated derivatives are documented and referenced; no originals are published.
- **Accessibility**: No visitor-facing markup or interaction changes are made.
- **No layout regression**: No application styles or components change.
- **Testability**: Every record correction is verifiable from the manifest, filesystem, command output, or live response.
- **Scope discipline**: No photo regeneration, album changes, new features, or hosting migration.

**Post-design re-check: PASS.** Phase 1 adds only Markdown records, one budget constant change with headroom reporting, its tests, and targeted documentation corrections. No runtime service, secret, photo asset, or visitor-facing behavior is added.

## Project Structure

### Documentation (this feature)

```text
specs/008-launch-readiness-remediation/
├── plan.md                    # This file
├── research.md                # Phase 0 decisions
├── data-model.md              # Phase 1 records and validation rules
├── contracts/
│   ├── verification-record.md
│   ├── photo-budget-report.md
│   └── documentation-consistency.md
├── quickstart.md              # Validation procedure
└── verification-record.md     # Created during implementation
```

### Source Code (repository root)

```text
ts-app/
├── scripts/
│   ├── lib/
│   │   └── photo-limits.js              # 60 MB → 64 MB; headroom helpers
│   ├── validate-photo-privacy.js        # report footprint, limit, headroom
│   ├── validate-photo-privacy.test.js   # assert headroom in the check detail
│   └── validate-photo-limits.test.js    # helper edge cases

README.md                                 # budget statement and terminology
tasks.md                                  # DELETE (stray root artifact)

specs/
├── 005-pre-launch-verification/
│   └── scalability-report.md            # rewrite around current architecture
├── 006-photo-privacy-and-profile/
│   └── quickstart.md                    # budget expectation
└── 007-photo-display-and-theme/
    ├── plan.md                          # 172 album + 2 featured; 64 MB goal
    ├── data-model.md                    # corrected invariant
    └── tasks.md                         # inline status notes + reconciliation
```

**Structure Decision**: Keep the single static application unchanged. The only executable change is in the existing photo-limit and photo-privacy scripts. Every other deliverable is a committed record in the existing specification structure.

## Design Decisions

### Verification evidence

- Create `specs/008-launch-readiness-remediation/verification-record.md` with the sections and status values defined in `contracts/verification-record.md`.
- Record the automated gate, the visual checks, the capacity run, the direct-link observation, and the documentation corrections in one dated record.
- Reconcile `specs/007-photo-display-and-theme/tasks.md` against the record. Checked items must have evidence; open items must carry an inline status note pointing to the record.
- Use `PASS`, `FAIL`, `UNVERIFIED`, and `CANCELLED`. A visual check without captured evidence is `UNVERIFIED`, never `PASS`.

### Photo budget and headroom

- Change `GENERATED_TOTAL_MAX_BYTES` from `60 * MB` to `64 * MB`.
- Derive the over-limit message from the constant so it cannot drift.
- Add a small helper that returns the remaining headroom and a formatted footprint description; use it in `validate-photo-privacy.js` and its tests.
- Keep the `photos.total-size` check `pass`/`fail` semantics; extend its detail to `"{used} MB generated across {n} files; {headroom} MB headroom of {limit} MB"`.
- Update the README, the 006 quickstart expectation, and the 007 performance goal to 64 MB. Do not rewrite the completed 006 task history.

### Capacity record

- Run the existing load smoke against the published site at 100 and 1,000 concurrency.
- If the 1,000-client run fails because of client-side socket limits, record the highest clean run and mark the target `UNPROVEN` with the tested ceiling.
- Rewrite `specs/005-pre-launch-verification/scalability-report.md` around the current 59.92 MB / 348-derivative architecture, 540 px thumbnails, lazy loading, and on-demand dialog images.
- Retain the direct-link 404 observation and add the launch decision.
- Add a superseded note instead of rewriting the historical 005 research and plan rationale.

### Routing

- Record the observed status and rendered content for `/`, `/resume`, `/projects`, and `/hobbies`.
- Accept the current host behavior, with the crawler/SEO limitation stated. No routing or hosting change is made.

### Records and terminology

- Correct the 007 data-model invariant to say the rotation metadata was corrected while derivatives, albums, and ordering stayed unchanged.
- Correct the 007 plan scale to 172 album photos plus 2 featured photos.
- Use **Experience** in documentation for `/resume`, **AI Photographer Assistant** for the full product name, and **Hobbies** for the albums page.
- Delete the root `tasks.md`; its README instruction work is already reflected in `README.md`.

### Documentation correction sweep

- Search current records for `245 MB`, `202 files`, `raw.githubusercontent.com/.../photos`, `174 album`, and `60 MB`.
- Correct the scalable report, README, 006 quickstart, and current 007 records.
- Leave historical 005 research and plan rationale intact, with the report carrying the superseded note.

## Complexity Tracking

No constitution violations. The only added executable structure is a small headroom-formatting helper in the existing photo-limits module. No additional project, service, or dependency is introduced.
