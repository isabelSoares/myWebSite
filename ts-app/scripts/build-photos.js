const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const {
  GENERATED_PHOTOS_DIR,
  PHOTO_MANIFEST_PATH,
  PHOTO_SOURCES_PATH,
  PUBLIC_DIR,
  REPO_ROOT,
} = require('./lib/routes');
const {
  hash12,
  isPublished,
  loadPhotoSources,
  sourceIdFor,
  writeJsonAtomic,
} = require('./lib/photo-manifest');
const { FULL_LIMITS, THUMBNAIL_LIMITS } = require('./lib/photo-limits');

const ORIGINALS_DIR = process.env.PHOTO_ORIGINALS_DIR
  ? path.resolve(process.env.PHOTO_ORIGINALS_DIR)
  : path.resolve(REPO_ROOT, '..', 'myWebSite-originals', 'photos');

function resolveOriginal(source) {
  const root = ORIGINALS_DIR.endsWith(path.sep) ? ORIGINALS_DIR : `${ORIGINALS_DIR}${path.sep}`;
  const fullPath = path.resolve(ORIGINALS_DIR, source);
  if (!fullPath.startsWith(root)) {
    throw new Error(`source escapes PHOTO_ORIGINALS_DIR: ${source}`);
  }
  return fullPath;
}

function qualitiesFor(limits) {
  const start = Math.min(100, Math.max(20, Math.round(limits.quality)));
  const qualities = [];
  for (let quality = start; quality >= 20; quality -= 2) {
    qualities.push(quality);
  }
  return qualities;
}

async function encodeVariant(sourcePath, destination, limits, label, { publicDir = PUBLIC_DIR } = {}) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  let lastSize = 0;

  for (const quality of qualitiesFor(limits)) {
    const buffer = await sharp(sourcePath, { failOn: 'none' })
      .rotate()
      .resize({
        width: limits.width,
        height: limits.maxDimension,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toBuffer();

    lastSize = buffer.length;
    if (buffer.length > limits.maxBytes) continue;

    const temporary = `${destination}.tmp-${process.pid}`;
    try {
      fs.writeFileSync(temporary, buffer);
      fs.renameSync(temporary, destination);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }

    const info = await sharp(buffer).metadata();
    return {
      src: path.relative(publicDir, destination).split(path.sep).join('/'),
      width: info.width,
      height: info.height,
      bytes: buffer.length,
    };
  }

  throw new Error(`${label} exceeds ${limits.maxBytes} bytes after quality fallbacks (last ${lastSize} bytes)`);
}

async function buildPhotoVariant(sourcePath, baseDestination, label) {
  const thumbnailPath = `${baseDestination}-thumb.webp`;
  const fullPath = `${baseDestination}.webp`;
  const [thumbnail, full] = await Promise.all([
    encodeVariant(sourcePath, thumbnailPath, THUMBNAIL_LIMITS, `${label} thumbnail`),
    encodeVariant(sourcePath, fullPath, FULL_LIMITS, `${label} full`),
  ]);
  return { thumbnail, full };
}

function sourceHash(sourcePath) {
  return hash12(fs.readFileSync(sourcePath));
}

function generatedFiles() {
  const files = [];
  const walk = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile()) files.push(fullPath);
    }
  };
  walk(GENERATED_PHOTOS_DIR);
  return files;
}

function removeStaleFiles(expectedFiles) {
  let removed = 0;
  for (const file of generatedFiles()) {
    if (!expectedFiles.has(file)) {
      fs.unlinkSync(file);
      removed += 1;
    }
  }

  const removeEmptyDirectories = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) removeEmptyDirectories(path.join(directory, entry.name));
    }
    if (directory !== GENERATED_PHOTOS_DIR && fs.readdirSync(directory).length === 0) {
      fs.rmdirSync(directory);
    }
  };
  removeEmptyDirectories(GENERATED_PHOTOS_DIR);
  return removed;
}

function publishedPhotos(source) {
  const entries = [];
  for (const album of source.albums) {
    for (const photo of album.photos) {
      if (isPublished(photo)) {
        entries.push({
          scope: album.id,
          source: photo.source,
          alt: photo.alt,
          rotation: photo.rotation === undefined ? 0 : photo.rotation,
          albumId: album.id,
          albumName: album.name,
        });
      }
    }
  }
  for (const role of ['hero', 'portrait']) {
    const entry = source.featured[role];
    if (entry && isPublished(entry)) {
      entries.push({
        scope: `featured:${role}`,
        source: entry.source,
        alt: entry.alt,
        rotation: 0,
        role,
      });
    }
  }
  return entries;
}

