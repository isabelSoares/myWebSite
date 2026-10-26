# Launch Verification Record

**Feature**: `008-launch-readiness-remediation`
**Date**: 2026-10-26
**Branch**: `fix/launch-readiness-remediation`
**Verified code commits**: `15b3d2f` (320 px top-bar fix) and `887b809` (photo budget)
**Environment**: local production build, local static preview, headless Google Chrome, and published site `https://isabelsoares.github.io/myWebSite/`
**Assistant endpoint**: `ai-photo-assistant.isabel-srsoares.workers.dev` (host only; no credentials)
**Deployed commit observed**: `c6e4b2b` (deployed 2026-10-26 via GitHub Actions run `40311592542`; includes the approved 320 px correction)

Status values: `PASS`, `FAIL`, `UNVERIFIED`, `CANCELLED`.

## Baseline composition

| Fact | Value | Source |
|------|-------|--------|
| Albums | 14 | `ts-app/src/data/photo-manifest.json` |
| Album photos | 172 | manifest |
| Featured photos | 2 | manifest |
| Total photos | 174 | manifest |
| Generated derivatives | 348 | `ts-app/public/photos/generated/` |
| Footprint before budget change | 59.92 MB (62,833,000 bytes) | filesystem |
| Configured limit before change | 60 MB | `ts-app/scripts/lib/photo-limits.js` |
| Configured limit after change | 64 MB | `ts-app/scripts/lib/photo-limits.js` |

## Automated gates

| Gate | Command | Result | Evidence |
|------|---------|--------|----------|
| Baseline release check | `REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` | `PASS` | 19 passed, 0 failed, 1 skipped (baseline run) |
| Baseline Jest suite | `npm test -- --watchAll=false` | `PASS` | 6 suites, 27 tests passed |
| Final release check | `REACT_APP_AI_ASSISTANT_URL="https://ai-photo-assistant.isabel-srsoares.workers.dev/" npm run verify:release` | `PASS` | `Release check: PASS (19 passed, 0 warnings, 1 skipped)`; every check listed below passed |
| Published deployment | `gh run watch 40311592542 --exit-status` and published checks | `PASS` | Build and deploy jobs succeeded for `c6e4b2b`; live CSS `main.414aa572.css` contains the 400 px top-bar rule; `/` 200; deep routes 404 with SPA body; 10-concurrency smoke 730 requests, 0 errors, p95 159.7 ms. |
| Assistant endpoint reachability | `curl -sS -o /dev/null -w "%{http_code}" --max-time 20 https://ai-photo-assistant.isabel-srsoares.workers.dev/` | `PASS` | HTTP 405 at root (host reachable; GET rejected) in 0.34 s; no credentials recorded. |
| Type check | `npx tsc --noEmit` | `PASS` | No diagnostics; exit status 0 |
| Lint | `npx eslint src --ext .ts,.tsx` | `PASS` | No diagnostics; exit status 0 |
| Jest | `npm test -- --watchAll=false` | `PASS` | `Test Suites: 6 passed, 6 total`; `Tests: 27 passed, 27 total` |
| Production build | `npm run build` | `PASS` | `[PASS] build - production build completed` inside `verify:release` |
| Site assets | `npm run validate:site-assets` | `PASS` | `Release check: PASS (3 passed, 0 warnings, 0 skipped)` |
| Photo scripts | `npm run test:photos` | `PASS` | Photo source/limit, photo build, and privacy tests passed |
| Photo validation | `npm run validate:photos` | `PASS` | `Release check: PASS (5 passed, 0 warnings, 0 skipped)`; `photos.total-size - 59.92 MB generated across 348 files; 4.08 MB headroom of 64.00 MB` |
| Change review | `git diff --stat d01dc84..c6e4b2b`, `git diff --check`, and `verify:release` secret scan | `PASS` | 24 files across five commits: README, the 005/006/007 records, the 007/008 specs, plans, tasks, contracts, research, and quickstarts, five photo scripts/tests, `TopBar.scss`, and the root `tasks.md` deletion. No `ts-app/public/photos/generated/` or manifest changes; no secrets detected; the only visitor-facing change is the approved 320 px top-bar correction. |

