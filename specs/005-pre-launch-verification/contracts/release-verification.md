# Contract: Release Verification Command

## Purpose

Defines the repeatable pass/fail interface the site owner runs before announcing the portfolio. The implementation must honor this contract so the result is unambiguous and CI-compatible.

## Invocation

```sh
cd ts-app
npm run verify:release
```

Optional network-dependent checks:

```sh
npm run verify:release -- --online
```

Optional report file:

```sh
npm run verify:release -- --json
```

## Preconditions

- Dependencies are installed with `npm ci`.
- The command runs from `ts-app/`.
- `REACT_APP_AI_ASSISTANT_URL` is set when verifying a production deployment.
- Node.js 24 or newer is available.

## Required Checks

The command MUST run the following checks in a deterministic order:

| Order | Check ID | Category | Pass condition |
|-------|----------|----------|----------------|
| 1 | `types` | content | `tsc --noEmit` exits successfully |
| 2 | `lint` | content | ESLint reports no errors for `src` |
| 3 | `tests` | content | Jest completes with all tests passing |
| 4 | `tests.scripts` | content | The Node assistant-URL and site-asset tests pass |
| 5 | `assistant-url` | deployment | The assistant URL validator passes when the variable is set |
| 6 | `assets.local` | assets | Every required local public asset reference resolves |
| 7 | `assets.photos` | assets | Every album photo referenced by the source exists beneath `photos/` |
| 8 | `assets.manifest` | assets | Every manifest icon exists in `public/` and `build/` |
| 9 | `build` | deployment | The production build completes |
| 10 | `routes.fallback` | routes | `build/index.html` and `build/404.html` both exist |
| 11 | `assets.build` | assets | The built manifest and referenced icons are present |
| 12 | `privacy.no-secrets` | deployment | No committed secret or credential is detected in tracked source files |

## Output Contract

The command MUST print one line per check using this shape:

```text
[PASS] assets.manifest - all manifest icons exist
[FAIL] assets.photos - missing: photos/portugal/IMG_0001.webp
[SKIP] links.external - online checks not requested
[WARN] assets.external - raw.githubusercontent.com is an external dependency
```

Rules:

- Status values are `PASS`, `FAIL`, `SKIP`, and `WARN`.
- Every `FAIL` line includes the exact failing file, route, or input.
- The final line MUST be one of:
  - `Release check: PASS (X passed, Y warnings, Z skipped)`
  - `Release check: FAIL (Z failed)`
- `WARN` and `SKIP` do not change the exit code.
- A required check that cannot run is a `FAIL`, not a `SKIP`.
- Output must not contain credentials or full environment variable values.

## Optional `--json` Output

When `--json` is supplied, the command MUST also write a machine-readable report to stdout with:

```json
{
  "status": "pass",
  "checks": [
    {
      "id": "assets.manifest",
      "category": "assets",
      "status": "pass",
      "detail": "all manifest icons exist"
    }
  ],
  "summary": { "passed": 0, "failed": 0, "warnings": 0, "skipped": 0 }
}
```

Human-readable lines may be suppressed when `--json` is supplied.

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | All required checks passed; launch may proceed |
| `1` | At least one required check failed; launch is blocked |
| `2` | The command could not run because prerequisites are missing |

## Non-Goals

- Proving GitHub Pages capacity.
- Crawling every external URL by default.
- Replacing manual visual review of layout and content quality.
