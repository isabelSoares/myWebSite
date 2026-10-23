# Contract: Photo Publishing Pipeline

**Feature**: `006-photo-privacy-and-profile`  
**Schemas**: [photo-sources.schema.json](./photo-sources.schema.json), [photo-manifest.schema.json](./photo-manifest.schema.json)

## Purpose

Define the boundary between private originals and the public repository. The pipeline must be reproducible locally, must not require private originals in CI, and must make it impossible for a normal release check to pass while full-resolution originals are tracked in the repository.

## Inputs

| Input | Location | Committed | Description |
|-------|----------|-----------|-------------|
| Private originals | `PHOTO_ORIGINALS_DIR` (default `../myWebSite-originals/photos`) | No | Full-resolution source files outside the repository |
| Curation file | `ts-app/photo-sources.json` | Yes | Album order, source-relative paths, alt text, rotations, publication flags |
| Limits | `ts-app/scripts/lib/photo-limits.js` | Yes | Shared size and dimension limits |
| Generator | `ts-app/scripts/build-photos.js` | Yes | Local-only derivative builder |

The private directory layout mirrors the `source` values in the curation file:

```text
<PHOTO_ORIGINALS_DIR>/
├── portugal/
│   ├── IMG_0541.webp
│   └── ...
├── usa/
│   └── ...
├── featured/
│   └── hero.webp
└── profile/
    └── portrait.webp
```

## Curation file example

```json
{
  "version": 1,
  "albums": [
    {
      "id": "portugal",
      "name": "Portugal",
      "photos": [
        {
          "source": "portugal/IMG_0541.webp",
          "alt": "Portugal photo 1",
          "rotation": 0,
          "published": true
        }
      ]
    }
  ],
  "featured": {
    "hero": {
      "source": "featured/hero.webp",
      "alt": "Sunset and a person jumping",
      "published": true
    },
    "portrait": {
      "source": "profile/portrait.webp",
      "alt": "Isabel Soares",
      "published": true
    }
  }
}
```

Rules:
- `source` is relative to `PHOTO_ORIGINALS_DIR`, uses `/`, and must not contain `..`.
- Source paths must be unique across albums and featured entries.
- `published: false` excludes the photo from the manifest and removes its derivatives on the next build.
- The file must never contain image bytes, base64 data, credentials, or absolute paths.

## Outputs

| Output | Location | Committed | Description |
|--------|----------|-----------|-------------|
| Thumbnail | `ts-app/public/photos/generated/albums/<album>/<hash>-thumb.webp` | Yes | ≤ 540 px, ≤ 120 KB |
| Full derivative | `ts-app/public/photos/generated/albums/<album>/<hash>.webp` | Yes | ≤ 1800 px, ≤ 500 KB |
| Featured thumbnail | `ts-app/public/photos/generated/featured/<role>-<hash>-thumb.webp` | Yes | ≤ 540 px, ≤ 120 KB |
| Featured full | `ts-app/public/photos/generated/featured/<role>-<hash>.webp` | Yes | ≤ 1800 px, ≤ 500 KB |
| Manifest | `ts-app/src/data/photo-manifest.json` | Yes | Public paths, dimensions, alt text, rotations |

Output rules:
- `<hash>` is 12 lowercase hex characters derived from the source file content.
- `<role>` is `hero` or `portrait`.
- The generator writes only under `ts-app/public/photos/generated/`; it must never write into the repository root `photos/` directory.
- The generator removes stale files under `public/photos/generated/` that are not referenced by the new manifest. It must not delete unrelated public assets.
- The manifest must not contain source filenames, absolute paths, timestamps, or remote URLs. `sourceId` is a one-way hash used only for source/manifest consistency checks.

## Generation commands

Run from `ts-app`:

```sh
export PHOTO_ORIGINALS_DIR="/absolute/path/to/myWebSite-originals/photos"
npm run photos:build
```

The command must:
1. Load and validate `photo-sources.json` against the source schema.
2. Resolve every published source under `PHOTO_ORIGINALS_DIR`; fail with the missing path if any is absent.
3. Decode each source, auto-orient via EXIF, strip metadata, resize without enlargement, and encode WebP.
4. Produce the thumbnail and full derivative with the content hash name.
5. Write the manifest atomically only after every image succeeds.
6. Remove stale generated files and report added, updated, and removed counts.
7. Exit non-zero on any validation, decode, encode, or write failure.

The command must not require network access and must not print or commit private absolute paths.

## Validation command

Run from `ts-app`:

```sh
npm run validate:photos
```

The validator must work without `PHOTO_ORIGINALS_DIR` and must fail when:

- any tracked path is under `photos/` or `photo-originals/`;
- any source, README, or workflow references `raw.githubusercontent.com/.../photos/`;
- the manifest and curation file disagree on album IDs, ordering, photo counts, or `sourceId` values;
- a manifest file is missing, not WebP, too large, or too high-resolution;
- the generated directory contains a file not referenced by the manifest;
- the manifest contains a remote URL, absolute path, or original source filename;
- a featured entry is missing when its source is published.

The validator is part of `npm run verify:release` and must not depend on private originals.

## Revocation procedure

1. Set the photo's `published` value to `false`, or remove the entry from `photo-sources.json`.
2. Run `npm run photos:build` with the private originals available.
3. Run `npm run validate:photos`.
4. Commit the updated manifest and generated directory.
5. Deploy.

Expected result:
- The photo is absent from the current build and repository tree.
- The original remains in private storage unless the owner deletes it.
- Old copies may remain in git history, caches, search indexes, or prior downloads. The pipeline does not and cannot revoke those.

## Failure behavior

| Failure | Result |
|---------|--------|
| Missing curation file | Exit non-zero; no output changes |
| Invalid JSON or schema violation | Exit non-zero; no output changes |
| Missing published source | Exit non-zero; no manifest write |
| Unsupported image | Exit non-zero; no manifest write |
| Output exceeds limits after encoding | Exit non-zero; do not commit the oversized derivative |
| Stale generated file cannot be removed | Exit non-zero and report the path |
| Private originals unavailable in CI | Generator is not run; validation uses the committed manifest |

## Security rules

- Never add `PHOTO_ORIGINALS_DIR` content to git.
- Never print image bytes or base64 in logs.
- Never store credentials or signed URLs in the repository.
- Never publish a manifest entry for an unpublished source.
- Never treat the pipeline as access control: it protects originals and reduces casual reuse, not screenshots.
