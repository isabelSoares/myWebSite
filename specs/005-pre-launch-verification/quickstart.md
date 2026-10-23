# Quickstart: Pre-Launch Verification

This guide proves the portfolio is ready to announce. It covers the automated release check, a manual browser pass, and a local concurrency smoke test.

## Prerequisites

- Node.js 24 or newer
- npm
- A clean checkout of `chore/pre-launch-verification`
- Network access for the first `npm ci`
- The production assistant URL available when testing a deployment build

## 1. Install and run the release check

```sh
cd ts-app
npm ci
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release
```

Expected final line:

```text
Release check: PASS (X passed, Y warnings, Z skipped)
```

If any required check fails, the output names the exact file, route, or input to fix. Re-run the command after fixing it. Do not announce the site while the command exits non-zero.

## 2. Inspect the report details

The release check follows the contract in [contracts/release-verification.md](./contracts/release-verification.md). Confirm that it reports:

- Type safety, lint, Jest, and the Node release-script tests pass.
- The assistant URL is valid when supplied.
- All local public assets resolve.
- All album photos exist beneath `photos/`.
- Manifest icons exist in both `public/` and `build/`.
- The production build succeeds.
- `build/index.html` and `build/404.html` exist.
- No committed secrets are detected.

Treat a `WARN` about the external image host as expected for this launch. It records a known capacity dependency, not a build failure.

## 3. Verify the production build in a browser

```sh
cd ts-app
npm run build
npx serve -s build
```

Open the local URL and check each route directly:

| Route | What to confirm |
|-------|-----------------|
| `/` | Introduction, portrait, navigation, and contact links render |
| `/resume` | Experience content, contact link, and anchors work |
| `/projects` | Project cards, GitHub links, and the photo assistant render |
| `/hobbies` | Hero image, all album strips, dialogs, and Instagram link work |
| Unknown path | The SPA loads without a host-level error page |

For each route, also refresh the page and confirm it still loads. Open the browser developer tools and confirm there are no failed local asset requests and no uncaught errors.

GitHub Pages serves a direct route such as `/myWebSite/resume` with HTTP status 404 while
returning the SPA HTML from `404.html`. Browsers still render the Experience page. Verify
the visible content, not only the HTTP status code.

## 4. Verify the published base path

The site is published beneath `/myWebSite/`. Confirm that icons, manifest entries, and local photos resolve when served from that path. A build run without the base path is not sufficient evidence.

## 5. Verify failure behavior

1. Open `/projects` with the assistant endpoint unreachable.
2. Confirm the assistant shows a plain-language error and a retry action.
3. Confirm the rest of the Projects page and all other routes still work.

## 6. Run the concurrency smoke test

Run the local smoke test against the production build:

```sh
cd ts-app
npm run load:smoke
```

The command reports the number of requests, error count, and latency summary. A clean local result shows the site and its assets are not the bottleneck on a single machine.

This is a `local-build` result. It does not prove GitHub Pages capacity. For the authoritative scalability check, run the same scenario against the published address with an external load-testing tool and record:

- Concurrent visitors
- Duration
- Error rate
- p95 response time
- Whether albums or the assistant were exercised

The launch target is 1,000 simultaneous visitors across the main pages with an error rate below 1%. Results from the published address are the only ones that count toward that target.

## 7. Make the launch decision

Launch only when:

- The release check exits `0`.
- Every main route loads directly and after refresh.
- No local asset request fails.
- The assistant failure path is usable.
- The published-site load result meets the target, or the owner accepts the documented external-image limitation.

If any item fails, fix it and repeat the relevant section before announcing the site.
