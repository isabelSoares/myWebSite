# Research: Launch Readiness Remediation

**Feature**: `008-launch-readiness-remediation`
**Date**: 2026-10-26
**Source of truth**: the current manifest, generated derivatives, release scripts, deployed site, and the prior specification analysis.

## Current baseline (measured 2026-10-26)

| Fact | Value | Source |
|------|-------|--------|
| Albums | 14 | `ts-app/src/data/photo-manifest.json` |
| Album photos | 172 | manifest |
| Featured photos | 2 (portrait, hero) | manifest |
| Total photos | 174 | manifest |
| Generated derivatives | 348 WebP files | `ts-app/public/photos/generated/` |
| Generated footprint | 62,833,000 bytes (59.92 MB) | filesystem |
| Configured footprint limit | 62,914,560 bytes (60 MB) | `ts-app/scripts/lib/photo-limits.js` |
| Remaining headroom | 81,560 bytes (~0.08 MB) | calculation |
| Album rotation metadata | 0 entries at `rotation: 90` | manifest |
| Automated gates | release check PASS (19 passed, 0 failed, 1 skipped); Jest 27/27 | local run |
| Live deployment | successful for `origin/main` `d01dc84` | GitHub Actions |
| Direct-link status | `/resume`, `/projects`, `/hobbies` return HTTP 404 with SPA body | live check |
| Assistant endpoint | reachable | live check |
| Visual tooling | Google Chrome installed; Playwright/Puppeteer not installed | local environment |

## Decisions

### D1 — Record verification evidence in a committed Markdown record

- **Decision**: Add `specs/008-launch-readiness-remediation/verification-record.md` with a dated, per-item table using `PASS`, `FAIL`, `UNVERIFIED`, and `CANCELLED`. Reference it from the open items in the 007 task list.
- **Rationale**: The repository already uses Markdown records; a committed record is reviewable, diffable, and requires no new tooling. It makes the launch decision auditable.
- **Alternatives considered**:
  - JSON report: machine-readable but awkward for manual evidence and human review.
  - Issue tracker only: not contained in the repository and breaks offline review.
  - Checkbox-only task updates: no room for evidence, reasons, or partial results.

### D2 — Raise the generated-photo budget to 64 MB and report headroom

- **Decision**: Change `GENERATED_TOTAL_MAX_BYTES` from `60 * MB` to `64 * MB`, make the over-limit message use the configured limit, and include remaining headroom in the `photos.total-size` check detail. Update the README, the 006 quickstart expectation, and the 007 performance goal to match.
- **Rationale**: The current footprint is 59.92 MB, leaving ~0.08 MB. Any normal album addition fails the release gate. The originals required for recompression are outside the repository and may not be available in every environment. A 64 MB cap restores ~4.08 MB headroom, enough for roughly 9–16 typical photos, while remaining far below the static host's site limit.
- **Alternatives considered**:
  - Recompress existing derivatives: requires private originals, risks visible quality changes, and violates the "no regeneration unless required" constraint.
  - Remove published photos: content loss unrelated to launch readiness.
  - Keep 60 MB and only report headroom: satisfies visibility but not the required 1 MB margin, and blocks routine photo additions.

### D3 — Measure published capacity with the existing load-smoke command

- **Decision**: Run `npm run load:smoke -- --concurrency=100 --duration=15 --url=https://isabelsoares.github.io/myWebSite/`, then attempt `--concurrency=1000`. Record the highest clean run, error rate, and p95 latency in the capacity record. Mark the 1,000-visitor target proven only if the run is clean; otherwise state the tested ceiling and keep the target unproven.
- **Rationale**: The command already supports published URLs and treats the SPA 404 fallback as a valid response. It exercises the four main routes and requires no new dependency.
- **Alternatives considered**:
  - Add k6/artillery: new tooling and dependency for a one-off launch decision.
  - Skip the test: fails the requirement to state a measured ceiling.
  - Load-test photos and the assistant: the assistant is an external service and album photos are lazy-loaded; route availability is the site's responsibility.

### D4 — Accept the direct-link status behavior and document it

- **Decision**: Keep the current routing. Record that direct links return HTTP 404 with the rendered SPA for `/resume`, `/projects`, and `/hobbies`, and state that this is accepted for launch because visitors see the correct content. Document the crawler/status-code limitation and the alternatives.
- **Rationale**: Changing to hash routing would alter public URLs and share links; migrating hosts is out of scope. The behavior is a known static-host limitation, not a functional regression.
- **Alternatives considered**:
  - Hash routing: changes every published URL and weakens SEO.
  - Host with SPA rewrites: hosting migration outside this remediation.
  - Ignore the behavior: fails the requirement to record a decision.

### D5 — Use headless Chrome for visual evidence; mark anything unautomated

- **Decision**: Use the installed Google Chrome in headless mode to capture `/` and `/hobbies` at 320, 768, and 1440 px, plus the main routes in fresh storage for dark mode. If album dialog interaction can be driven reliably through a temporary local script, capture representative orientation checks; otherwise record the full album review as `UNVERIFIED` with the reason and the owner action required.
- **Rationale**: Chrome is already installed and screenshots provide real visual evidence without adding dependencies. Automating every album interaction is not worth a new test framework for a launch remediation.
- **Alternatives considered**:
  - Add Playwright: new dependency and browser download for a one-time review.
  - Declare all visual checks unverified: weakens the launch evidence unnecessarily.
  - Manual-only review with no captures: no durable evidence.

### D6 — Correct current records; preserve historical planning history

- **Decision**: Correct the 007 data model invariant and plan counts because they describe the delivered feature. Rewrite the 005 scalability report as the current capacity source of truth and add a note that it supersedes the earlier external-host assumption. Do not rewrite the historical 005 research or plan rationale.
- **Rationale**: The 007 records are actively used for the delivered feature and contain factual contradictions. The 005 research/plan are historical design records; rewriting them would misrepresent how the feature was designed. The report is explicitly a living capacity record.
- **Alternatives considered**:
  - Rewrite all 005 artifacts: misleading history and unnecessary churn.
  - Leave everything: fails the "records describe the shipped site" story.

### D7 — Remove the stray root task artifact

- **Decision**: Delete the repository-root `tasks.md`. Its completed README instruction work is already reflected in `README.md`.
- **Rationale**: The file is outside the feature specification structure, describes a finished documentation change, and competes with `/speckit.*` task discovery.
- **Alternatives considered**:
  - Move it under `specs/`: creates a synthetic feature for a one-line README edit.
  - Keep it: leaves a misleading task artifact.

### D8 — Standardize documentation terminology

- **Decision**: Use **Experience** for the `/resume` page in documentation (matching the visible navigation), **AI Photographer Assistant** for the full product name, and **Hobbies** for the albums page. Keep `/resume` as the route and internal component name.
- **Rationale**: The visible navigation is the canonical visitor-facing language; changing it would be a visitor-facing change outside this remediation.
- **Alternatives considered**:
  - Rename the navigation to Résumé: visitor-facing change, out of scope.
  - Leave mixed terms: fails the terminology requirement.

### D9 — Treat the constitution as advisory

- **Decision**: Do not modify `.specify/memory/constitution.md`. Apply the advisory gates already recorded in the 007 plan: static hosting, privacy, accessibility, no layout regression, testability, and scope discipline.
- **Rationale**: The constitution is still an unfilled template and ratification is a separate governance decision. The feature does not violate any existing rule because no rules are ratified.
- **Alternatives considered**:
  - Ratify a constitution now: governance change outside this remediation.
  - Ignore governance entirely: the plan still needs explicit gates.

## Open questions

None. All unknowns are resolved by the decisions above.
