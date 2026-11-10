# Isabel Soares — Portfolio

My Personal portfolio: AI Engineer, frontend developer, and
photographer of trips and everyday details.

**Live site:** <https://isabelsoares.github.io/myWebSite/>

The portfolio frontend is a static React application published with GitHub
Pages. The AI Photographer Assistant sends submitted photos to a separately
deployed Cloudflare Worker; this repository does not contain that service.

## What is in the site

- **Home** — introduction, profile, selected impact, and a personal overview.
- **Experience** — roles, skills, and education.
- **Projects** — selected AI, frontend, and personal projects, including the
  AI Photographer Assistant, CV Photo AI, and AgentFlow AI.
- **Hobbies** — travel photography albums, interests, and the photography
  Instagram invitation.

## Technology

- React 17 with TypeScript 4.9 and Create React App 5
- React Router 6, MUI 5, and SCSS
- Node.js tooling for local photo generation, release verification, and load
  testing
- `axe-core` development checks for route-level accessibility coverage
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

The default appearance is dark when no `dark-mode` preference is saved. An
explicit light or dark choice is retained in browser storage. To test the dark
default locally, use a fresh private window or run `localStorage.removeItem('dark-mode')`
in the browser console before reloading.

## Accessibility

The site includes a skip-to-content link, semantic primary navigation, route
titles and announcements, keyboard focus management, named photo dialogs,
reduced-motion support, and theme contrast checks.

Run the accessibility checks from `ts-app/`:

```sh
npm run validate:theme-accessibility
npm test -- --watchAll=false
```

The Jest suite includes `axe-core` checks for the home, experience, projects,
hobbies, and not-found routes in both light and dark modes. App tests also
exercise keyboard navigation and appearance toggling. The theme validator
checks WCAG AA contrast tokens and visible keyboard focus styles. Narrow-screen
browser checks should include horizontal reflow and keyboard focus visibility;
automated checks do not replace manual screen-reader testing.

## Verification

Run the full release check:

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release -- --online
```

The release check runs type checking without deprecation warnings, linting, Jest,
axe-core accessibility checks, the Node release-script tests, assistant URL
validation, photo privacy checks, theme contrast and keyboard-focus validation,
manifest and generated-photo validation, a production build, SPA fallback
validation, and a committed-secret scan. `--online` also probes configured
external URLs; anti-bot responses are reported as warnings.

Run the individual checks when iterating:

```sh
cd ts-app
npm run validate:photos       # photo privacy, manifest, and derivative limits
npm run validate:tsconfig     # accepted TypeScript target and suppression
npm run validate:theme-accessibility # WCAG contrast and focus-style checks
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
manifest, and generated files. The scripts enforce WebP output, thumbnails up
to 540 px wide / 600 px on the longest side (120 KiB maximum), full images up
to 1800 px wide / 2000 px on the longest side (500 KiB maximum), and a total
generated footprint below 64 MiB. Generated images are re-encoded without
source metadata.

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
analytics integration; no analytics provider is wired into the portfolio.
Submitted photos are sent to the configured external endpoint for analysis. The
portfolio frontend does not persist the submitted image or review result;
retention by the Worker and its inference provider must be verified separately.

### Project repositories

The Projects page links to these public repositories, and the release check
verifies their addresses:

- [AI Photographer Assistant](https://github.com/isabelSoares/ai-photographer-assistant)
- [CV Photo AI](https://github.com/isabelSoares/cv-detect-people-my-gallery)
- [AgentFlow AI](https://github.com/isabelSoares/agentflow-ai)

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
2. Run `npm run verify:release -- --online` and review any external-link warnings.
3. Use a fresh private window with the OS set to light and open `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path directly; refresh each one.
4. Confirm dark mode appears before first paint, the light toggle persists, keyboard focus works, and the photo dialog is announced correctly.
5. Check the deployed mobile/PWA browser chrome and manifest colors.
6. Confirm the assistant shows a plain-language error when its endpoint is unavailable.
7. Run the published-site load smoke test and record the result.

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