## Reconciliation of formerly open 007 tasks

| Task | Scope | Status | Evidence |
|------|-------|--------|----------|
| T008 | Featured framing at 320/768/1440 px | `PASS` | Scenario 4 below |
| T012 | Rotation metadata correction + 19-photo review | `PASS` | Metadata correction delivered earlier; 19/19 visual review passed in Scenario 5 below |
| T013 | Album direction and bounds | `PASS` | Scenario 5 below |
| T019 | Dark-mode default, persistence, no flash | `PASS` | Scenarios 1–3 below |
| T023 | All six 007 quickstart scenarios | `PASS` | Scenarios 1–6 below |
| T024 | Full release check recorded | `PASS` | `Release check: PASS (19 passed, 0 warnings, 1 skipped)` |

## Manual and visual checks

| Check | Result | Evidence |
|-------|--------|----------|
| Scenario 1: fresh visits are dark on `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path | `PASS` | All five routes resolved dark with fresh storage; document root carried `dark-mode`; theme color `#17262b`; inline `dark-mode` bootstrap is in `<head>` before `<body>`, so no wrong-theme flash. Captures: `/tmp/shots008/home-1440.png`; route checks at 320, 768, and 1440 px. |
| Scenario 2: explicit light persists across reload and route changes | `PASS` | Toggle produced `dark-mode=false`, page background `rgb(244, 240, 232)` (`#f4f0e8`), and light theme color; the light choice survived reload and navigation. Capture: `/tmp/shots008/home-light-1440.png`. |
| Scenario 3: explicit dark persists across reload and route changes | `PASS` | Toggle produced `dark-mode=true`, dark background, and `#17262b`; the explicit dark choice survived reload and navigation. |
| Scenario 4: featured framing at 320/768/1440 px | `PASS` | `/` portrait natural ratio 0.75 (1500×2000) and `/hobbies` hero natural ratio 1.124 (1800×1601) matched the rendered ratio exactly at all three widths; both photos were fully visible with no crop, stretch, forced aspect-ratio frame, or layout jump. Captures: `/tmp/shots008/home-320.png`, `home-768.png`, `home-1440.png`, `hobbies-320.png`, `hobbies-768.png`, `hobbies-1440.png`. |
| Scenario 5: album orientation, numbering, direction, bounds, and strip order | `PASS` | 19/19 EXIF-origin photos found; `stripTransform: none`, `dialogTransform: none`, `objectFit: contain`, `quarterTurnFrame: false`, `insideContent: true`; maximum rendered/natural ratio delta 0.000012; no double rotation or control overlap. Portugal strip showed 59 frames numbered 01–59 in manifest order; Previous disabled at frame 01 and Next disabled at frame 59; opening frames 01, 02, 05, and 59 matched the manifest; the strip scrolls left-to-right with the right-pointing hint. Captures: `/tmp/shots008/album-dialog-portugal-08.png`; JSON: `/tmp/preview008/album-results.json`. |
| Scenario 6: cross-cutting regression checks | `PASS` | All five routes loaded directly and refreshed without a blank page; Tab traversal reached the homepage logo, About, Experience, Projects, Hobbies, theme toggle, album frames, and dialog close/Previous/Next; nav and frame focus outlines were 2 px solid, and dialog controls showed MUI `Mui-focusVisible`/ripple. Every rendered `<img src>` on the five routes used `/photos/generated/`; no original path appeared. `privacy.no-originals`, `privacy.no-raw-photo-links`, `photos.manifest`, and `photos.limits` passed. No horizontal overflow at 320, 768, or 1440 px on `/` and `/hobbies`, and no overflow on any of the five routes at 320 px. Keyboard output: `/tmp/preview008/keyboard-results.txt`. |
| 320 px navigation overflow correction | `PASS` | Before correction, `.top-bar-box` measured 347 px against a 320 px viewport. `ts-app/src/components/top-bar/TopBar.scss` now applies a `@media (max-width: 400px)` rule; after rebuild, `scrollWidth === clientWidth` at 320, 768, and 1440 px on `/`, `/resume`, `/projects`, `/hobbies`, and the unknown path. This is the only visitor-facing source change on this branch, and the owner explicitly approved keeping it on 2026-10-26. |
| Published 320 px navigation check | `PASS` | After deploying `c6e4b2b`, headless Chrome at 320 px on `/`, `/resume`, `/projects`, `/hobbies`, and `/nope`: `clientWidth` and `scrollWidth` were 320, `.top-bar-box` measured 258.63 px, `matchMedia('(max-width: 400px)')` matched, and no horizontal overflow occurred. Live CSS `main.414aa572.css` contains the media rule. |

