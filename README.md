# Isabel Soares — Portfolio

Personal portfolio for Isabel Soares, AI Engineer and frontend developer.

## Local development

```sh
cd ts-app
npm ci
npm start
```

Run the validation commands before publishing:

```sh
npm test -- --watchAll=false
npm run build
```

## Deployment

The site is a static React application deployed to GitHub Pages by
`.github/workflows/deploy-pages.yml` whenever `main` changes.

Published URL: <https://isabelsoares.github.io/myWebSite/>

In the repository settings, set **Pages > Build and deployment > Source** to
**GitHub Actions**.
