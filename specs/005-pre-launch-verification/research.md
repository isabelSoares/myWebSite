# Phase 0 Research: Pre-Launch Website Verification

**Feature**: Pre-Launch Website Verification
**Date**: 2026-10-23

## Decision 1: Reuse the existing toolchain for readiness checks

**Decision**: Implement the repeatable readiness check as plain Node.js scripts under `ts-app/scripts/`, orchestrated by an npm script, using the existing Jest, ESLint, TypeScript, and CRA build commands.

**Rationale**: The repository already validates the assistant URL with a plain Node script and `assert`, and CI already runs tests plus a production build. Extending those patterns keeps the release check dependency-free, fast, and consistent with the existing deployment workflow. Plain Node scripts can inspect the source tree and `build/` output without a browser automation stack.

**Alternatives considered**:
- Playwright/Cypress end-to-end tests: stronger browser coverage, but adds browsers, CI minutes, and maintenance for a single static portfolio.
- A hosted link checker: catches dead external links, but requires network access, can be flaky, and cannot verify local build output.
- Manual checklist only: no repeatable pass/fail evidence and easy to skip before launch.

## Decision 2: Separate offline correctness checks from optional network checks

**Decision**: The required release check validates local references, build artifacts, routes, manifest metadata, tests, lint, and type safety without network access. External URL reachability is a separate optional check.

**Rationale**: Local checks are deterministic and can run on pull requests without failing because an unrelated third-party site is slow or rate-limited. The published site depends on `raw.githubusercontent.com` and the Cloudflare assistant endpoint, so network checks are still useful but should be reported separately from repository correctness.

**Alternatives considered**:
- Make every external URL check mandatory: catches dead links but produces false failures and slows every run.
- Skip external checks entirely: faster, but misses broken public links that a visitor would notice.

## Decision 3: Keep the current SPA routing and 404 fallback

**Decision**: Preserve the existing React Router routes and the deployment step that copies `build/index.html` to `build/404.html`.

**Rationale**: GitHub Pages serves static files and does not know about client-side routes. The existing fallback makes direct visits and refreshes on `/resume`, `/projects`, and `/hobbies` work. The release check should assert that the fallback exists in the built output.

**Alternatives considered**:
- Switch to hash routing: removes the fallback need but produces less clean URLs and changes the visitor experience.
- Add a server-side redirect layer: unnecessary for a static site and adds infrastructure.

## Decision 4: Lazy-load offscreen album images and document the external image risk

**Decision**: Keep photographs on the current external host for this launch, rely on lazy loading for album strips, and document the host's bandwidth/throttling risk. Recommend a future migration to an image CDN or optimized thumbnails if traffic or photo volume grows.

**Rationale**: The repository contains roughly 245 MB of photos, 108 files over 1 MB, and the Hobbies page can reference 172 album images. Loading every full-size image eagerly would be slow and expensive for visitors. The implemented `loading="lazy"` and `decoding="async"` attributes prevent offscreen strip images from being fetched immediately. `raw.githubusercontent.com` is not a production image CDN, so the release plan must not claim unlimited scalability for the photo experience.

**Alternatives considered**:
- Bundle photos into the Pages build: exceeds the static-site size/bandwidth budget and makes every Pages deployment carry the full collection.
- Add a thumbnail-generation dependency: effective, but a larger implementation change and a new build dependency; better as a follow-up if the launch shows meaningful photo traffic.
- Use a third-party image-resizing proxy: reduces bytes quickly but adds another external dependency and privacy/availability risk.

## Decision 5: Measure local concurrency as a smoke test, not a host-capacity guarantee

**Decision**: Provide a local concurrent-request smoke test against the production build and document an optional load-test procedure. Do not treat the local result as proof of GitHub Pages capacity.

**Rationale**: The site is static, so most scaling happens at the hosting edge. A local test can reveal client-side regressions, asset fan-out, and server misconfiguration, but it cannot reproduce GitHub Pages' CDN behavior. The release report should state what was measured and what remains host-dependent.

**Alternatives considered**:
- Hosted load-testing service: realistic external measurement, but adds credentials, cost, and an external dependency for a personal portfolio.
- No load check: avoids false confidence but leaves the owner's capacity question unanswered.

## Decision 6: Keep deployment-input validation and extend it to site assets

**Decision**: Reuse `scripts/validate-assistant-url.js` for the assistant endpoint and add `scripts/validate-site-assets.js` for local source references, manifest icons, album photo files, and build fallback files.

**Rationale**: The existing URL validator already rejects missing, insecure, local, placeholder, repository, and retired hosts. Extending validation to local assets closes the gap that allowed the manifest to reference `favicon.ico`, `logo192.png`, and `logo512.png` while only `flower.ico` existed. The release check should fail with the precise missing file path.

**Alternatives considered**:
- Rely on the browser console during manual review: misses assets that are only requested on a specific route.
- Rely only on the production build: the build succeeds even when runtime asset URLs are broken.

## Resolved Unknowns

All Technical Context items are resolved. The constitution contains no ratified gates to resolve. No `NEEDS CLARIFICATION` markers remain.
