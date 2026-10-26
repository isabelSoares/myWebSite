# Data Model: Launch Readiness Remediation

**Feature**: `008-launch-readiness-remediation`
**Date**: 2026-10-26
**Source of truth**: the current photo manifest, generated derivatives, release-check output, deployed site responses, and the committed feature records.

## Overview

This feature adds no runtime data. It introduces committed records that describe the state of the site and the evidence behind the launch decision. The only executable data change is the configured generated-photo budget and the headroom reported by the release check.

## Entities

### VerificationRecord

A dated record of the launch checks and their outcomes.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `feature` | string | Yes | `008-launch-readiness-remediation`. |
| `date` | ISO date | Yes | Date the checks were executed. |
| `environment` | string | Yes | Local build, local dev server, or published site. |
| `assistantEndpoint` | string | Yes | Endpoint identity verified during the release check; never a credential. |
| `items` | `VerificationItem[]` | Yes | One entry per automated or manual check. |
| `overall` | `PASS`, `FAIL`, or `BLOCKED` | Yes | `PASS` only when no item is `FAIL` or `UNVERIFIED` for a launch-critical check. |
| `notes` | string | No | Context, limitations, or follow-up owner actions. |

**Validation rules**:
- Every item has an explicit status; no item may be omitted because it was inconvenient.
- `FAIL` and `UNVERIFIED` items include a reason.
- `UNVERIFIED` items name the action and owner required to close them.
- The record never contains the assistant URL's credentials, tokens, or secret values.

### VerificationItem

A single check inside a verification record.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Stable identifier, for example `release.verify` or `photo.orientation-review`. |
| `category` | enum | Yes | `automated`, `visual`, `capacity`, `routing`, `documentation`. |
| `status` | enum | Yes | `PASS`, `FAIL`, `UNVERIFIED`, or `CANCELLED`. |
| `evidence` | string | Yes | Command output summary, screenshot reference, HTTP observation, or file path. |
| `reason` | string | No | Required for `FAIL`, `UNVERIFIED`, and `CANCELLED`. |
| `owner` | string | No | Required for `UNVERIFIED` and `CANCELLED`. |

**Validation rules**:
- A `PASS` item must cite concrete evidence in the repository or the deployed site.
- A `CANCELLED` item must state why the check is no longer required.
- A visual check without a captured artifact may be `UNVERIFIED` but never `PASS`.

### TaskStatus

The reconciliation of a formerly open task in the 007 task list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | string | Yes | For example `T008`. |
| `source` | string | Yes | `specs/007-photo-display-and-theme/tasks.md`. |
| `status` | enum | Yes | `DONE`, `PARTIAL`, `UNVERIFIED`, or `CANCELLED`. |
| `evidenceRef` | string | Yes | Link to the verification item or record section. |

**Validation rules**:
- The task list and the verification record must agree on every reconciled task.
- `PARTIAL` must state which portion is complete and which remains.

### CapacityRecord

The measured behavior of the published site under load.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `environment` | string | Yes | `published-site` or `local-build`. |
| `address` | string | Yes | Published base address. |
| `concurrency` | integer | Yes | Number of simultaneous clients. |
| `durationSeconds` | integer | Yes | Test duration. |
| `requests` | integer | Yes | Total requests issued. |
| `errors` | integer | Yes | Failed requests. |
| `errorRate` | percentage | Yes | `errors / requests`. |
| `p95LatencyMs` | number | Yes | 95th percentile response time. |
| `routesExercised` | string[] | Yes | Routes included in the run. |
| `target` | integer | Yes | The stated launch target, currently 1,000 simultaneous visitors. |
| `targetStatus` | enum | Yes | `PROVEN`, `UNPROVEN`, or `RE-SCOPED`. |

**Validation rules**:
- `PROVEN` requires a clean run at or above `target`.
- `UNPROVEN` must state the highest clean concurrency actually tested.
- The record must state whether album photos and the assistant were exercised.
- Local results are labeled `local-build` and never presented as published-site capacity.

### PhotoFootprintBudget

The configured limit and the measured generated-photo footprint.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `limitBytes` | integer | Yes | Configured maximum, increased to 64 MB. |
| `currentBytes` | integer | Yes | Measured footprint. |
| `headroomBytes` | integer | Yes | `limitBytes - currentBytes`. |
| `derivativeCount` | integer | Yes | Generated files counted. |
| `approvedChange` | string | No | Rationale required when the limit changes. |

**Validation rules**:
- `headroomBytes` must be at least 1 MB or an approved limit change must be recorded.
- The release check must print the current footprint, limit, and headroom.
- The README and quickstart must state the same limit as the configured value.
- The budget never authorizes publishing originals; only generated derivatives count.

### DirectLinkObservation

The observed behavior of a main-section address opened directly.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `route` | string | Yes | `/`, `/resume`, `/projects`, or `/hobbies`. |
| `statusCode` | integer | Yes | HTTP status returned by the host. |
| `spaBodyRendered` | boolean | Yes | Whether the SPA content was present in the response. |
| `decision` | enum | Yes | `ACCEPTED` or `SCHEDULED-FIX`. |
| `rationale` | string | Yes | Why the behavior is acceptable or what will change. |

**Validation rules**:
- Every main route has an observation.
- Accepting a non-200 status requires a stated rationale and a note about crawler/SEO impact.
- `SCHEDULED-FIX` must name the follow-up change.

### CanonicalTerm

The preferred documentation name for a concept.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `concept` | string | Yes | For example `experience page`. |
| `canonicalName` | string | Yes | `Experience`, `AI Photographer Assistant`, or `Hobbies`. |
| `routeOrInternalName` | string | No | The unchanged route or component name, for example `/resume`. |
| `allowedAliases` | string[] | No | Explicitly permitted variants. |

**Validation rules**:
- Current documentation uses the canonical name on first mention.
- Routes and internal component names are not renamed by this feature.

### DocumentationCorrection

A factual correction to an existing record.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `artifact` | path | Yes | File corrected. |
| `field` | string | Yes | Section or statement corrected. |
| `previous` | string | Yes | Incorrect value or claim. |
| `corrected` | string | Yes | Accurate value or claim. |
| `sourceOfTruth` | string | Yes | Manifest, filesystem, command output, or live response. |

**Validation rules**:
- The corrected value is verifiable from the stated source.
- Corrections never edit generated derivatives or the published photo set.
- Historical research documents may carry a superseded note instead of being rewritten.

## State transitions

### Verification item

```text
PENDING
  ├─ evidence captured and matches expectation → PASS
  ├─ evidence captured and differs → FAIL (reason required)
  ├─ cannot be executed in this environment → UNVERIFIED (reason + owner)
  └─ no longer required → CANCELLED (reason required)
```

### Photo budget

```text
60 MB limit, 59.92 MB used, 0.08 MB headroom
  └─ approved limit change to 64 MB (rationale recorded)
       └─ 4.08 MB headroom → PASS, adding routine photos remains safe
```

### Capacity target

```text
1,000-visitor target
  ├─ clean run at ≥1,000 concurrency → PROVEN
  ├─ clean run below target → UNPROVEN (tested ceiling recorded)
  └─ target explicitly reduced with rationale → RE-SCOPED
```

## Invariants

- The published photo set, album order, and generated derivatives remain unchanged.
- Only generated derivatives are referenced; no original photo path is introduced.
- Every formerly open launch task has an explicit recorded status.
- The release check remains the automated launch gate.
- Historical records that are not actively used for the current decision are not rewritten as if they were always correct.
- The verification record contains no secret values.
