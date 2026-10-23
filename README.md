# Isabel Soares — Portfolio

My Personal portfolio: AI Engineer, frontend developer, and
photographer of trips and everyday details.

**Live site:** <https://isabelsoares.github.io/myWebSite/>

The site is a static React application. It has no application backend and is
published with GitHub Pages.

## What is in the site

- **Home** — introduction, featured work, and a short overview.
- **Résumé** — experience, skills, and education.
- **Projects** — selected AI, frontend, and personal projects, including the
  AI Photographer Assistant.
- **Hobbies** — travel photography albums, interests, and the photography
  Instagram invitation.

## Technology

- React 17 with TypeScript 4.9 and Create React App 5
- React Router 6, MUI 5, MobX, and SCSS
- Node.js tooling for local photo generation, release verification, and load
  testing
- GitHub Pages for static hosting and GitHub Actions for deployment
- `sharp` (development only) for resizing photos and stripping metadata

## Run locally

Requirements: Node.js 24 or newer and npm.

```sh
cd ts-app
npm i
npm start
```

Open <http://localhost:3000>. The development server reloads as you edit.

## Verification

Run the full release check:

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release
```

The release check runs type checking without deprecation warnings, linting, Jest,
the Node release-script tests, assistant URL validation, photo privacy checks,
manifest and generated-photo validation, a production build, SPA fallback
validation, and a committed-secret scan.

Run the individual checks when iterating:

```sh
cd ts-app
npm run validate:photos       # photo privacy, manifest, and derivative limits
npm run validate:tsconfig     # accepted TypeScript target and suppression
npm test -- --watchAll=false  # Jest and React Testing Library
npm run build                 # production build
```

Run the local load smoke test after building:

```sh
npm run build
npm run load:smoke
```

It reports requests, errors, error rate, and p95 latency against the local
production build. Local results do not prove GitHub Pages capacity.

## Photos

The public site publishes only generated WebP derivatives from
`ts-app/public/photos/generated/`. The full-resolution originals live in a
private library outside this repository:

```text
../myWebSite-originals/photos/    # default, or set PHOTO_ORIGINALS_DIR
```

The curated list of published photos is `ts-app/photo-sources.json`. The
generator writes `ts-app/src/data/photo-manifest.json` and the generated
derivatives:

```sh
cd ts-app
npm run photos:build
npm run validate:photos
```

To publish or unpublish a photo, set `published` to `true` or `false` in
`photo-sources.json`, run `npm run photos:build`, and commit the source list,
manifest, and generated files. The scripts enforce WebP output, 540 px
thumbnails, 1800 px full images, size limits, and a total generated footprint
below 60 MB.

Photo usage and removal details: [PHOTO-POLICY.md](PHOTO-POLICY.md).

## Deploy with GitHub Pages

`.github/workflows/deploy-pages.yml` builds and deploys the site whenever changes
reach `main`, using Node.js 24, a fixed Ubuntu 24.04 runner, and current GitHub
Pages actions.

In the repository settings, select **Pages > Build and deployment > Source >
GitHub Actions**. The repository must be public for free GitHub Pages hosting.

### AI Photographer Assistant

The portfolio assistant uses the public Cloudflare review endpoint. Configure
its complete HTTPS URL as the repository variable `AI_ASSISTANT_URL` before
publishing. The workflow rejects missing, placeholder, local, insecure, GitHub
repository, and retired Render URLs. The checked-in
`REACT_APP_AI_ASSISTANT_URL` fallback is only for local tests.

The optional `ai_assistant_link_click` interaction name is exposed for a future
analytics integration. Navigation does not depend on analytics, and the portfolio
link does not collect uploaded photos or assistant results.

[AI Photographer Assistant project](https://github.com/isabelSoares/ai-photographer-assistant)

## TypeScript maintenance

The project targets `ES2020` so the build matches the modern browsers in its
`browserslist` policy. It still uses `moduleResolution: "node"` because the
TypeScript 4.9/CRA 5 toolchain does not support `moduleResolution: "bundler"`.

`ignoreDeprecations: "6.0"` is set only to silence the remaining `node10`
module-resolution deprecation. When TypeScript is upgraded, remove that
suppression and move to `moduleResolution: "bundler"`. `npm run validate:tsconfig`
and `npm run verify:release` fail if the accepted configuration regresses.

## Before announcing the site

1. Run `npm run verify:release` from `ts-app` with the production assistant URL.
2. Open `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path directly; refresh each one.
3. Confirm the assistant shows a plain-language error when its endpoint is unavailable.
4. Run the published-site load smoke test and record the result.

## Repository structure

```text
ts-app/                         React application
ts-app/photo-sources.json       Curated list of published photos
ts-app/src/data/                Generated photo manifest and URL helper
ts-app/public/photos/generated/ Generated WebP derivatives
ts-app/scripts/                 Build, validation, release, and load scripts
.github/workflows/              GitHub Pages deployment
specs/                          Feature specifications and implementation notes
```
