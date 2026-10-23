# Scalability Report: Pre-Launch Website Verification

**Date**: 2026-10-23
**Feature**: Pre-Launch Website Verification
**Target**: 1,000 simultaneous visitors across the main pages with an error rate below 1%

## Summary

The static site and its build assets are small and served quickly. The photo collection is the limiting factor: it is roughly 245 MB across 202 files, with 108 files over 1 MB, and the Hobbies page hotlinks those files from `raw.githubusercontent.com`. That host is not a production image CDN. The 1,000-simultaneous-visitor target is therefore **not proven** for visitors who browse the photo albums, and the external image host remains the primary capacity risk.

## Measured Results

### Local production build

| Field | Value |
|-------|-------|
| Environment | `local-build` |
| Command | `npm run load:smoke` |
| Concurrency | 100 |
| Duration | 15 seconds |
| Requests | 192,293 |
| Errors | 0 |
| Error rate | 0.00% |
| p95 latency | 10.3 ms |

This result exercises the production build on a local static server. It shows the build output is not the bottleneck on a single machine. It does not model the GitHub Pages edge or the external photo host.

### Published site

| Field | Value |
|-------|-------|
| Environment | `published-site` |
| Address | `https://isabelsoares.github.io/myWebSite/` |
| Concurrency | 10 |
| Duration | 5 seconds |
| Requests | 1,189 |
| Errors | 0 |
| Error rate | 0.00% |
| p95 latency | 66.2 ms |
| Routes exercised | Home, Experience, Projects, Hobbies |

This was a deliberately small availability/load check, not a 1,000-visitor test. The published site served all route requests without errors during the window.

### Build payload

| Asset | Size |
|-------|------|
| Main JavaScript bundle | about 395 KB uncompressed |
| Main CSS bundle | about 24 KB uncompressed |
| Photo collection in `photos/` | about 245 MB across 202 files |
| Photos over 1 MB | 108 files |

## Observations

1. **Static hosting is appropriate.** The site has no application server, database, or per-visitor backend work. GitHub Pages can serve the HTML, CSS, and JavaScript at the target concurrency for normal portfolio traffic.
2. **The photo host is the constraint.** `raw.githubusercontent.com` is a source-code host, not an image CDN. It may throttle hotlinked traffic and provides no bandwidth guarantee. A launch spike that browses albums could be slow even when the site itself is healthy.
3. **Album images are lazy-loaded.** Offscreen strip images use `loading="lazy"` and `decoding="async"`, so the first Hobbies view does not request every full-size photo. A visitor who scrolls every album can still download a large payload.
4. **Full-size images are served as thumbnails.** The strip displays small frames but receives the original files. This is a bandwidth inefficiency, not a layout bug.
5. **Direct routes use the GitHub Pages custom 404.** The published `/resume`, `/projects`, and `/hobbies` responses return HTTP 404 with the SPA HTML body. Browsers render the correct section, but status-code checks and crawlers see 404. This is a hosting limitation, not a missing page.

## Launch Decision

- The homepage, Experience, and Projects pages are expected to handle the launch spike on GitHub Pages.
- The Hobbies photo experience is **best effort** under a large spike because of the external image host and the total photo payload.
- The 1,000-simultaneous-visitor target remains unproven until the owner runs a full published-site load test with an external load-testing tool and records the result here.

## Recommended Follow-Up

1. Move the photo collection to an image CDN or object storage with a cache and bandwidth budget.
2. Generate and serve compressed thumbnails for album strips; load the original only in the dialog.
3. Re-run the published-site load test at 1,000 concurrent visitors after the image delivery change.
4. If clean direct-route status codes are required, evaluate hash routing or a host that supports SPA rewrites.

## Reproduce

```sh
cd ts-app
npm run build
npm run load:smoke
npm run load:smoke -- --concurrency=10 --duration=5 --url=https://isabelsoares.github.io/myWebSite/
```

For the launch target, use an external load-testing tool against the published address and update the table above with the measured concurrency, error rate, and p95 latency.
