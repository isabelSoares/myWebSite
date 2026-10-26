const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  validateGeneratedAssets,
  validatePhotoManifest,
  validatePhotoSources,
} = require('./lib/photo-manifest');
const {
  GENERATED_TOTAL_MAX_BYTES,
  describeGeneratedFootprint,
  remainingBytes,
} = require('./lib/photo-limits');
const {
  cleanup,
  createPhotoFixture,
  createSource,
  writeFile,
} = require('./lib/test-fixtures');

async function testSourceValidation() {
  const source = createSource();
  assert.deepStrictEqual(validatePhotoSources(source), []);

  const unsafe = JSON.parse(JSON.stringify(source));
  unsafe.albums[0].photos[0].source = '../private.webp';
  assert.match(validatePhotoSources(unsafe).join('\n'), /safe relative path/);

  const duplicate = JSON.parse(JSON.stringify(source));
  duplicate.albums[0].photos[1].source = duplicate.albums[0].photos[0].source;
  assert.match(validatePhotoSources(duplicate).join('\n'), /duplicated/);

  const badRotation = JSON.parse(JSON.stringify(source));
  badRotation.albums[0].photos[0].rotation = 45;
  assert.match(validatePhotoSources(badRotation).join('\n'), /rotation/);

  const badId = JSON.parse(JSON.stringify(source));
  badId.albums[0].id = 'Portugal Album';
  assert.match(validatePhotoSources(badId).join('\n'), /must match/);
}

async function testManifestValidation(fixture) {
  assert.deepStrictEqual(validatePhotoManifest(fixture.manifest, fixture.source), []);

  const missing = JSON.parse(JSON.stringify(fixture.manifest));
  missing.albums[0].photos.pop();
  assert.match(validatePhotoManifest(missing, fixture.source).join('\n'), /missing a photo/);

  const wrongAlt = JSON.parse(JSON.stringify(fixture.manifest));
  wrongAlt.albums[0].photos[0].alt = 'wrong';
  assert.match(validatePhotoManifest(wrongAlt, fixture.source).join('\n'), /alt/);

  const oversized = JSON.parse(JSON.stringify(fixture.manifest));
  oversized.albums[0].photos[0].thumbnail.bytes = 200 * 1024;
  assert.match(validatePhotoManifest(oversized, fixture.source).join('\n'), /bytes/);

  const tooWide = JSON.parse(JSON.stringify(fixture.manifest));
  tooWide.albums[0].photos[0].thumbnail.width = 700;
  assert.match(validatePhotoManifest(tooWide, fixture.source).join('\n'), /600px/);
}

async function testGeneratedAssets(fixture) {
  const good = await validateGeneratedAssets(fixture.manifest, {
    publicDir: fixture.publicDir,
    generatedDir: fixture.generatedDir,
  });
  assert.deepStrictEqual(good.errors, []);
  assert.ok(good.totalBytes > 0);
  assert.strictEqual(good.checked, 8);

  writeFile(path.join(fixture.generatedDir, 'stale.webp'), 'stale');
  const stale = await validateGeneratedAssets(fixture.manifest, {
    publicDir: fixture.publicDir,
    generatedDir: fixture.generatedDir,
  });
  assert.match(stale.errors.join('\n'), /unreferenced generated file/);
  fs.unlinkSync(path.join(fixture.generatedDir, 'stale.webp'));

  const smallBytes = JSON.parse(JSON.stringify(fixture.manifest));
  smallBytes.albums[0].photos[0].full.bytes = 1;
  const wrongSize = await validateGeneratedAssets(smallBytes, {
    publicDir: fixture.publicDir,
    generatedDir: fixture.generatedDir,
  });
  assert.match(wrongSize.errors.join('\n'), /larger than manifest/);

  const wrongDimensions = JSON.parse(JSON.stringify(fixture.manifest));
  wrongDimensions.albums[0].photos[0].full.width = 100;
  const wrongDimensionsResult = await validateGeneratedAssets(wrongDimensions, {
    publicDir: fixture.publicDir,
    generatedDir: fixture.generatedDir,
  });
  assert.match(wrongDimensionsResult.errors.join('\n'), /dimensions do not match/);
}

function testHeadroom() {
  const MB = 1024 * 1024;
  assert.strictEqual(GENERATED_TOTAL_MAX_BYTES, 64 * MB);
  assert.strictEqual(remainingBytes(59.92 * MB), GENERATED_TOTAL_MAX_BYTES - 59.92 * MB);
  assert.match(
    describeGeneratedFootprint(59.92 * MB, 348),
    /59\.92 MB generated across 348 files; 4\.08 MB headroom of 64\.00 MB/,
  );
  assert.match(
    describeGeneratedFootprint(GENERATED_TOTAL_MAX_BYTES, 348),
    /0\.00 MB headroom of 64\.00 MB/,
  );
  assert.match(
    describeGeneratedFootprint(GENERATED_TOTAL_MAX_BYTES + MB, 348),
    /1\.00 MB over the 64\.00 MB limit/,
  );
}

async function main() {
  testHeadroom();
  await testSourceValidation();
  const fixture = await createPhotoFixture();
  try {
    await testManifestValidation(fixture);
    await testGeneratedAssets(fixture);
  } finally {
    cleanup(fixture);
  }
  console.log('Photo source, manifest, and limit tests passed.');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
