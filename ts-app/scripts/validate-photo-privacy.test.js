const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { createPhotoPrivacyReport } = require('./validate-photo-privacy');
const {
  cleanup,
  createPhotoFixture,
  writeFile,
  writeImage,
} = require('./lib/test-fixtures');

function checksById(report) {
  return new Map(report.checks.map((check) => [check.id, check]));
}

async function run(fixture, options = {}) {
  return createPhotoPrivacyReport({
    repoRoot: fixture.repoRoot,
    appRoot: fixture.appRoot,
    publicDir: fixture.publicDir,
    generatedDir: fixture.generatedDir,
    sourcePath: fixture.sourcePath,
    manifestPath: fixture.manifestPath,
    buildDir: fixture.buildDir,
    trackedFiles: options.trackedFiles || [],
  });
}

async function main() {
  const fixture = await createPhotoFixture();
  try {
    const tracked = [
      'ts-app/photo-sources.json',
      'ts-app/src/data/photo-manifest.json',
    ];
    let report = await run(fixture, { trackedFiles: tracked });
    let checks = checksById(report);
    assert.strictEqual(checks.get('privacy.no-originals').status, 'pass');
    assert.strictEqual(checks.get('privacy.no-raw-photo-links').status, 'pass');
    assert.strictEqual(checks.get('photos.manifest').status, 'pass');
    assert.strictEqual(checks.get('photos.total-size').status, 'pass');
    assert.strictEqual(checks.get('photos.limits').status, 'pass');

    const rawPhotoUrl = [
      'https://raw.githubusercontent.com',
      'isabelSoares/myWebSite/main/photos/portugal/one.webp',
    ].join('/');
    writeFile(path.join(fixture.repoRoot, 'notes.md'), `${rawPhotoUrl}\n`);
    report = await run(fixture, { trackedFiles: [...tracked, 'notes.md'] });
    checks = checksById(report);
    assert.strictEqual(checks.get('privacy.no-raw-photo-links').status, 'fail');

    report = await run(fixture, { trackedFiles: [...tracked, 'photos/portugal/one.webp'] });
    checks = checksById(report);
    assert.strictEqual(checks.get('privacy.no-originals').status, 'fail');

    const generated = path.join(fixture.generatedDir, 'albums', 'portugal');
    const generatedFile = fs.readdirSync(generated)[0];
    fs.unlinkSync(path.join(generated, generatedFile));
    report = await run(fixture, { trackedFiles: tracked });
    checks = checksById(report);
    assert.strictEqual(checks.get('photos.manifest').status, 'fail');

    writeFile(
      path.join(fixture.buildDir, 'asset.js'),
      `const url = "${rawPhotoUrl.replace('portugal/one.webp', 'x.webp')}";\n`,
    );
    report = await run(fixture, { trackedFiles: tracked });
    checks = checksById(report);
    assert.strictEqual(checks.get('privacy.no-raw-photo-links').status, 'fail');

    await writeImage(path.join(fixture.publicDir, 'legacy.webp'), { width: 2100, height: 100 });
    report = await run(fixture, { trackedFiles: [...tracked, 'ts-app/public/legacy.webp'] });
    checks = checksById(report);
    assert.strictEqual(checks.get('photos.limits').status, 'fail');
    assert.match(checks.get('photos.limits').detail, /exceeds 2000px/);

    console.log('Photo privacy tests passed.');
  } finally {
    cleanup(fixture);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