Visual artifacts were captured in a temporary local directory during verification; the exact routes and viewports above are the durable record.

## Capacity

| Field | Value |
|-------|-------|
| Published address | `https://isabelsoares.github.io/myWebSite/` |
| Published command | `npm run load:smoke -- --concurrency=100 --duration=15 --url=https://isabelsoares.github.io/myWebSite/` |
| Published concurrency attempted | 100 |
| Published requests | 6,017 |
| Published errors | 4,013 |
| Published error rate | 66.69% |
| Published p95 latency | 1,014.9 ms |
| Observed cause | GitHub Pages returned `429 Rate limit exceeded` after the burst; single sequential requests also returned 429 with `Retry-After: 0`. |
| Pre-deploy recovery check | After the edge limit cleared: 10 concurrency for 5 s, 954 requests, 0 errors, 0.00% error rate, p95 76.4 ms. |
| Post-deploy published check | After `c6e4b2b` deployed: 10 concurrency for 5 s, 730 requests, 0 errors, 0.00% error rate, p95 159.7 ms. |
| Highest clean published run in this session | 10 concurrency; the 100-concurrency attempt was not clean, and the 1,000 target remains unproven. |
| Local application ceiling | 1,000 concurrency for 10 s: 114,276 requests, 319 errors, 0.28% error rate, p95 78.3 ms |
| Local 100-concurrency run | 192,164 requests, 0 errors, 0.00% error rate, p95 10.1 ms |
| 1,000-concurrency published run | `CANCELLED` after the edge rate-limited the source IP; a 15 s thousand-worker run could only produce more 429s and would extend the block. |
| Target | 1,000 simultaneous visitors |
| Target status | `RE-SCOPED` to GitHub Pages' host-managed edge capacity; not claimed as proven by a single-source test |
| Routes exercised | `/`, `/resume`, `/projects`, `/hobbies` |
| Albums/assistant exercised | No |

## Routing

| Route | Status | SPA body rendered | Decision | Rationale |
|-------|--------|-------------------|----------|-----------|
| `/` | 200 | Yes | ACCEPTED | Entry point loads normally. |
| `/resume` | 404 | Yes | ACCEPTED | Visible Experience content is correct; crawler/SEO status limitation documented. |
| `/projects` | 404 | Yes | ACCEPTED | Visible content is correct; crawler/SEO status limitation documented. |
| `/hobbies` | 404 | Yes | ACCEPTED | Visible content is correct; crawler/SEO status limitation documented. |

The direct-link decision is recorded in `specs/005-pre-launch-verification/scalability-report.md`. Visitors see the correct experience in a browser; crawlers and status-code tools may report the deep routes as missing. Hash routing or an SPA-rewrite host would remove the limitation but would change public URLs, which is out of scope for this launch.

## Documentation corrections

