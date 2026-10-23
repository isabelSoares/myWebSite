# Isabel Soares — Portfolio

Personal portfolio for Isabel Soares, AI Engineer and frontend developer.

The site is a static React application. It contains no application backend and
can be hosted for free with GitHub Pages.

## Run locally

Requirements: Node.js 24 or newer and npm.

```sh
cd ts-app
npm i
npm start
```

Open <http://localhost:3000> in your browser. The development server reloads
the page as you edit the source files.

Run the checks used by the deployment workflow:

```sh
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release
```

The release check runs type checking, linting, Jest, the Node release-script tests,
assistant URL validation, local asset and album-photo validation, a production build,
SPA fallback validation, and a committed-secret scan. It exits non-zero when a required check fails and prints the
exact failing file or input.

Run the local load smoke test after building:

```sh
npm run build
npm run load:smoke
```

The load smoke test starts the production build on a local static server and reports
requests, errors, error rate, and p95 latency. Use `--concurrency`, `--duration`, and
`--url` to adjust the run. Local results are labeled `local-build`; they do not prove
GitHub Pages capacity.

To preview the production build locally:

```sh
npx serve -s build
```

## Deploy with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and deploys the
site whenever changes reach `main`. It uses Node.js 24, a fixed Ubuntu 24.04
runner, and the current GitHub Pages actions.

The repository must be public for free GitHub Pages hosting. In the repository
settings, select **Pages > Build and deployment > Source > GitHub Actions**.

Published site: <https://isabelsoares.github.io/myWebSite/>

### AI Photographer Assistant 

The portfolio photo assistant uses the public Cloudflare review endpoint. Configure
its complete HTTPS URL as the repository variable `AI_ASSISTANT_URL` before
publishing. The Pages workflow rejects missing, placeholder, local, insecure,
GitHub repository, and retired Render URLs before deployment. The checked-in
`REACT_APP_AI_ASSISTANT_URL` fallback is only for local tests; production builds
must use the configured Cloudflare endpoint.

The link exposes the optional `ai_assistant_link_click` interaction name for a future
analytics integration. Navigation does not depend on analytics, and this portfolio
link does not collect uploaded photos or assistant results.

To see more about [ai-photographer-assistant project](https://github.com/isabelSoares/ai-photographer-assistant)

### Before announcing the site

1. Run `npm run verify:release` from `ts-app` with the production assistant URL.
2. Open `/`, `/resume`, `/projects`, `/hobbies`, and an unknown path directly; refresh each one.
3. Confirm the photo assistant shows a plain-language error when its endpoint is unavailable.
4. Run the published-site load test described in
   `specs/005-pre-launch-verification/quickstart.md` and record the result.

### Scalability note

The site itself is static and is served by GitHub Pages, which scales well for a personal
portfolio. Photographs are different: `photos/` is roughly 245 MB, many files are over
1 MB, and the Hobbies page hotlinks them from `raw.githubusercontent.com`. That host is
not a production image CDN and may throttle or slow down under sustained load. Album
images are lazy-loaded, but a visitor who browses every album can still download a large
payload. If traffic grows, move photos to an image CDN with compressed thumbnails before
the photo galleries are promoted heavily.

### Contribution workflow

Create a branch for each change:

```sh
git switch -c feature/my-change
```

After validating locally, push the branch and open a pull request against
`main`. Merging the pull request publishes the updated site.

## Repository structure

```text
ts-app/                 React application
.github/workflows/      GitHub Pages deployment
```
