const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {
  FULL_LIMITS,
  GENERATED_TOTAL_MAX_BYTES,
  RASTER_EXTENSIONS,
  THUMBNAIL_LIMITS,
  VALID_ROTATIONS,
} = require('./photo-limits');
const {
  GENERATED_PHOTOS_DIR,
  PHOTO_MANIFEST_PATH,
  PHOTO_SOURCES_PATH,
  PUBLIC_DIR,
} = require('./routes');

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const GENERATED_PREFIX = 'photos/generated/';

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSafeRelativePath(value) {
  if (!isNonEmptyString(value)) return false;
  const normalized = value.replace(/\\/g, '/');
  if (normalized.startsWith('/') || /^[A-Za-z]:/.test(normalized)) return false;
  const parts = normalized.split('/');
  return parts.length > 0 && parts.every((part) => part && part !== '.' && part !== '..');
}

function isPublished(entry) {
  return entry.published !== false;
}

function extensionOf(file) {
  return path.extname(file).toLowerCase();
}

function hash12(value) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
}

function sourceIdFor(scope, source) {
  return hash12(`${scope}\0${source}`);
}

function readJsonFile(filePath) {
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf8')), error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

function writeJsonAtomic(filePath, value) {
  const temporaryPath = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporaryPath, filePath);
}

function loadPhotoSources({ sourcePath = PHOTO_SOURCES_PATH } = {}) {
  if (!fs.existsSync(sourcePath)) {
    return { data: null, errors: [`photo source list is missing: ${path.basename(sourcePath)}`] };
  }
  const { data, error } = readJsonFile(sourcePath);
  if (error) {
    return { data: null, errors: [`photo source list is invalid JSON: ${error}`] };
  }
  return { data, errors: validatePhotoSources(data) };
}

function loadPhotoManifest({ manifestPath = PHOTO_MANIFEST_PATH } = {}) {
  if (!fs.existsSync(manifestPath)) {
    return { data: null, errors: [`photo manifest is missing: ${path.basename(manifestPath)}`] };
  }
  const { data, error } = readJsonFile(manifestPath);
  if (error) {
    return { data: null, errors: [`photo manifest is invalid JSON: ${error}`] };
  }
  return { data, errors: [] };
}

