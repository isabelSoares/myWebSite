# Contract: Release Verification

**Feature**: `006-photo-privacy-and-profile`  
**Command**: `npm run verify:release` from `ts-app`

## Purpose

Make the privacy and build-health requirements enforceable. A release must fail if a future change re-adds a tracked original, publishes a raw GitHub photo link, breaks the generated manifest, exceeds derivative limits, or reintroduces the deprecated TypeScript target.

## Required environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `REACT_APP_AI_ASSISTANT_URL` | Yes for the full release check | Validated production assistant endpoint |

The photo and TypeScript checks themselves must run without private originals or network access.

## Required checks

| Check ID | Category | Pass condition | Failure condition |
|----------|----------|----------------|-------------------|
| `types` | content | `npx tsc --noEmit` exits 0 | Any TypeScript error |
| `types.deprecations` | content | TypeScript output contains no `deprecated` or `deprecation` warning | Any deprecation warning is printed |
| `config.tsconfig` | content | `target` is `ES2020`; `moduleResolution` is `node`; `ignoreDeprecations` is `6.0` | Any value is missing or wrong |
| `lint` | content | ESLint exits 0 | Any lint error |
| `tests` | content | Jest exits 0 | Any failing test |
| `tests.scripts` | content | All Node script tests pass, including photo-privacy and tsconfig tests | Any script test fails |
| `privacy.no-originals` | deployment | No tracked path is under `photos/` or `photo-originals/`; no tracked or build-output raster image outside `public/photos/generated/` exceeds the derivative limits | Any tracked original path or oversized raster image is found |
| `privacy.no-raw-photo-links` | deployment | No `raw.githubusercontent.com/.../photos/` reference exists in tracked text files or build output | A raw photo link is found |
| `photos.manifest` | assets | Manifest exists, matches the source structure, and references only published entries | Missing, stale, or structurally inconsistent manifest |
| `photos.limits` | assets | Every derivative exists, is WebP, and meets size/dimension limits | Missing, oversized, non-WebP, or over-dimension file |
| `photos.generated` | assets | Every file under `public/photos/generated/` is referenced by the manifest | Stale or unexpected generated file |
| `assets.local` | assets | Local `PUBLIC_URL` references resolve | Missing local public asset |
| `assets.photos` | assets | Generated gallery/featured images resolve | Missing generated photo |
| `assets.manifest` | assets | Manifest icons resolve | Missing manifest icon |
| `assets.build` | assets | Build output and manifest icons resolve | Missing build artifact |
| `privacy.no-secrets` | deployment | No committed credential patterns | Credential pattern found |
| `assistant-url` | deployment | Assistant URL is valid | Missing, insecure, or placeholder URL |
| `build` | deployment | Production build exits 0 | Build failure |
| `routes.fallback` | routes | `build/index.html` and `build/404.html` exist | Missing SPA fallback |
| `links.external` | routes | Online mode only; no hard-unreachable external links | An external link is unreachable |

## Privacy check details

`privacy.no-originals`:
- Run `git ls-files -z` from the repository root.
- Fail on any tracked path matching `(^|/)photos/` or `(^|/)photo-originals/`.
- Scan tracked and build-output raster images (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.tif`, `.tiff`) outside `ts-app/public/photos/generated/`.
- Fail if any such raster image exceeds the full-derivative limit: 500 KB or 2000 px on the longest side.
- Do not fail merely because a local, untracked private directory exists.

`privacy.no-raw-photo-links`:
- Scan tracked text files and `build/` text output.
- Fail on `raw.githubusercontent.com/isabelSoares/myWebSite/.../photos/`.
- The old `EXTERNAL_URLS` raw photo probe must be removed.

`photos.manifest`:
- Read `ts-app/photo-sources.json` and `ts-app/src/data/photo-manifest.json`.
- Compare published album IDs, order, photo count, and `sourceId` values.
- Ignore unpublished sources.
- Fail if the manifest contains a source filename, absolute path, timestamp, or remote URL.

`photos.limits`:
- Thumbnail: ≤ 120 KB, longest side ≤ 600 px.
- Full: ≤ 500 KB, longest side ≤ 2000 px.
- Both must be WebP.
- Use the image dimensions in the manifest and verify them against the actual file metadata.
- Metadata stripping is enforced by the generator; the release check verifies dimensions and size, not every metadata field.

`photos.generated`:
- Walk `ts-app/public/photos/generated/`.
- Every file must be referenced by the manifest.
- Every manifest file must exist.
- Fail on orphaned files or duplicate references.

## Expected command output

The release report must include at least these lines on success:

```text
[PASS] types - TypeScript type check passed
[PASS] types.deprecations - no deprecation warnings
[PASS] config.tsconfig - ES2020 target with node resolution suppression
[PASS] privacy.no-originals - no tracked originals
[PASS] privacy.no-raw-photo-links - no raw GitHub photo links
[PASS] photos.manifest - generated manifest matches photo sources
[PASS] photos.limits - generated derivatives meet size and dimension limits
[PASS] photos.generated - generated directory contains only manifest files
Release check: PASS (...)
```

Exact detail wording may differ, but the check IDs and pass/fail behavior are contractual.

## Failure behavior

- Any required check with status `fail` makes the command exit `1`.
- A missing prerequisite or unreadable repository makes the command exit `2`.
- The report must print the failing check ID and the offending file or value.
- The build must not be deployed when any required check fails.

## Tests

Add or update:

- `ts-app/scripts/validate-photo-privacy.test.js`
- `ts-app/scripts/validate-tsconfig.test.js`
- `ts-app/scripts/validate-site-assets.test.js`

Each test must use temporary fixtures and must not depend on the real private originals directory or the network.
