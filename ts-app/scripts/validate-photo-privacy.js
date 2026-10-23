const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  EXIT_CODES,
  addCheck,
  createReport,
  exitCodeFor,
  printReport,
  truncateOutput,
} = require('./lib/check-report');
const {
  APP_ROOT,
  BUILD_DIR,
  GENERATED_PHOTOS_DIR,
  PHOTO_MANIFEST_PATH,
  PHOTO_SOURCES_PATH,
  PUBLIC_DIR,
  REPO_ROOT,
} = require('./lib/routes');
const {
  loadPhotoManifest,
  loadPhotoSources,
  validateGeneratedAssets,
  validatePhotoManifest,
} = require('./lib/photo-manifest');
const { FULL_LIMITS, GENERATED_TOTAL_MAX_BYTES } = require('./lib/photo-limits');

const TEXT_EXTENSIONS = new Set([
  '.css', '.env', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.scss',
  '.sh', '.svg', '.ts', '.tsx', '.txt', '.yaml', '.yml',
]);
const RASTER_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.tif', '.tiff', '.webp']);
const RAW_PHOTO_PATTERN = /raw\.githubusercontent\.com\/[^\s"'`)]*\/photos\//i;

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

function getTrackedFiles(repoRoot) {
  const result = spawnSync('git', ['ls-files', '-z'], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.error) return { files: [], error: result.error.message };
  if (result.status !== 0) return { files: [], error: truncateOutput(result.stderr || 'git ls-files failed') };
  const files = result.stdout
    .split('\0')
    .filter(Boolean)
    .filter((file) => fs.existsSync(path.join(repoRoot, file)));
  return { files, error: null };
}

function textFiles(repoRoot, trackedFiles, buildDir) {
  const tracked = trackedFiles
    .filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .map((file) => path.join(repoRoot, file));
  const build = walkFiles(buildDir)
    .filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()));
  return [...new Set([...tracked, ...build])];
}

function rawPhotoLinks(repoRoot, trackedFiles, buildDir) {
  const findings = [];
  const runtimeFiles = trackedFiles.filter((file) => (
    !file.startsWith('specs/') && !file.startsWith('.specify/')
  ));
  for (const file of textFiles(repoRoot, runtimeFiles, buildDir)) {
    if (!fs.existsSync(file)) continue;
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    if (RAW_PHOTO_PATTERN.test(content)) {
      findings.push(path.relative(repoRoot, file).split(path.sep).join('/'));
    }
  }
  return findings;
}

function isUnder(file, directory) {
  const root = directory.endsWith(path.sep) ? directory : `${directory}${path.sep}`;
  return path.resolve(file).startsWith(root);
}

