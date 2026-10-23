# Quickstart: Photo Privacy, Build Health, and Repository Profile

**Feature**: `006-photo-privacy-and-profile`  
**Purpose**: Validate the feature end-to-end without a runtime backend, a CDN account, or private originals in CI.

## Prerequisites

- Node.js 24 or newer and npm.
- Git and an authenticated `gh` CLI for the repository settings.
- A backup of the current `photos/` directory.
- The full-resolution originals for the photos you intend to publish.

All commands below run from the repository root unless they say otherwise.

## 1. Prepare private originals

Create a private directory outside the repository:

```sh
mkdir -p ../myWebSite-originals
cp -R photos ../myWebSite-originals/photos
```

Add the two featured originals to the same private store:

```sh
mkdir -p ../myWebSite-originals/photos/featured ../myWebSite-originals/photos/profile
# Copy the hero image to ../myWebSite-originals/photos/featured/hero.webp
# Copy the portrait to ../myWebSite-originals/photos/profile/portrait.webp
```

Set the private directory for the current shell:

```sh
export PHOTO_ORIGINALS_DIR="/absolute/path/to/myWebSite-originals/photos"
```

Expected:
- The private directory contains the album folders and featured images.
- Nothing under the private directory is staged in git.
- The old root `photos/` directory is still present until the generated output has been verified.

## 2. Install and generate derivatives

```sh
cd ts-app
npm install
npm run photos:build
cd ..
```

Expected:
- `ts-app/src/data/photo-manifest.json` is written.
- `ts-app/public/photos/generated/` contains two WebP files per published photo and the featured images.
- The command reports added, updated, and removed counts.
- No output is written to the repository root `photos/` directory.

Check the generated footprint:

```sh
du -sh ts-app/public/photos/generated
find ts-app/public/photos/generated -type f | wc -l
```

Expected: 14 albums, 172 album photos, 2 featured images, approximately 348 derivative files, and a total below 60 MB.

## 3. Remove originals from the public tree

Only after the generated images look correct:

```sh
git rm -r photos
```

Expected:
- `git ls-files photos` prints nothing.
- The private copy under `PHOTO_ORIGINALS_DIR` is untouched.
- `ts-app/public/photos/generated/` is staged/committed as the public image set.

Do not add `PHOTO_ORIGINALS_DIR` to git. `/photos/` and `/photo-originals/` are ignored as a safety net.

## 4. Validate the photo boundary

```sh
cd ts-app
npm run validate:photos
cd ..
```

Expected: the validator passes and reports no tracked originals, no raw GitHub photo links, a consistent manifest, and derivatives within limits.

Negative checks:

```sh
git ls-files photos
git ls-files '*.jpg' '*.jpeg' '*.png' '*.webp' '*.avif' | rg -v '^ts-app/public/photos/generated/'
rg "raw.githubusercontent.com/isabelSoares/myWebSite/.*/photos/" --glob '!node_modules' .
```

Expected: all three commands produce no matches.

## 5. Check the gallery locally

```sh
cd ts-app
npm start
```

Open <http://localhost:3000/hobbies> and verify:

- All 14 albums still appear, in the current order.
- Every album opens, navigates, and closes.
- The film strip uses thumbnails and the dialog uses the larger derivative.
- Rotated photos still display correctly.
- The hero image and the About Me portrait render.
- The copyright notice is visible without opening a photo.
- Dragging an image and opening its context menu are discouraged.
- Keyboard navigation and screen-reader labels still work.

Expected: no missing-image placeholders and no broken album layout.

## 6. Check TypeScript build health

```sh
cd ts-app
npx tsc --noEmit
npm run validate:tsconfig
cd ..
```

Expected:
- `tsc` exits 0 and prints no `deprecated` or `deprecation` message.
- `tsconfig.json` has `target: "ES2020"`, `moduleResolution: "node"`, and `ignoreDeprecations: "6.0"`.
- `npm run build` still succeeds.

## 7. Run the release check

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://assistant.workers.dev/" npm run verify:release
```

Use the real deployed assistant URL when validating production. Expected: the report passes and includes:

```text
[PASS] types
[PASS] types.deprecations
[PASS] config.tsconfig
[PASS] privacy.no-originals
[PASS] privacy.no-raw-photo-links
[PASS] photos.manifest
[PASS] photos.limits
[PASS] photos.generated
```

The exact detail text may differ; the check IDs and pass status are what matter.

## 8. Verify the repository profile

Apply the settings from `contracts/repository-profile.md`, then check:

```sh
gh repo view isabelSoares/myWebSite --json description,homepageUrl,repositoryTopics,visibility
test -f PHOTO-POLICY.md
grep -q "Photographs © Isabel Soares" README.md
grep -q "Disallow: /myWebSite/photos/" ts-app/public/robots.txt
```

Expected: the description, homepage, and topics match the contract; the README and photo policy are present; the robots rule is present.

## 9. Revocation drill

1. Choose a test photo in `ts-app/photo-sources.json`.
2. Set `"published": false`.
3. Run `npm run photos:build` and `npm run validate:photos`.
4. Start the app and confirm the photo is absent from the album.
5. Set `"published": true`, rebuild, and confirm it returns.

Expected: unpublishing removes the derivative from the current generated set and manifest. It does not delete the private original, and it does not remove copies already downloaded, cached, indexed, or stored in old git commits.

## 10. Confirm CI works without private originals

Push the branch and let the GitHub Pages workflow run, or run the release check with `PHOTO_ORIGINALS_DIR` unset.

Expected: the workflow succeeds using the committed manifest and derivatives. The generator is not required in CI.

## 11. Record the history caveat

```sh
git log --all --oneline -- photos/
```

Expected: old commits that contained originals are still listed. This feature does not rewrite history. Do not run `git filter-repo`, force-push, or recreate the repository without explicit owner approval.

## Troubleshooting

| Symptom | Likely cause | Resolution |
|---------|--------------|------------|
| `PHOTO_ORIGINALS_DIR` missing | Private store not created | Create it and point the variable at the folder containing the album directories |
| Missing source error | Curation file names a file absent from the private store | Fix the path or mark the photo unpublished |
| Oversized derivative | Source is still above the configured size after encoding | Lower quality/size limits or choose a different source |
| Manifest/source mismatch | Stale manifest after editing the curation file | Re-run `npm run photos:build` |
| Tracked original found | Old `photos/` files still in the index | Run `git rm -r photos` and commit |
| Raw GitHub link found | Old `Hobbies.tsx` or README reference remains | Replace it with the generated manifest path |
| Deprecation warning | `tsconfig.json` reverted | Restore `target: "ES2020"` and `ignoreDeprecations: "6.0"` |
