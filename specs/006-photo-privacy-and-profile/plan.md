# Implementation Plan: Photo Privacy, Build Health, and Repository Profile

**Branch**: `006-photo-privacy-and-profile` | **Date**: 2026-10-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-photo-privacy-and-profile/spec.md`

**Note**: This plan keeps the portfolio on static GitHub Pages. It does not add a runtime backend or secrets. Originals move outside the public repository, approved derivatives are generated locally and committed, and release verification enforces the boundary.

## Summary

Implement a local photo-publishing pipeline that keeps full-resolution originals outside the public repository and publishes only metadata-stripped, web-sized WebP derivatives. The gallery reads a generated manifest of derivatives, keeps its current albums and navigation, and adds a visible copyright notice plus low-friction download deterrence. Repository presentation is updated through the README, a dedicated photo policy, and GitHub repository settings. The TypeScript target moves to ES2020 and the remaining `moduleResolution` deprecation is explicitly suppressed for the current TypeScript 4.9/CRA toolchain, with a documented migration follow-up.

The approach is deliberately static: no signed-URL service, no image CDN account, and no build-time network dependency. Revoking a photo means setting it unpublished (or removing it from the source list), regenerating derivatives, committing the result, and deploying. That removes it from the current site and repository, but cannot remove copies already downloaded, cached, or present in old git history.

## Technical Context

**Language/Version**: TypeScript 4.9.5, React 17.0.2, Node.js 24, SCSS

**Primary Dependencies**: `react-scripts` 5.0.1, MUI 5, `react-router-dom` 6, `web-vitals`; new local-tooling dependency: `sharp` for derivative generation and image metadata inspection

**Storage**: Private originals in a local directory outside the repository (`PHOTO_ORIGINALS_DIR`, default `../myWebSite-originals/photos`); generated WebP derivatives under `ts-app/public/photos/generated/`; generated manifest at `ts-app/src/data/photo-manifest.json`; no runtime database or object-store dependency

**Testing**: Jest + React Testing Library through `react-scripts test`; Node `assert` script tests; release verification through `npm run verify:release`; TypeScript type check through `npx tsc --noEmit`

**Target Platform**: Static GitHub Pages site at `https://isabelsoares.github.io/myWebSite/`; modern browsers per the existing `browserslist` production policy

**Project Type**: Static web application with local build/publishing tooling

**Performance Goals**: Thumbnail derivatives ≤ 120 KB and ≤ 600 px on the longest side; full derivatives ≤ 500 KB and ≤ 2000 px on the longest side; keep gallery images lazy-loaded; avoid layout shift by storing width/height in the manifest; keep the generated public photo set below 60 MB

**Constraints**: No server runtime, no committed credentials, no private originals in CI, GitHub Pages artifact limit (1 GB), TypeScript 4.9 compatibility with CRA 5, accessibility must not regress, revocation limited to the current deploy and repository state

**Scale/Scope**: 14 albums and 172 album photos currently listed in `Hobbies.tsx`, plus 2 featured images (hero and portrait); approximately 348 generated derivatives (thumbnail + full per photo)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution at `.specify/memory/constitution.md` is still the unfilled template: it has placeholder principle names, placeholder descriptions, and placeholder version/ratification fields. There are no ratified gates to evaluate.

**Gate result: PASS with advisory gates.** Until the constitution is ratified, this plan applies the feature specification's own gates:

- **Privacy**: Originals must not be tracked in the public repository or included in build output.
- **Static hosting**: The solution must work on GitHub Pages without a runtime backend or repository secrets.
- **Accessibility**: Gallery navigation, keyboard use, and screen-reader labels must remain functional.
- **Testability**: The photo boundary, compiler configuration, and release checks must have automated tests.
- **Performance**: Generated derivatives must stay within documented size and dimension limits.
- **Traceability**: Repository profile text, photo policy, and release checks must match the implemented behavior.

No constitution violations or complexity exceptions are required.

**Post-design re-check: PASS.** The Phase 1 design adds a local generator, a generated manifest, and release validators. It introduces no runtime backend, no committed secrets, no new public originals, and no accessibility regression. The added complexity is limited to the static publishing boundary required by the feature.

## Project Structure

### Documentation (this feature)

```text
specs/006-photo-privacy-and-profile/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── photo-pipeline.md
    ├── photo-sources.schema.json
    ├── photo-manifest.schema.json
    ├── repository-profile.md
    └── release-verification.md
```

### Source Code (repository root)

```text
ts-app/
├── package.json                       # add photos:build, validate:photos, test:photo-privacy, test:tsconfig
├── tsconfig.json                      # target es2020; ignoreDeprecations 6.0
├── photo-sources.json                 # committed curation input: albums, private source names, rotations, publish flags
├── src/
│   ├── data/
│   │   └── photo-manifest.json        # generated: public derivative paths, dimensions, alt text, rotation
│   ├── components/
│   │   ├── about-me/AboutMe.tsx       # featured portrait from generated manifest
│   │   ├── hobbies/Hobbies.tsx        # albums/hero from generated manifest; copyright notice
│   │   ├── hobbies/PhotoAlbum.tsx     # thumbnail/full images; draggable=false; context-menu deterrence
│   │   ├── hobbies/Hobbies.scss
│   │   └── hobbies/PhotoAlbum.scss
│   └── components/personal-projects/PhotoAssistant.tsx  # verify privacy statement remains accurate
├── public/
│   ├── photos/
│   │   └── generated/                 # generated derivatives only; committed
│   │       ├── albums/<album>/<hash>-thumb.webp
│   │       ├── albums/<album>/<hash>.webp
│   │       └── featured/
│   └── robots.txt                     # discourage indexing of published photographs
└── scripts/
    ├── lib/
    │   ├── photo-limits.js            # shared size/dimension limits
    │   └── photo-manifest.js          # manifest/source validation helpers
    ├── build-photos.js                # local-only derivative generator
    ├── validate-photo-privacy.js       # tracked-original, raw-link, derivative checks
    ├── validate-photo-privacy.test.js
    ├── validate-tsconfig.js
    ├── validate-tsconfig.test.js
    ├── validate-site-assets.js         # validate generated photos and featured references
    └── validate-site-assets.test.js
├── README.md                          # complete repository profile and photo policy
├── PHOTO-POLICY.md                    # ownership, permitted use, permission request, takedown
├── .gitignore                         # ignore local originals and accidental photo folders
└── .github/workflows/deploy-pages.yml # unchanged deployment path; release checks run before build
```

