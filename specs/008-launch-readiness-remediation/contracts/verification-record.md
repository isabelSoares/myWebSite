# Contract: Verification Record

**Feature**: `008-launch-readiness-remediation`
**Applies to**: `specs/008-launch-readiness-remediation/verification-record.md` and the reconciliation of `specs/007-photo-display-and-theme/tasks.md`.

## Required sections

The verification record MUST contain, in this order:

1. **Metadata** — feature, date, environment, and assistant endpoint identity.
2. **Automated gates** — one row per gate with the command and result.
3. **Manual and visual checks** — one row per check from the 007 quickstart.
4. **Capacity** — the measured published-site result and target status.
5. **Routing** — one row per main address with status code, rendered content, and decision.
6. **Documentation corrections** — one row per corrected record.
7. **Open items** — any `FAIL`, `UNVERIFIED`, or `CANCELLED` item and the owner action.

## Status values

| Status | Meaning | Required fields |
|--------|---------|-----------------|
| `PASS` | Executed and matched the expected outcome. | Evidence |
| `FAIL` | Executed and did not match. | Evidence, reason |
| `UNVERIFIED` | Could not be executed in this environment. | Reason, owner |
| `CANCELLED` | No longer required. | Reason |

No other status values are allowed. A check may not be omitted.

## Evidence requirements

- Automated gates cite the command and its summary line or exit status.
- Visual checks cite the captured artifact path or the exact viewport and route inspected.
- Capacity checks cite the command, concurrency, duration, request count, error rate, and p95 latency.
- Routing checks cite the route, observed status code, and whether SPA content was present.
- No evidence field may contain a secret, token, or a full credential-bearing URL.

## Reconciliation rules

1. Every formerly open task in `specs/007-photo-display-and-theme/tasks.md` appears in the record.
2. A checked task in the 007 list has a `PASS` or documented `CANCELLED` equivalent.
3. An unchecked task in the 007 list has an inline status note pointing to the record.
4. A task with a completed implementation but an incomplete review is `PARTIAL`, with both parts stated.
5. The record and the task list must not disagree about completion.

## Launch decision

The record MUST end with one of:

- **Ready to announce** — every launch-critical item is `PASS` or an accepted limitation is recorded.
- **Not ready** — at least one launch-critical item is `FAIL`, with the blocking item named.
- **Blocked** — at least one launch-critical item is `UNVERIFIED` and cannot be closed before launch.

An accepted limitation (for example, a non-200 direct-link status) is allowed only when the rationale and visitor impact are stated.
