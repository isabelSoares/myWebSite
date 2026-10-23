const fs = require('fs');
const path = require('path');

const {
  addCheck,
  createReport,
  printReport,
} = require('./lib/check-report');
const {
  APP_ROOT,
} = require('./lib/routes');
const {
  collectManifestPhotos,
  loadPhotoManifest,
} = require('./lib/photo-manifest');

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.scss', '.css']);

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalizeReference(reference) {
  const withoutQuery = reference.split('?')[0].split('#')[0];
  return withoutQuery.replace(/^\/+/, '');
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function collectPublicAssetReferences(source) {
  const references = new Set();
  const templateReference = /process\.env\.PUBLIC_URL\}\/([^`'"\s)}>]+)/g;
  const literalPhotoReference = /['"](\/photos\/[^'"]+)['"]/g;

  let match;
  while ((match = templateReference.exec(source)) !== null) {
    references.add(normalizeReference(match[1]));
  }
  while ((match = literalPhotoReference.exec(source)) !== null) {
    references.add(normalizeReference(match[1]));
  }

  return [...references].filter((reference) => (
    reference
    && !/^https?:/i.test(reference)
    && !reference.includes('{')
    && !reference.includes('$')
  ));
}

function readSourceFiles(srcDir) {
  return walkFiles(srcDir)
    .filter((file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .filter((file) => !/\.(?:test|spec)\.[jt]sx?$/.test(file))
    .map((file) => ({ file, content: fs.readFileSync(file, 'utf8') }));
}

function validateLocalAssets({ appRoot = APP_ROOT } = {}) {
  const srcDir = path.join(appRoot, 'src');
  const publicDir = path.join(appRoot, 'public');
  const references = new Map();

  for (const { file, content } of readSourceFiles(srcDir)) {
    for (const reference of collectPublicAssetReferences(content)) {
      const key = normalizeReference(reference);
      if (!references.has(key)) {
        references.set(key, path.relative(appRoot, file));
      }
    }
  }

  const missing = [];
  for (const [reference, sourceFile] of references) {
    const target = path.join(publicDir, safeDecode(reference));
    if (!fs.existsSync(target)) {
      missing.push(`${reference} (referenced by ${sourceFile})`);
    }
  }

  return {
    checked: references.size,
    missing,
  };
}

function validateAlbumPhotos({ appRoot = APP_ROOT, manifestPath } = {}) {
  const resolvedManifestPath = manifestPath || path.join(appRoot, 'src', 'data', 'photo-manifest.json');
  const { data, errors } = loadPhotoManifest({ manifestPath: resolvedManifestPath });

  if (errors.length > 0) {
    return { checked: 0, missing: errors, sourceFound: false };
  }

  const photos = collectManifestPhotos(data);
  if (photos.length === 0) {
    return { checked: 0, missing: [], sourceFound: true };
  }

  const publicDir = path.join(appRoot, 'public');
  const missing = [];
  let checked = 0;

  for (const photo of photos) {
    for (const variant of [photo.thumbnail, photo.full]) {
      if (!variant || !variant.src) continue;
      checked += 1;
      if (!fs.existsSync(path.join(publicDir, variant.src))) {
        missing.push(variant.src);
      }
    }
  }

  return { checked, missing, sourceFound: true };
}

function readManifest(publicDir) {
  const manifestPath = path.join(publicDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { manifestPath, manifest: null, error: 'public/manifest.json is missing.' };
  }

  try {
    return { manifestPath, manifest: JSON.parse(fs.readFileSync(manifestPath, 'utf8')), error: null };
  } catch (error) {
    return { manifestPath, manifest: null, error: `public/manifest.json is invalid JSON: ${error.message}` };
  }
}

function validateManifest({ appRoot = APP_ROOT } = {}) {
  const publicDir = path.join(appRoot, 'public');
  const buildDir = path.join(appRoot, 'build');
  const { manifest, error } = readManifest(publicDir);
  const problems = [];

  if (error) {
    return { checked: 0, missing: [error] };
  }

  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  if (icons.length === 0) {
    problems.push('manifest.json has no icon entries.');
  }

  for (const icon of icons) {
    if (!icon.src) {
      problems.push('manifest.json contains an icon without a src.');
      continue;
    }
    const publicIcon = path.join(publicDir, icon.src);
    if (!fs.existsSync(publicIcon)) {
      problems.push(`public/${icon.src}`);
    }
    if (fs.existsSync(buildDir)) {
      const buildIcon = path.join(buildDir, icon.src);
      if (!fs.existsSync(buildIcon)) {
        problems.push(`build/${icon.src}`);
      }
    }
  }

  const indexHtmlPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const iconMatch = indexHtml.match(/rel=["']icon["'][^>]*href=["']%PUBLIC_URL%\/([^"']+)["']/i);
    if (iconMatch && !fs.existsSync(path.join(publicDir, iconMatch[1]))) {
      problems.push(`public/${iconMatch[1]} (referenced by public/index.html)`);
    }
  }

  return { checked: icons.length, missing: problems };
}

function validateBuildOutput({ appRoot = APP_ROOT } = {}) {
  const buildDir = path.join(appRoot, 'build');
  const requiredFiles = ['index.html', '404.html', 'manifest.json'];
  const missing = requiredFiles
    .filter((file) => !fs.existsSync(path.join(buildDir, file)))
    .map((file) => `build/${file}`);

  const publicManifest = readManifest(path.join(appRoot, 'public'));
  if (publicManifest.manifest && Array.isArray(publicManifest.manifest.icons)) {
    for (const icon of publicManifest.manifest.icons) {
      if (icon.src && !fs.existsSync(path.join(buildDir, icon.src))) {
        missing.push(`build/${icon.src}`);
      }
    }
  }

  return {
    checked: requiredFiles.length + (publicManifest.manifest?.icons?.length || 0),
    missing,
  };
}

function createSiteAssetReport({ appRoot = APP_ROOT, requireBuild = false } = {}) {
  const report = createReport();

  const local = validateLocalAssets({ appRoot });
  addCheck(report, {
    id: 'assets.local',
    category: 'assets',
    status: local.missing.length === 0 ? 'pass' : 'fail',
    detail: local.missing.length === 0
      ? `${local.checked} local public references resolve`
      : `missing: ${local.missing.join('; ')}`,
  });

  const albums = validateAlbumPhotos({ appRoot });
  const albumStatus = !albums.sourceFound || albums.missing.length > 0 || albums.checked === 0
    ? 'fail'
    : 'pass';
  addCheck(report, {
    id: 'assets.photos',
    category: 'assets',
    status: albumStatus,
    detail: !albums.sourceFound
      ? 'photo album source file not found'
      : albums.checked === 0
        ? 'no album photo references found'
        : albums.missing.length === 0
          ? `${albums.checked} generated photo files resolve`
          : `missing: ${albums.missing.join('; ')}`,
  });

  const manifest = validateManifest({ appRoot });
  addCheck(report, {
    id: 'assets.manifest',
    category: 'assets',
    status: manifest.missing.length === 0 ? 'pass' : 'fail',
    detail: manifest.missing.length === 0
      ? `${manifest.checked} manifest icons resolve`
      : `missing: ${manifest.missing.join('; ')}`,
  });

  if (requireBuild) {
    const build = validateBuildOutput({ appRoot });
    addCheck(report, {
      id: 'assets.build',
      category: 'assets',
      status: build.missing.length === 0 ? 'pass' : 'fail',
      detail: build.missing.length === 0
        ? 'build output and manifest icons resolve'
        : `missing: ${build.missing.join('; ')}`,
    });
  }


  return report;
}

function parseArgs(argv) {
  return {
    requireBuild: argv.includes('--require-build'),
    json: argv.includes('--json'),
  };
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  const report = createSiteAssetReport({ requireBuild: options.requireBuild });
  printReport(report, { json: options.json });
  process.exitCode = report.checks.some((check) => check.status === 'fail') ? 1 : 0;
}

module.exports = {
  collectPublicAssetReferences,
  createSiteAssetReport,
  normalizeReference,
  validateAlbumPhotos,
  validateBuildOutput,
  validateLocalAssets,
  validateManifest,
};
