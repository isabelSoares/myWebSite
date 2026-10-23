const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const { sourceIdFor } = require('./photo-manifest');

function writeFile(filePath, content = '') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function writeJson(filePath, value) {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

async function writeImage(filePath, {
  width = 100,
  height = 100,
  quality = 80,
  noise = false,
  orientation,
} = {}) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const create = noise
    ? { width, height, channels: 3, noise: { type: 'gaussian', mean: 128, sigma: 30 } }
    : { width, height, channels: 3, background: { r: 120, g: 90, b: 70 } };
  let image = sharp({ create });
  if (orientation) image = image.withMetadata({ orientation });
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') {
    await image.jpeg({ quality }).toFile(filePath);
  } else if (extension === '.png') {
    await image.png().toFile(filePath);
  } else {
    await image.webp({ quality }).toFile(filePath);
  }
  return fs.statSync(filePath).size;
}

function createTempApp() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-privacy-'));
  const appRoot = path.join(repoRoot, 'ts-app');
  const publicDir = path.join(appRoot, 'public');
  const generatedDir = path.join(publicDir, 'photos', 'generated');
  const sourcePath = path.join(appRoot, 'photo-sources.json');
  const manifestPath = path.join(appRoot, 'src', 'data', 'photo-manifest.json');
  const buildDir = path.join(appRoot, 'build');
  fs.mkdirSync(generatedDir, { recursive: true });
  return { repoRoot, appRoot, publicDir, generatedDir, sourcePath, manifestPath, buildDir };
}

function createSource() {
  return {
    version: 1,
    albums: [
      {
        id: 'portugal',
        name: 'Portugal',
        photos: [
          { source: 'portugal/one.webp', alt: 'Portugal photo 1', rotation: 0, published: true },
          { source: 'portugal/two.webp', alt: 'Portugal photo 2', rotation: 90, published: true },
        ],
      },
    ],
    featured: {
      hero: { source: 'featured/hero.webp', alt: 'sunset and a person jump', published: true },
      portrait: { source: 'profile/portrait.webp', alt: 'Isabel Soares', published: true },
    },
  };
}

async function createVariants(publicDir, baseDestination, prefix) {
  const thumbnailSrc = `${prefix}-thumb.webp`;
  const fullSrc = `${prefix}.webp`;
  const thumbnailBytes = await writeImage(path.join(publicDir, thumbnailSrc), {
    width: 540,
    height: 360,
    quality: 40,
  });
  const fullBytes = await writeImage(path.join(publicDir, fullSrc), {
    width: 1800,
    height: 1200,
    quality: 40,
  });
  return {
    thumbnail: { src: thumbnailSrc, width: 540, height: 360, bytes: thumbnailBytes },
    full: { src: fullSrc, width: 1800, height: 1200, bytes: fullBytes },
  };
}

async function createManifest(source, publicDir) {
  const manifest = { version: 1, generatedFrom: 'ts-app/photo-sources.json', albums: [], featured: {} };
  for (const album of source.albums) {
    const photos = [];
    for (const photo of album.photos) {
      if (photo.published === false) continue;
      const sourceId = sourceIdFor(album.id, photo.source);
      const variants = await createVariants(
        publicDir,
        path.join(publicDir, 'photos', 'generated', 'albums', album.id, sourceId),
        `photos/generated/albums/${album.id}/${sourceId}`,
      );
      photos.push({
        sourceId,
        alt: photo.alt,
        rotation: photo.rotation || 0,
        ...variants,
      });
    }
    if (photos.length > 0) manifest.albums.push({ id: album.id, name: album.name, photos });
  }
  for (const role of ['hero', 'portrait']) {
    const entry = source.featured[role];
    if (!entry || entry.published === false) {
      manifest.featured[role] = null;
      continue;
    }
    const sourceId = sourceIdFor(`featured:${role}`, entry.source);
    const variants = await createVariants(
      publicDir,
      path.join(publicDir, 'photos', 'generated', 'featured', `${role}-${sourceId}`),
      `photos/generated/featured/${role}-${sourceId}`,
    );
    manifest.featured[role] = { sourceId, alt: entry.alt, rotation: 0, ...variants };
  }
  return manifest;
}

async function createPhotoFixture({ source = createSource(), createGenerated = true } = {}) {
  const fixture = createTempApp();
  writeJson(fixture.sourcePath, source);
  const manifest = createGenerated ? await createManifest(source, fixture.publicDir) : null;
  if (manifest) writeJson(fixture.manifestPath, manifest);
  return { ...fixture, source, manifest };
}

function cleanup(fixture) {
  fs.rmSync(fixture.repoRoot, { recursive: true, force: true });
}

module.exports = {
  cleanup,
  createManifest,
  createPhotoFixture,
  createSource,
  createTempApp,
  createVariants,
  writeFile,
  writeImage,
  writeJson,
};