async function checkRasterLimits(files, { generatedDir }) {
  const sharp = require('sharp');
  const errors = [];
  let checked = 0;

  for (const file of [...new Set(files)]) {
    if (!fs.existsSync(file)) continue;
    if (isUnder(file, generatedDir)) continue;
    if (!RASTER_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    checked += 1;

    const stat = fs.statSync(file);
    if (stat.size > FULL_LIMITS.maxBytes) {
      errors.push(`${path.basename(file)} is larger than ${FULL_LIMITS.maxBytes} bytes`);
    }

    try {
      const info = await sharp(file).metadata();
      if (Math.max(info.width || 0, info.height || 0) > FULL_LIMITS.maxDimension) {
        errors.push(`${path.basename(file)} exceeds ${FULL_LIMITS.maxDimension}px`);
      }
    } catch (error) {
      errors.push(`${path.basename(file)} cannot be decoded (${error.message})`);
    }
  }

  return { checked, errors };
}

function addPrivacyChecks(report, trackedFiles) {
  const originals = trackedFiles.filter((file) => (
    file.startsWith('photos/') || file.startsWith('photo-originals/')
  ));
  addCheck(report, {
    id: 'privacy.no-originals',
    category: 'deployment',
    status: originals.length === 0 ? 'pass' : 'fail',
    detail: originals.length === 0
      ? 'no raw original photo directories are tracked'
      : `tracked original photos: ${originals.slice(0, 10).join(', ')}`,
  });
}

function addRawLinkCheck(report, repoRoot, trackedFiles, buildDir) {
  const findings = rawPhotoLinks(repoRoot, trackedFiles, buildDir);
  addCheck(report, {
    id: 'privacy.no-raw-photo-links',
    category: 'content',
    status: findings.length === 0 ? 'pass' : 'fail',
    detail: findings.length === 0
      ? 'no raw GitHub photo links found in source or build output'
      : `raw photo links in: ${findings.slice(0, 10).join(', ')}`,
  });
}

async function addManifestChecks(report, {
  appRoot,
  sourcePath,
  manifestPath,
  publicDir,
  generatedDir,
}) {
  const source = loadPhotoSources({ sourcePath });
  const manifest = loadPhotoManifest({ manifestPath });
  const errors = [...source.errors, ...manifest.errors];

  if (source.data && manifest.data) {
    errors.push(...validatePhotoManifest(manifest.data, source.data));
  }

  let generated = { errors: [], totalBytes: 0, checked: 0 };
  if (manifest.data) {
    generated = await validateGeneratedAssets(manifest.data, {
      publicDir,
      generatedDir,
    });
    errors.push(...generated.errors);
  }

  addCheck(report, {
    id: 'photos.manifest',
    category: 'assets',
    status: errors.length === 0 ? 'pass' : 'fail',
    detail: errors.length === 0
      ? 'source list, manifest, and generated derivatives agree'
      : truncateOutput(errors.join('; ')),
  });

  addCheck(report, {
    id: 'photos.total-size',
    category: 'performance',
    status: generated.totalBytes <= GENERATED_TOTAL_MAX_BYTES ? 'pass' : 'fail',
    detail: `${(generated.totalBytes / (1024 * 1024)).toFixed(2)} MB generated across ${generated.checked} files`,
  });
}

async function createPhotoPrivacyReport({
  repoRoot = REPO_ROOT,
  appRoot = APP_ROOT,
  trackedFiles,
  buildDir = BUILD_DIR,
  publicDir = PUBLIC_DIR,
  generatedDir = GENERATED_PHOTOS_DIR,
  sourcePath = PHOTO_SOURCES_PATH,
  manifestPath = PHOTO_MANIFEST_PATH,
} = {}) {
  const report = createReport();
  const tracked = trackedFiles === undefined
    ? getTrackedFiles(repoRoot)
    : { files: trackedFiles, error: null };

  if (tracked.error) {
    addCheck(report, {
      id: 'privacy.no-originals',
      category: 'deployment',
      status: 'fail',
      detail: `could not list tracked files: ${tracked.error}`,
    });
    addCheck(report, {
      id: 'privacy.no-raw-photo-links',
      category: 'content',
      status: 'fail',
      detail: `could not list tracked files: ${tracked.error}`,
    });
  } else {
    addPrivacyChecks(report, tracked.files);
    addRawLinkCheck(report, repoRoot, tracked.files, buildDir);
  }

  await addManifestChecks(report, {
    appRoot,
    sourcePath,
    manifestPath,
    publicDir,
    generatedDir,
  });

  const trackedRaster = tracked.files
    .map((file) => path.join(repoRoot, file))
    .filter((file) => RASTER_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const buildRaster = walkFiles(buildDir)
    .filter((file) => RASTER_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const raster = await checkRasterLimits([...trackedRaster, ...buildRaster], { generatedDir });
  addCheck(report, {
    id: 'photos.limits',
    category: 'performance',
    status: raster.errors.length === 0 ? 'pass' : 'fail',
    detail: raster.errors.length === 0
      ? `${raster.checked} non-generated raster files are within size and dimension limits`
      : truncateOutput(raster.errors.join('; ')),
  });

  return report;
}

async function main() {
  const report = await createPhotoPrivacyReport();
  printReport(report);
  return exitCodeFor(report);
}

if (require.main === module) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(`Photo privacy check could not run: ${error.message}`);
      process.exitCode = EXIT_CODES.PREREQUISITE;
    });
}

module.exports = {
  createPhotoPrivacyReport,
  getTrackedFiles,
  rawPhotoLinks,
};
