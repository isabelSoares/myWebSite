# Quickstart: Verify the Flower Browser Tab Icon

## Prerequisites

- Node.js and npm installed.
- Dependencies installed in `ts-app/`.
- A desktop browser for checking the tab and header navigation.

## Build validation

From `ts-app/`, create a production build:

```bash
npm run build
```

Expected: the build completes; generated HTML points to the flower icon under the configured `/myWebSite` public path; the icon asset is present in the build output.

## Browser validation

1. Serve the production build under `/myWebSite` or open the published portfolio.
2. Open `/myWebSite/`, `/myWebSite/resume`, `/myWebSite/projects`, and `/myWebSite/hobbies` directly in browser tabs.
3. Confirm every tab shows the flower icon and refresh each route to confirm the icon remains available.
4. Navigate between sections and confirm the flower tab icon does not change.
5. From each non-home route, activate the header `IS.` mark with pointer and keyboard; confirm it returns to the homepage.
6. If the manifest advertises tab-related icon paths, verify they refer to existing assets and do not produce a missing or contradictory icon.

Expected: `flower.ico` remains the tab icon on all tested routes and refreshes, and the existing `IS.` homepage action remains operational.