function destinationFor(photo, hash) {
  if (photo.role) {
    return path.join(GENERATED_PHOTOS_DIR, 'featured', `${photo.role}-${hash}`);
  }
  return path.join(GENERATED_PHOTOS_DIR, 'albums', photo.albumId, hash);
}

async function main() {
  const { data: source, errors } = loadPhotoSources({ sourcePath: PHOTO_SOURCES_PATH });
  if (errors.length > 0) {
    console.error('Photo source list is invalid:');
    for (const error of errors) console.error(`- ${error}`);
    return 1;
  }

  const entries = publishedPhotos(source);
  const missing = [];
  for (const entry of entries) {
    const fullPath = resolveOriginal(entry.source);
    if (!fs.existsSync(fullPath)) missing.push(entry.source);
  }
  if (missing.length > 0) {
    console.error(`Missing ${missing.length} original photo(s) under PHOTO_ORIGINALS_DIR:`);
    for (const sourcePath of missing.slice(0, 20)) console.error(`- ${sourcePath}`);
    if (missing.length > 20) console.error(`- ...and ${missing.length - 20} more`);
    return 1;
  }

  const manifest = {
    version: 1,
    generatedFrom: 'ts-app/photo-sources.json',
    albums: [],
    featured: {},
  };
  const expectedFiles = new Set();
  let generatedCount = 0;

  for (const album of source.albums) {
    const photos = [];
    for (const photo of album.photos) {
      if (!isPublished(photo)) continue;
      const hash = sourceHash(resolveOriginal(photo.source));
      const destination = destinationFor({
        albumId: album.id,
        source: photo.source,
      }, hash);
      const variants = await buildPhotoVariant(
        resolveOriginal(photo.source),
        destination,
        `${album.id}/${photo.source}`,
      );
      expectedFiles.add(path.join(PUBLIC_DIR, variants.thumbnail.src));
      expectedFiles.add(path.join(PUBLIC_DIR, variants.full.src));
      photos.push({
        sourceId: sourceIdFor(album.id, photo.source),
        alt: photo.alt,
        rotation: photo.rotation === undefined ? 0 : photo.rotation,
        thumbnail: variants.thumbnail,
        full: variants.full,
      });
      generatedCount += 1;
    }
    if (photos.length > 0) {
      manifest.albums.push({ id: album.id, name: album.name, photos });
    }
  }

  for (const role of ['hero', 'portrait']) {
    const entry = source.featured[role];
    if (!entry || !isPublished(entry)) {
      manifest.featured[role] = null;
      continue;
    }
    const hash = sourceHash(resolveOriginal(entry.source));
    const destination = destinationFor({ role }, hash);
    const variants = await buildPhotoVariant(
      resolveOriginal(entry.source),
      destination,
      `featured/${role}`,
    );
    expectedFiles.add(path.join(PUBLIC_DIR, variants.thumbnail.src));
    expectedFiles.add(path.join(PUBLIC_DIR, variants.full.src));
    manifest.featured[role] = {
      sourceId: sourceIdFor(`featured:${role}`, entry.source),
      alt: entry.alt,
      rotation: 0,
      thumbnail: variants.thumbnail,
      full: variants.full,
    };
    generatedCount += 1;
  }

  const removed = removeStaleFiles(expectedFiles);
  writeJsonAtomic(PHOTO_MANIFEST_PATH, manifest);

  const totalBytes = [...expectedFiles].reduce((total, file) => total + fs.statSync(file).size, 0);
  console.log(`Generated ${generatedCount} photos (${manifest.albums.length} albums) in ${path.relative(REPO_ROOT, GENERATED_PHOTOS_DIR)}.`);
  console.log(`Manifest: ${path.relative(REPO_ROOT, PHOTO_MANIFEST_PATH)}.`);
  console.log(`Total derivative size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB.`);
  if (removed > 0) console.log(`Removed ${removed} stale derivative file(s).`);
  return 0;
}

if (require.main === module) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(`Photo build failed: ${error.message}`);
      process.exitCode = 1;
    });
}

module.exports = { encodeVariant, main, qualitiesFor, resolveOriginal };
