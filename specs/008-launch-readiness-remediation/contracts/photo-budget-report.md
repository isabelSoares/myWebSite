# Contract: Photo Budget and Headroom Report

**Feature**: `008-launch-readiness-remediation`
**Applies to**: `ts-app/scripts/lib/photo-limits.js`, `ts-app/scripts/validate-photo-privacy.js`, and the README/quickstart statements about the generated footprint.

## Configured limit

| Item | Required value |
|------|----------------|
| Constant | `GENERATED_TOTAL_MAX_BYTES` in `ts-app/scripts/lib/photo-limits.js` |
| Value | `64 * MB` |
| Rationale | Restores at least 1 MB headroom above the 59.92 MB current footprint without recompressing or removing published photos. |

The over-limit error message MUST derive the limit from the constant rather than hard-coding a number.

## Release check output

The `photos.total-size` check MUST remain `pass` when the footprint is at or below the limit and `fail` above it. Its detail string MUST include:

1. Current footprint in MB with two decimals.
2. Number of generated files.
3. The configured limit in MB with two decimals.
4. Remaining headroom in MB with two decimals.

Example shape:

```text
59.92 MB generated across 348 files; 4.08 MB headroom of 64.00 MB
```

When the footprint exceeds the limit, the detail MUST state the overage instead of a negative headroom.

## Tests

- A fixture below the limit asserts `photos.total-size` is `pass` and the detail contains `headroom`.
- A unit test for the formatting/headroom helper covers exactly-at-limit, below-limit, and above-limit values.
- The release-script test suite continues to pass without network access.

## Documentation alignment

The following statements MUST agree with the configured limit:

- `README.md` generated-footprint sentence.
- `specs/006-photo-privacy-and-profile/quickstart.md` expected footprint.
- `specs/007-photo-display-and-theme/plan.md` performance goal.
- `specs/008-launch-readiness-remediation/verification-record.md` budget row.

A mismatch between any of these and the constant is a documentation failure.
