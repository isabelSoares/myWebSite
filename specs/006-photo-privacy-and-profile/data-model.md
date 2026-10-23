# Data Model: Photo Privacy, Build Health, and Repository Profile

**Feature**: `006-photo-privacy-and-profile`  
**Date**: 2026-10-23

## Overview

The feature has two data boundaries:

1. **Private curation and source metadata** in `ts-app/photo-sources.json`, which may name private original files but contains no image bytes.
2. **Public generated output** in `ts-app/src/data/photo-manifest.json` and `ts-app/public/photos/generated/`, which contains only approved derivatives and their public metadata.

The private originals themselves live outside the repository at `PHOTO_ORIGINALS_DIR`.

## Entities

### PhotoSource

A curated reference to one original photograph.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | string | yes | Path relative to `PHOTO_ORIGINALS_DIR`, e.g. `portugal/IMG_0541.webp` |
| `alt` | string | yes | Accessible description shown in the gallery |
| `rotation` | number | no | Manual display rotation in degrees: `0`, `90`, `180`, or `270`; default `0` |
| `published` | boolean | no | Whether the photo may be published; default `true` |

**Validation**:
- `source` must be a relative path with no `..` segment and no absolute prefix.
- `source` must be unique across the entire source file.
- `alt` must be non-empty and must not be a generic placeholder such as `image`.
- `rotation` must be one of the four allowed values.
- Unpublished sources are not read from the private directory during generation.

### AlbumSource

A curated album in `photo-sources.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Stable slug used in output paths, e.g. `portugal` |
| `name` | string | yes | Display name, e.g. `Portugal` |
| `photos` | PhotoSource[] | yes | Ordered photos; order is the gallery order |

**Validation**:
- `id` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and be unique.
- `name` must be non-empty and unique.
- `photos` must contain at least one entry; an album with no published photos is omitted from the public manifest.
- The current baseline is 14 albums and 194 album photos.

### FeaturedSource

The two non-album images used on the site.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `hero` | PhotoSource | yes | Hobbies hero image |
| `portrait` | PhotoSource | yes | About Me portrait |

**Validation**:
- Each featured entry follows the same PhotoSource rules.
- A featured entry may be unpublished; the UI must then omit that image or use an approved fallback.

### PhotoSourcesFile

The committed curation file at `ts-app/photo-sources.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | Schema version; currently `1` |
| `albums` | AlbumSource[] | yes | Ordered album list |
| `featured` | FeaturedSource | yes | The two featured images |

**Validation**:
- Unknown top-level keys are rejected.
- All album and photo rules above apply.
- The file must not contain image data, base64 strings, credentials, or absolute filesystem paths.

### GeneratedImage

One published derivative pair in the manifest.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Content hash, 12 lowercase hex characters |
| `sourceId` | string | yes | Hash of the album ID/featured role plus source path; used to compare against curation without exposing the path |
| `alt` | string | yes | Copied from the source |
| `rotation` | number | yes | Copied from the source |
| `thumbnail` | GeneratedVariant | yes | Small derivative used in the film strip |
| `full` | GeneratedVariant | yes | Large derivative used in the dialog |

**Validation**:
- `id` must match `^[a-f0-9]{12}$`.
- `sourceId` must match `^[a-f0-9]{12}$`.
- `thumbnail` and `full` must be distinct paths.
- Each published PhotoSource must produce exactly one GeneratedImage.
- No unpublished PhotoSource may appear.

### GeneratedVariant

One derivative file and its dimensions.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `src` | string | yes | Public path relative to `ts-app/public`, e.g. `photos/generated/albums/portugal/a1b2c3d4e5f6-thumb.webp` |
| `width` | number | yes | Intrinsic width in pixels |
| `height` | number | yes | Intrinsic height in pixels |

**Validation**:
- `src` must start with `photos/generated/` and must not be absolute or contain `..`.
- The file must exist in `ts-app/public`.
- Thumbnail: ≤ 120 KB, longest side ≤ 600 px.
- Full: ≤ 500 KB, longest side ≤ 2000 px.
- The file must be WebP and contain no EXIF, GPS, or other personal metadata.
- The manifest must not contain a `raw.githubusercontent.com` URL or any other remote image URL.

### PhotoManifest

