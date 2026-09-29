# Isabel Soares — Portfolio

Personal portfolio for Isabel Soares, AI Engineer and frontend developer.

The site is a static React application. It contains no application backend and
can be hosted for free with GitHub Pages.

## Run locally

Requirements: Node.js 24 or newer and npm.

```sh
cd ts-app
npm ci
npm start
```

Open <http://localhost:3000> in your browser. The development server reloads
the page as you edit the source files.

Run the checks used by the deployment workflow:

```sh
npm test -- --watchAll=false
npm run build
```

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