function validatePhotoSources(data) {
  const errors = [];

  if (!isPlainObject(data)) return ['photo source list must be a JSON object'];
  if (data.version !== 1) errors.push('photo source list version must be 1');
  if (!Array.isArray(data.albums) || data.albums.length === 0) {
    errors.push('photo source list must contain at least one album');
  }

  const albumIds = new Set();
  const sources = new Set();

  const sourceErrors = (label, entry) => {
    if (!isPlainObject(entry)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (!isSafeRelativePath(entry.source)) {
      errors.push(`${label}.source must be a safe relative path`);
    } else {
      if (!RASTER_EXTENSIONS.has(extensionOf(entry.source))) {
        errors.push(`${label}.source has an unsupported image extension`);
      }
      if (sources.has(entry.source)) {
        errors.push(`${label}.source is duplicated: ${entry.source}`);
      }
      sources.add(entry.source);
    }
    if (!isNonEmptyString(entry.alt)) errors.push(`${label}.alt must be non-empty`);
    if (entry.rotation !== undefined && !VALID_ROTATIONS.includes(entry.rotation)) {
      errors.push(`${label}.rotation must be one of 0, 90, 180, or 270`);
    }
    if (entry.published !== undefined && typeof entry.published !== 'boolean') {
      errors.push(`${label}.published must be a boolean`);
    }
  };

  const albums = Array.isArray(data.albums) ? data.albums : [];
  albums.forEach((album, albumIndex) => {
    const label = `albums[${albumIndex}]`;
    if (!isPlainObject(album)) {
      errors.push(`${label} must be an object`);
      return;
    }
    if (!ID_PATTERN.test(album.id || '')) {
      errors.push(`${label}.id must match ${ID_PATTERN}`);
    } else if (albumIds.has(album.id)) {
      errors.push(`${label}.id is duplicated: ${album.id}`);
    }
    albumIds.add(album.id);
    if (!isNonEmptyString(album.name)) errors.push(`${label}.name must be non-empty`);
    if (!Array.isArray(album.photos) || album.photos.length === 0) {
      errors.push(`${label}.photos must contain at least one photo`);
      return;
    }
    album.photos.forEach((photo, photoIndex) => {
      sourceErrors(`${label}.photos[${photoIndex}]`, photo);
    });
  });

  if (!isPlainObject(data.featured)) {
    errors.push('featured must be an object');
  } else {
    for (const role of ['hero', 'portrait']) {
      sourceErrors(`featured.${role}`, data.featured[role]);
    }
  }

  return errors;
}

function validateVariant(variant, label, limits) {
  const errors = [];
  if (!isPlainObject(variant)) return [`${label} must be an object`];
  if (!isSafeRelativePath(variant.src)) {
    errors.push(`${label}.src must be a safe relative path`);
  } else {
    if (extensionOf(variant.src) !== '.webp') errors.push(`${label}.src must be a WebP file`);
    if (!variant.src.startsWith(GENERATED_PREFIX)) {
      errors.push(`${label}.src must be under ${GENERATED_PREFIX}`);
    }
  }
  for (const field of ['width', 'height', 'bytes']) {
    if (!Number.isInteger(variant[field]) || variant[field] <= 0) {
      errors.push(`${label}.${field} must be a positive integer`);
    }
  }
  if (Number.isInteger(variant.width) && Number.isInteger(variant.height)) {
    if (Math.max(variant.width, variant.height) > limits.maxDimension) {
      errors.push(`${label} exceeds ${limits.maxDimension}px`);
    }
  }
  if (Number.isInteger(variant.bytes) && variant.bytes > limits.maxBytes) {
    errors.push(`${label} exceeds ${limits.maxBytes} bytes`);
  }
  return errors;
}

function expectedManifest(source) {
  const albums = [];
  const featured = { hero: null, portrait: null };

  for (const album of source.albums) {
    const photos = album.photos.filter(isPublished).map((photo) => ({
      sourceId: sourceIdFor(album.id, photo.source),
      alt: photo.alt,
      rotation: photo.rotation === undefined ? 0 : photo.rotation,
      source: photo.source,
    }));
    if (photos.length > 0) albums.push({ id: album.id, name: album.name, photos });
  }

  for (const role of ['hero', 'portrait']) {
    const entry = source.featured[role];
    if (entry && isPublished(entry)) {
      featured[role] = {
        sourceId: sourceIdFor(`featured:${role}`, entry.source),
        alt: entry.alt,
        rotation: 0,
        source: entry.source,
      };
    }
  }

  return { albums, featured };
}

function validateManifestEntry(entry, expected, label) {
  const errors = [];
  if (!isPlainObject(entry)) return [`${label} must be an object`];
  if (entry.sourceId !== expected.sourceId) errors.push(`${label}.sourceId does not match the source list`);
  if (entry.alt !== expected.alt) errors.push(`${label}.alt does not match the source list`);
  if (entry.rotation !== expected.rotation) errors.push(`${label}.rotation does not match the source list`);
  errors.push(...validateVariant(entry.thumbnail, `${label}.thumbnail`, THUMBNAIL_LIMITS));
  errors.push(...validateVariant(entry.full, `${label}.full`, FULL_LIMITS));
  return errors;
}

function validatePhotoManifest(manifest, source) {
  const sourceErrors = validatePhotoSources(source);
  if (sourceErrors.length > 0) return sourceErrors.slice();

  const errors = [];
  if (!isPlainObject(manifest)) return ['photo manifest must be a JSON object'];
  if (manifest.version !== 1) errors.push('photo manifest version must be 1');
  if (!Array.isArray(manifest.albums)) errors.push('photo manifest albums must be an array');

  const expected = expectedManifest(source);
  const expectedById = new Map(expected.albums.map((album) => [album.id, album]));
  const manifestAlbums = Array.isArray(manifest.albums) ? manifest.albums : [];
  const seenAlbums = new Set();
  const seenSourceIds = new Set();

  for (const album of manifestAlbums) {
    if (!isPlainObject(album)) {
      errors.push('photo manifest album entries must be objects');
      continue;
    }
    if (seenAlbums.has(album.id)) errors.push(`photo manifest album is duplicated: ${album.id}`);
    seenAlbums.add(album.id);
    const expectedAlbum = expectedById.get(album.id);
    if (!expectedAlbum) {
      errors.push(`photo manifest contains an unexpected album: ${album.id}`);
      continue;
    }
    if (album.name !== expectedAlbum.name) errors.push(`photo manifest album name is wrong: ${album.id}`);
    if (!Array.isArray(album.photos)) {
      errors.push(`photo manifest album photos must be an array: ${album.id}`);
      continue;
    }
    const expectedPhotos = new Map(expectedAlbum.photos.map((photo) => [photo.sourceId, photo]));
    const seenPhotos = new Set();
    for (const photo of album.photos) {
      if (!isPlainObject(photo)) {
        errors.push(`photo manifest photo entries must be objects: ${album.id}`);
        continue;
      }
      if (seenPhotos.has(photo.sourceId)) {
        errors.push(`photo manifest photo is duplicated: ${album.id}/${photo.sourceId}`);
      }
      seenPhotos.add(photo.sourceId);
      if (seenSourceIds.has(photo.sourceId)) {
        errors.push(`photo manifest sourceId is not globally unique: ${photo.sourceId}`);
      }
      seenSourceIds.add(photo.sourceId);
      const expectedPhoto = expectedPhotos.get(photo.sourceId);
      if (!expectedPhoto) {
        errors.push(`photo manifest contains an unexpected photo: ${album.id}/${photo.sourceId}`);
        continue;
      }
      errors.push(...validateManifestEntry(photo, expectedPhoto, `albums.${album.id}.${photo.sourceId}`));
    }
    for (const sourceId of expectedPhotos.keys()) {
      if (!seenPhotos.has(sourceId)) errors.push(`photo manifest is missing a photo: ${album.id}/${sourceId}`);
    }
  }

  for (const albumId of expectedById.keys()) {
    if (!seenAlbums.has(albumId)) errors.push(`photo manifest is missing an album: ${albumId}`);
  }

  const featured = isPlainObject(manifest.featured) ? manifest.featured : {};
  for (const role of ['hero', 'portrait']) {
    const expectedEntry = expected.featured[role];
    const actualEntry = featured[role];
    if (expectedEntry && !actualEntry) errors.push(`photo manifest is missing featured.${role}`);
    if (!expectedEntry && actualEntry) errors.push(`photo manifest must not contain featured.${role}`);
    if (expectedEntry && actualEntry) {
      errors.push(...validateManifestEntry(actualEntry, expectedEntry, `featured.${role}`));
      if (seenSourceIds.has(actualEntry.sourceId)) {
        errors.push(`photo manifest sourceId is not globally unique: ${actualEntry.sourceId}`);
      }
      seenSourceIds.add(actualEntry.sourceId);
    }
  }

  return errors;
}

function collectManifestPhotos(manifest) {
  const photos = [];
  for (const album of manifest.albums || []) {
    for (const photo of album.photos || []) {
      photos.push({ albumId: album.id, albumName: album.name, ...photo });
    }
  }
  for (const role of ['hero', 'portrait']) {
    const entry = manifest.featured && manifest.featured[role];
    if (entry) photos.push({ albumId: 'featured', albumName: role, ...entry, role });
  }
  return photos;
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

async function validateGeneratedAssets(manifest, { publicDir = PUBLIC_DIR, generatedDir } = {}) {
  const sharp = require('sharp');
  const errors = [];
  const resolvedGeneratedDir = generatedDir || path.join(publicDir, 'photos', 'generated');
  const referenced = new Set();
  let totalBytes = 0;
  let checked = 0;

  for (const photo of collectManifestPhotos(manifest)) {
    for (const variantName of ['thumbnail', 'full']) {
      const variant = photo[variantName];
      if (!variant || !isSafeRelativePath(variant.src)) continue;
      const fullPath = path.join(publicDir, variant.src);
      if (!fs.existsSync(fullPath)) {
        errors.push(`missing generated file: ${variant.src}`);
        continue;
      }
      if (referenced.has(fullPath)) continue;
      referenced.add(fullPath);
      checked += 1;

      const stat = fs.statSync(fullPath);
      totalBytes += stat.size;
      if (stat.size > variant.bytes) {
        errors.push(`generated file is larger than manifest: ${variant.src}`);
      }

      try {
        const info = await sharp(fullPath).metadata();
        if (info.format !== 'webp') errors.push(`generated file is not WebP: ${variant.src}`);
        if (info.width !== variant.width || info.height !== variant.height) {
          errors.push(`generated dimensions do not match manifest: ${variant.src}`);
        }
        const limits = variantName === 'thumbnail' ? THUMBNAIL_LIMITS : FULL_LIMITS;
        if (Math.max(info.width || 0, info.height || 0) > limits.maxDimension) {
          errors.push(`generated file exceeds ${limits.maxDimension}px: ${variant.src}`);
        }
      } catch (error) {
        errors.push(`generated file cannot be decoded: ${variant.src} (${error.message})`);
      }
    }
  }

  for (const file of walkFiles(resolvedGeneratedDir)) {
    if (!referenced.has(file)) {
      errors.push(`unreferenced generated file: ${path.relative(publicDir, file).split(path.sep).join('/')}`);
    }
  }

  if (totalBytes > GENERATED_TOTAL_MAX_BYTES) {
    errors.push(`generated photos exceed 60 MB (${totalBytes} bytes)`);
  }

  return { errors, totalBytes, checked };
}

module.exports = {
  collectManifestPhotos,
  expectedManifest,
  hash12,
  isPublished,
  isSafeRelativePath,
  loadPhotoManifest,
  loadPhotoSources,
  readJsonFile,
  sourceIdFor,
  validateGeneratedAssets,
  validatePhotoManifest,
  validatePhotoSources,
  writeJsonAtomic,
};