The generated public manifest at `ts-app/src/data/photo-manifest.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | number | yes | Manifest schema version; currently `1` |
| `generatedFrom` | string | yes | Always `photo-sources.json` |
| `albums` | GeneratedAlbum[] | yes | Albums with at least one published photo |
| `featured` | object | yes | Published featured images keyed by `hero` and `portrait` |

**Validation**:
- The manifest must be deterministic: regenerating from the same source and originals produces the same paths and ordering.
- The manifest must not include a timestamp, absolute path, private source filename, or original image bytes.
- Every album and photo in the manifest must map back to a published source using `sourceId`.
- The number of GeneratedImage entries must equal the number of published PhotoSource entries.

### GeneratedAlbum

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Copied from AlbumSource |
| `name` | string | yes | Copied from AlbumSource |
| `photos` | GeneratedImage[] | yes | Ordered public photos |

### RepositoryProfile

The public presentation of the repository.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | yes | GitHub repository description |
| `homepage` | string | yes | Live-site URL |
| `topics` | string[] | yes | GitHub topics |
| `readmeSections` | string[] | yes | Required README sections |
| `photoPolicy` | string | yes | Link to `PHOTO-POLICY.md` |

**Target values**:
- Description: `Isabel Soares's personal portfolio: React, TypeScript, AI projects, résumé, and travel photography.`
- Homepage: `https://isabelsoares.github.io/myWebSite/`
- Topics: `portfolio`, `react`, `typescript`, `personal-website`, `github-pages`, `photography`, `frontend`
- Required README sections: purpose, live site, site sections, technology, repository structure, local setup, verification, deployment, photo usage and copyright, TypeScript maintenance note
- Photo policy: ownership, permitted use, permission request, takedown, originals/derivatives statement

**Validation**:
- `gh repo view --json description,homepageUrl,repositoryTopics` must match the target values.
- The README must contain every required section heading.
- The README must state that photographs are © Isabel Soares and require permission for reuse.
- The README must link to `PHOTO-POLICY.md`.

### CompilerConfiguration

The TypeScript settings that affect build health.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target` | string | yes | Must be `ES2020` |
| `module` | string | yes | Remains `esnext` |
| `moduleResolution` | string | yes | Remains `node` until the TypeScript upgrade |
| `ignoreDeprecations` | string | yes | Must be `6.0` for the current toolchain |
| `migrationNote` | string | yes | Documents moving to `moduleResolution: "bundler"` after upgrading TypeScript |

**Validation**:
- `npx tsc --noEmit` must exit zero and must not print a deprecation warning.
- `target` must not be `ES5`.
- `moduleResolution` must be `node` while TypeScript is below 5.x.
- Removing `ignoreDeprecations` requires an accompanying TypeScript upgrade and migration.

## Relationships

```text
PhotoSourcesFile 1 ── * AlbumSource 1 ── * PhotoSource
PhotoSourcesFile 1 ── 1 FeaturedSource 1 ── 2 PhotoSource
PhotoSource 1 ── 1 GeneratedImage 1 ── 2 GeneratedVariant
PhotoManifest 1 ── * GeneratedAlbum 1 ── * GeneratedImage
RepositoryProfile 1 ── 1 GitHub repository settings
RepositoryProfile 1 ── 1 README.md
RepositoryProfile 1 ── 1 PHOTO-POLICY.md
CompilerConfiguration 1 ── 1 ts-app/tsconfig.json
```

## State Transitions

### Photo publication

```text
Private original
    │ add to photo-sources.json with published=true
    ▼
Published derivative + manifest entry
    │ set published=false or remove source entry; run photos:build
    ▼
Unpublished / removed from current build
    │ commit + deploy
    ▼
Unavailable at the current site URL
```

Notes:
- The original remains in private storage until the owner deletes it.
- Old copies may remain in git history, browser caches, search indexes, or downloads. The feature cannot revoke those.
- Unpublishing is not the same as deleting the private original.

### Album visibility

```text
Album with ≥1 published PhotoSource → visible in gallery
Album with 0 published PhotoSources     → omitted from manifest and gallery
```

### Featured image visibility

```text
published=true  → rendered from generated manifest
published=false → omitted or replaced with an approved fallback
```

### Compiler configuration

```text
Current: target=ES2020, moduleResolution=node, ignoreDeprecations=6.0
    │ future TypeScript upgrade
    ▼
Target: target=ES2020, moduleResolution=bundler, no suppression
```

The migration is documented now but is not executed in this feature.
