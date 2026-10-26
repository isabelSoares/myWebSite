# Scalability Report: Pre-Launch Website Verification

**Date**: 2026-10-26
**Feature**: Launch Readiness Remediation (`008-launch-readiness-remediation`)
**Target**: 1,000 simultaneous visitors across the main pages with an error rate below 1%

**Supersedes**: This report replaces the external-host assumption in the earlier 005 plan and research records. Those documents are retained as historical rationale; the current architecture uses locally generated WebP derivatives and the current footprint is 59.92 MB across 348 files.

## Summary

The site is a static GitHub Pages deployment. Photos are published as locally generated WebP derivatives: 540 px thumbnails for album strips and up to 1800 px full images loaded on demand in the dialog. The generated photo collection is 59.92 MB across 348 files, and the configured budget is now 64 MB with 4.08 MB of headroom. There is no external image host and no runtime backend.

The application build is not the capacity constraint. A local production build served 192,164 requests at 100 concurrent workers with zero errors, and 114,276 requests at 1,000 concurrent workers with a 0.28% error rate, both below the 1% target. The published host is the constraint: a single-IP burst at 100 concurrent workers triggered GitHub Pages' edge rate limiter, which returned HTTP 429 after the first few hundred requests. The 1,000-visitor target is therefore **RE-SCOPED** to GitHub Pages' host-managed edge capacity; it cannot be proven with a single-source load generator.

## Measured Results

### Local production build

| Field | Value |
|-------|-------|
| Environment | `local-build` |
| Command | `npm run load:smoke -- --concurrency=100 --duration=15` |
| Concurrency | 100 |
| Duration | 15 seconds |
| Requests | 192,164 |
| Errors | 0 |
| Error rate | 0.00% |
| p95 latency | 10.1 ms |
| Routes exercised | `/`, `/resume`, `/projects`, `/hobbies` |

| Field | Value |
|-------|-------|
| Environment | `local-build` |
| Command | `npm run load:smoke -- --concurrency=1000 --duration=10` |
| Concurrency | 1,000 |
| Duration | 10 seconds |
| Requests | 114,276 |
| Errors | 319 |
| Error rate | 0.28% |
| p95 latency | 78.3 ms |

The local runs show that the HTML shell and static bundle can absorb the target worker count on ordinary hardware. They do not model the GitHub Pages edge, TLS termination, or the visitor's network margin.

### Published site

| Field | Value |
|-------|-------|
| Environment | `published-site` |
| Address | `https://isabelsoares.github.io/myWebSite/` |
| Concurrency | 100 |
| Duration | 15 seconds |
| Requests | 6,017 |
| Errors | 4,013 |
| Error rate | 66.69% |
| p95 latency | 1,014.9 ms |
| Routes exercised | `/`, `/resume`, `/projects`, `/hobbies` |
| Result | `RE-SCOPED` |

After the burst, GitHub Pages returned `429 Rate limit exceeded` for every request from the test IP, including single sequential requests to `https://isabelsoares.github.io/`. The response carried `Retry-After: 0` and the GitHub Pages rate-limit page. A later single request was still `429` after several minutes. The same pattern occurred at 10, 25, 50, and 100 concurrent requests in a short probe.

The `--concurrency=1000` published run was cancelled: once the edge had already rate-limited the source IP, a 15-second thousand-worker run could only produce more `429` responses and would extend the block. No 100-concurrency clean run is claimed.

After the rate limit cleared, a recovery check at 10 concurrency for 5 seconds completed 954 requests with 0 errors (0.00%) and a p95 latency of 76.4 ms. This confirms published availability but does not prove the 1,000-visitor target.

### Build payload

| Asset | Size |
|-------|------|
| Generated photo collection | 59.92 MB across 348 WebP files |
| Generated budget | 64 MB, leaving 4.08 MB headroom |
| Album strip derivatives | 540 px WebP thumbnails, lazy-loaded |
| Dialog derivatives | up to 1800 px WebP, requested on demand |
| External image host | None |

## Observations

1. **Static hosting remains appropriate.** The site has no application server, database, or per-visitor backend work. GitHub Pages serves the HTML, CSS, and JavaScript from its edge cache.
2. **Photo delivery is local and bounded.** Album strips use generated 540 px thumbnails with `loading="lazy"` and `decoding="async"`. The dialog requests the larger derivative only when a frame is opened. No `raw.githubusercontent.com` or other external image host is used.
3. **The 64 MB budget has measurable headroom.** The budget is a guardrail, not a claim that every visitor downloads 59.92 MB. A visitor downloads only the featured images and the strips they scroll into view.
4. **GitHub Pages rate-limits bursts from one source.** The 429 responses are an edge protection behavior. Distributed visitors do not share one source IP, so the single-IP smoke result is not a per-visitor failure rate. It also cannot prove the 1,000-visitor target.
5. **Direct routes use the GitHub Pages custom 404.** Published `/resume`, `/projects`, and `/hobbies` responses return HTTP 404 with the SPA HTML body. Browsers render the correct section; crawlers and status-code checks see 404.

## Routing Decision

| Route | HTTP status | SPA body | Decision |
|-------|-------------|----------|----------|
| `/` | 200 | Yes | Accepted |
| `/resume` | 404 | Yes | Accepted with documented limitation |
| `/projects` | 404 | Yes | Accepted with documented limitation |
| `/hobbies` | 404 | Yes | Accepted with documented limitation |

The owner accepts the 404-with-SPA-body behavior for this launch. The visible experience is correct in browsers. Crawlers and link-status tools may report the deep routes as missing, so the limitation is recorded here rather than treated as a passing 200. Hash routing or a host with SPA rewrites would remove the limitation but would change the public URLs, which is out of scope.

## Launch Decision

- The branch build, the photo payload, and the 64 MB budget are ready for launch. Deploy the verified branch before announcing; the currently published site predates the approved top-bar correction.
- The 1,000-simultaneous-visitor target is **RE-SCOPED** to GitHub Pages' host-managed capacity. It is not proven by a single-IP smoke test and will not be claimed as proven.
- The direct-link 404 behavior is accepted with the crawler/SEO limitation documented above.
- Owner follow-up: the short published availability check passed after the rate limit cleared. If a formal 1,000-visitor proof is required, use a distributed load-testing service rather than a single source IP.

## Recommended Follow-Up

1. After deploying this branch, re-run `npm run load:smoke -- --concurrency=10 --duration=5 --url=https://isabelsoares.github.io/myWebSite/` to confirm published availability.
2. If formal capacity proof is required, use a distributed load-testing service so requests originate from many IPs.
3. If clean direct-route status codes are required, evaluate hash routing or a host that supports SPA rewrites.

## Reproduce

```sh
cd ts-app
npm run build
npm run load:smoke -- --concurrency=100 --duration=15
npm run load:smoke -- --concurrency=1000 --duration=10
npm run load:smoke -- --concurrency=100 --duration=15 --url=https://isabelsoares.github.io/myWebSite/
npm run load:smoke -- --concurrency=10 --duration=5 --url=https://isabelsoares.github.io/myWebSite/
```

The published commands can trigger GitHub Pages' rate limiter. Wait for the 429 responses to clear before retrying.