**Structure Decision**: Keep the existing single-project static web application. Add a small local publishing toolchain under `ts-app/scripts/` and put generated assets under `ts-app/public/photos/generated/`. Originals stay outside the repository. This avoids a second application, a backend service, or an account-based image host.

## Design Decisions

### Photo publishing pipeline

- `ts-app/photo-sources.json` is the curation source of truth. It contains album IDs, display names, source folders, source filenames, alt text, manual rotation values, and a `published` flag.
- `ts-app/scripts/build-photos.js` reads the source list and `PHOTO_ORIGINALS_DIR`.
  - It verifies every published source exists.
  - It auto-orients from EXIF, strips metadata, resizes without enlargement, and writes WebP derivatives.
  - It generates a 540 px thumbnail and an 1800 px full derivative.
  - It names files with a content hash so replaced images get new URLs.
  - It writes `ts-app/src/data/photo-manifest.json` and removes stale generated files from `public/photos/generated/`.
- The script is local-only. CI consumes the committed manifest and derivatives; it never needs private originals.
- If a photo is unpublished, its source entry is marked unpublished or removed, the generator cleans its derivatives, and the manifest no longer references it. This is the revocation mechanism.

### Gallery and featured images

- `PhotoAlbum.tsx` uses the thumbnail in the film strip and the full derivative in the dialog. Both are local, lazy-loaded where appropriate, and include stored width/height to reduce layout shift.
- `Hobbies.tsx` imports the generated manifest instead of hardcoding external raw GitHub URLs.
- `AboutMe.tsx` and the Hobbies hero use generated featured entries.
- Existing albums, order, rotations, and dialog navigation are preserved.
- A visible notice states that the photographs are © Isabel Soares and may not be reused without permission.
- Deterrence is intentionally lightweight: `draggable={false}`, `onDragStart` prevention, `onContextMenu` prevention on gallery images, and CSS `user-select: none; -webkit-user-drag: none;`. No global right-click blocking, no canvas-only rendering, and no watermark by default.

### Repository profile

- Rewrite `README.md` with purpose, live site, main sections, technology summary, repository structure, local setup, verification commands, deployment, photo policy, and a TypeScript maintenance note.
- Add `PHOTO-POLICY.md` with ownership, permitted use, permission requests, and takedown instructions.
- Update the GitHub repository through `gh repo edit`:
  - Description: `Isabel Soares's personal portfolio: React, TypeScript, AI projects, résumé, and travel photography.`
  - Homepage: `https://isabelsoares.github.io/myWebSite/`
  - Topics: `portfolio`, `react`, `typescript`, `personal-website`, `github-pages`, `photography`, `frontend`
- Add `Disallow: /myWebSite/photos/` to `ts-app/public/robots.txt` to discourage image indexing. This is advisory and does not prevent direct access.

### TypeScript build health

- Set `compilerOptions.target` to `ES2020` in `ts-app/tsconfig.json`.
- Keep `moduleResolution: "node"` because the project uses TypeScript 4.9.5 and CRA 5; `bundler` resolution requires a TypeScript upgrade.
- Add `"ignoreDeprecations": "6.0"` to silence the remaining `node10` deprecation for the current toolchain.
- Document in README that the suppression is temporary and that upgrading TypeScript enables `moduleResolution: "bundler"`.
- Add `scripts/validate-tsconfig.js` and integrate it into `verify:release` so the target and suppression cannot silently regress.
- Extend release verification to fail if `tsc --noEmit` prints a deprecation warning, not only when it exits non-zero.

### Verification and release checks

- Update `validate-site-assets.js` to validate the generated manifest and local derivative files, not the old root `photos/` directory.
- Add `validate-photo-privacy.js` to fail when:
  - any tracked path is under `photos/` or `photo-originals/`;
  - any tracked or build-output raster image outside `public/photos/generated/` exceeds the full-derivative limit;
  - any source references a `raw.githubusercontent.com/.../photos/` URL;
  - a manifest image is missing, too large, or too high-resolution;
  - generated output contains stale or unexpected files;
  - the manifest and source list disagree on album/photo structure.
- Add Node tests for the privacy validator and tsconfig validator.
- Update `verify-release.js` to run both validators and include the results in the release report.
- Keep the existing CI workflow path and release command unchanged; the new checks run inside `npm run verify:release`.

### Migration and history

- Copy the current root `photos/` directory to `../myWebSite-originals/photos` before removing it from git.
- Remove the tracked root `photos/` directory and the tracked `.DS_Store` under it.
- Add `/photos/` and `/photo-originals/` to `.gitignore` as a safety net.
- Previously committed originals remain in git history. Removing them from the current tree is not a history rewrite. The plan does not rewrite history; `PHOTO-POLICY.md` and the README will state that old commits and caches may still contain earlier copies, and a separate history-rewrite decision is required if that is unacceptable.

## Complexity Tracking

No constitution violations. The only added complexity is a local build script and a generated manifest, both justified by the requirement to keep originals out of the public repository while preserving a static GitHub Pages deployment.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