| Artifact | Field | Previous | Corrected | Source of truth |
|----------|-------|----------|-----------|-----------------|
| `specs/007-photo-display-and-theme/data-model.md` | `Invariants` | Implied the manifest and derivatives were unchanged, contradicting the rotation metadata correction | Derivatives, album order, photo count, and privacy limits unchanged; manifest change limited to `rotation: 90` → `0` for 19 photos | Manifest and `git show dd4a057^` |
| `specs/007-photo-display-and-theme/plan.md` | `Performance Goals` | Generated footprint below 60 MB | Generated footprint below 64 MB | `ts-app/scripts/lib/photo-limits.js` |
| `specs/007-photo-display-and-theme/plan.md` | `Scale/Scope` | 174 album photos | 172 album photos plus 2 featured photos | Manifest |
| `specs/005-pre-launch-verification/scalability-report.md` | Summary, measured results, payload, observations, decision | 245 MB / 202 files, 108 files over 1 MB, external `raw.githubusercontent.com` hotlinks | 59.92 MB / 348 locally generated WebP derivatives; local concurrency measured; published single-IP burst re-scoped after GitHub Pages 429; direct-link decision recorded | Filesystem, `load:smoke`, publish responses |
| `README.md` | Photo footprint | Below 60 MB | Below 64 MB | `photo-limits.js` |
| `README.md` | Route terminology | **Résumé** | **Experience** (`/resume` route unchanged) | Site navigation |
| `specs/006-photo-privacy-and-profile/quickstart.md` | Expected footprint | Below 60 MB | Below 64 MB | `photo-limits.js` |
| `tasks.md` (repository root) | Stray task artifact | Present, obsolete README setup task list | Deleted; `README.md` still contains the local setup instructions | Repository root |
| `specs/007-photo-display-and-theme/tasks.md` | Six formerly open tasks | T008, T012, T013, T019, T023, T024 unchecked | All checked with evidence in this record | This record |
| `specs/008-launch-readiness-remediation/spec.md` | `FR-014` | Visitor-facing changes limited to photo budget/direct-link handling | Added the owner-approved 320 px top-bar correction exception | Owner approval 2026-10-26 |
| `specs/008-launch-readiness-remediation/plan.md` | Note, Technical Context, Constraints, advisory gates, Structure Decision, Performance Goals | Implied no application/visitor-facing changes and required a published 1,000-concurrency measurement | Records the approved top-bar correction and allows `RE-SCOPED`/`UNPROVEN` when the host rate-limits | This record |
| `specs/005-pre-launch-verification/scalability-report.md` | Recommended Follow-Up #1 | Told the owner to retry after the rate limit reset | Re-run after deployment; the post-deploy check is recorded | This record |

## Open items

| Item | Status | Reason | Owner action |
|------|--------|--------|--------------|
| Published 1,000-concurrency proof | `CANCELLED` | GitHub Pages returned 429 at 100 concurrent single-IP requests; a 1,000-worker run would extend the edge block and cannot model distributed visitors. The local build handled 1,000 workers with a 0.28% error rate. A 10-concurrency published check after the limit cleared was clean. | If formal proof is required, use a distributed load-testing service. A short published availability check already passed. |

## Launch decision

The verified branch was deployed as `c6e4b2b` on 2026-10-26 via GitHub Actions run `40311592542`. The published re-check passed:

- `/` returned 200; `/resume`, `/projects`, and `/hobbies` returned 404 with the SPA body, as accepted below.
- The post-deploy 10-concurrency smoke completed 730 requests with 0 errors and p95 159.7 ms.
- Live CSS `main.414aa572.css` contains the `@media (max-width: 400px)` top-bar rule.
- Headless Chrome at 320 px on all five routes reported `scrollWidth === clientWidth` (320 px), `.top-bar-box` at 258.63 px, and no horizontal overflow.

Every functional, visual, privacy, accessibility, and photo-budget check is `PASS`. The release gate passes 19 checks with 0 failures and 1 online-link check skipped. The 64 MB limit leaves 4.08 MB of headroom.

### Accepted limitations

| Limitation | Rationale | Visitor impact |
|------------|-----------|----------------|
| `/resume`, `/projects`, and `/hobbies` return 404 with the SPA body | GitHub Pages does not rewrite SPA routes; the body renders correctly | Visitors see the correct content; crawlers may report missing pages |
| Single-source 100-concurrency bursts receive GitHub Pages 429s | The edge rate limiter protects the host; distributed visitors do not share one source IP | Normal visitors are unaffected; single-IP load tests are not a capacity model |

**Decision**: Ready to announce with the accepted limitations above.
