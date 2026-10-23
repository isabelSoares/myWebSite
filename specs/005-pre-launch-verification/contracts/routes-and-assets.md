# Contract: Routes and Assets

## Purpose

Defines the public navigation, direct-load, asset, and identity behavior the release check verifies.

## Base Path

The published site is served beneath `/myWebSite/`. All internal links and assets MUST respect `process.env.PUBLIC_URL` or the configured router base path. No absolute asset URL may assume a domain root.

## Routes

| Path | Section | Direct load | Expected content |
|------|---------|-------------|------------------|
| `/` | Home | MUST work | Introduction, portrait, navigation, contact links |
| `/resume` | Experience | MUST work | Experience content, contact link, section anchors |
| `/projects` | Projects | MUST work | Project cards, GitHub links, embedded photo assistant |
| `/hobbies` | Hobbies | MUST work | Interests, hero photo, photo albums, Instagram link |
| any other path | Not found | MUST fall back | `404.html` serving the SPA, which renders the homepage shell without a server error |

**Rules**:

- Direct requests and refreshes on every main route MUST return the SPA, not a host 404 page.
- GitHub Pages serves the custom `404.html` with an HTTP 404 status while rendering the SPA. A direct route is acceptable when the visible section renders, even though the status code is 404.
- Navigation MUST move focus/scroll to the top of the destination section.
- The `ScrollToTop` behavior MUST not interfere with in-page anchors on the Experience section.

## Assets

### Local public assets

| Reference | Location | Required |
|-----------|----------|----------|
| `flower.ico` | `ts-app/public/` | Yes |
| `clover-four-leaf.ico` | `ts-app/public/` | No |
| `photos/IMG_7833.webp` | `ts-app/public/photos/` | Yes |
| `photos/1BB3E15D-4298-4C6F-8739-81386C84431E.webp` | `ts-app/public/photos/` | Yes |
| `manifest.json` | `ts-app/public/` | Yes |
| `robots.txt` | `ts-app/public/` | Yes |

### Manifest identity

- `short_name` and `name` MUST identify Isabel Soares.
- Every icon entry MUST reference a file that exists in `public/`.
- The browser tab icon MUST remain `flower.ico`.
- `theme_color` and `background_color` MUST remain set.

### Album photos

- Every photo path produced by `albumPhotos(country, files)` MUST exist beneath `photos/<country>/`.
- Offscreen album strip images MUST use lazy loading.
- The dialog MUST show the selected image and provide previous/next controls with disabled states at the ends.

### External dependencies

| Dependency | Required for primary pages | Failure behavior |
|------------|----------------------------|------------------|
| `raw.githubusercontent.com` photo URLs | No | Missing photos may degrade albums; the rest of the page MUST remain usable |
| Photo assistant endpoint | No | Plain-language error, retry available, rest of site remains usable |

## Assistant Endpoint Contract

The endpoint is supplied through `REACT_APP_AI_ASSISTANT_URL` and validated before build.

- MUST be an absolute HTTPS URL.
- MUST NOT contain credentials.
- MUST NOT point to localhost, a private address, a placeholder, a GitHub repository, or a retired Render host.
- When missing or invalid in a production validation run, the release check MUST fail.

## Identity and Share Metadata

- The document title MUST identify Isabel Soares.
- The description meta tag MUST describe the portfolio.
- The manifest and document title MUST use the same public identity.
- Icons MUST load at the published base path and after a refresh.
