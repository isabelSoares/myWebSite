# Data Model: Pre-Launch Website Verification

This feature has no application database. The model describes the verification records produced by the release check and the site content the check inspects.

## Page

Represents a public section of the portfolio.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | string | Stable identifier (`home`, `resume`, `projects`, `hobbies`) | Must be one of the four main sections |
| `path` | string | Public route beneath the portfolio base path | Unique; starts with `/` |
| `title` | string | Section title used in the report | Non-empty |
| `requiresJavaScript` | boolean | Whether interactive content needs client-side JavaScript | `true` for the current React SPA |
| `directLoadSupported` | boolean | Whether a fresh browser request to the route resolves | Must be `true` after the 404 fallback check |
| `assets` | Asset[] | Assets referenced by the section | Every required asset must resolve |

**Relationships**: A Page references zero or more Assets. A ReadinessCheck inspects one or more Pages.

## Asset

Represents an image, icon, document, or metadata file referenced by the site.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | string | Stable identifier or URL | Non-empty |
| `kind` | enum | `image`, `icon`, `document`, `metadata` | Must be one of the listed kinds |
| `reference` | string | Source path or URL as written by the site | Non-empty |
| `required` | boolean | Whether a missing asset fails the release check | Metadata and visible images are required |
| `location` | enum | `local-public`, `repository-photo`, `external` | Must be classified explicitly |
| `exists` | boolean | Result of the local existence check | `true` for required local assets |
| `loadStrategy` | enum | `eager`, `lazy` | Large offscreen album images use `lazy` |
| `sizeBytes` | number or null | Size when known locally | Non-negative; informational for external assets |

**Validation rules**:

- A required `local-public` asset must exist beneath `ts-app/public`.
- A required `repository-photo` asset must exist beneath `photos/`.
- An `external` asset is reported as a dependency, not as a build failure, unless an optional online check is requested.
- Manifest icon references must match assets that exist in `ts-app/public`.
- Offscreen album images must use lazy loading.

## ReadinessCheck

Represents one repeatable verification criterion.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `id` | string | Stable check identifier (for example `assets.manifest`) | Unique within a run |
| `name` | string | Human-readable check name | Non-empty |
| `category` | enum | `content`, `assets`, `routes`, `deployment`, `performance` | Must be one of the listed categories |
| `command` | string | Command or probe used | Non-empty |
| `expected` | string | Expected condition | Non-empty |
| `actual` | string | Observed result | Populated for every run |
| `status` | enum | `pass`, `fail`, `skip`, `warning` | Fail means the release is blocked |
| `detail` | string | Actionable failure detail | Includes the failing path, route, or input |

**State transitions**:

1. `pending` → `pass` when the probe meets the expected condition.
2. `pending` → `fail` when a required probe does not meet the condition.
3. `pending` → `warning` when a non-blocking dependency is degraded.
4. `pending` → `skip` when an optional probe (such as an online external-link check) was not requested.

**Aggregate rule**: The release is ready only when no check is `fail`. Warnings are reported but do not block the launch decision.

## ExternalService

Represents a dependency the portfolio does not operate.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `name` | string | Service name | Non-empty |
| `purpose` | string | What the site uses it for | Non-empty |
| `endpoint` | string or null | Configured URL | Validated by the existing assistant URL rules when applicable |
| `requiredForPrimaryPages` | boolean | Whether the main sections depend on it | `false` for the photo assistant |
| `failureBehavior` | string | Visitor-facing behavior when unavailable | Plain-language message and continued browsing |
| `timeoutSeconds` | number | Client timeout | Must match the implemented timeout |

## VisitorLoad

Represents the concurrency target and its measured result.

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `targetConcurrentVisitors` | number | Launch-spike target | `1000` |
| `scope` | string[] | Routes exercised | Includes all four main routes |
| `durationSeconds` | number | Measurement window | Positive |
| `errorRate` | number | Fraction of failed requests | Must be below `0.01` |
| `p95LatencyMs` | number | 95th percentile response time | Reported, not used to prove host capacity |
| `environment` | enum | `local-build` or `published-site` | Must be stated with results |

**Validation rules**:

- A local result must be labeled `local-build` and must not be presented as GitHub Pages capacity.
- The published-site result is the authoritative scalability evidence and is captured manually after deployment.

## Relationships

```text
ReadinessCheck ──inspects──> Page ──references──> Asset
ReadinessCheck ──probes────> ExternalService
VisitorLoad ───exercises───> Page
```

## Out of Scope

- Visitor accounts, personal data storage, and server-side sessions.
- Capacity guarantees for the external photo host or the photo assistant.
- Automated external-link crawling in the required offline release gate.
