const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const originals = fs.mkdtempSync(path.join(os.tmpdir(), 'photo-originals-'));
process.env.PHOTO_ORIGINALS_DIR = originals;

const { encodeVariant, qualitiesFor, resolveOriginal } = require('./build-photos');
const { cleanup, createTempApp, writeImage } = require('./lib/test-fixtures');

async function main() {
  const fixture = createTempApp();
  try {
    const source = path.join(originals, 'portugal', 'oriented.jpg');
    await writeImage(source, { width: 400, height: 200, quality: 80, orientation: 6 });

    assert.strictEqual(resolveOriginal('portugal/oriented.jpg'), source);
    assert.throws(() => resolveOriginal('../secret.webp'), /escapes PHOTO_ORIGINALS_DIR/);
    assert.throws(() => resolveOriginal('/etc/passwd'), /escapes PHOTO_ORIGINALS_DIR/);

    const destination = path.join(fixture.publicDir, 'photos', 'generated', 'portugal', 'one.webp');
    const full = await encodeVariant(
      source,
      destination,
      { width: 1800, height: 2000, maxDimension: 2000, maxBytes: 500 * 1024, quality: 80 },
      'test full',
      { publicDir: fixture.publicDir },
    );

    assert.strictEqual(full.src, 'photos/generated/portugal/one.webp');
    assert.strictEqual(full.width, 200);
    assert.strictEqual(full.height, 400);
    assert.ok(full.bytes <= 500 * 1024);

    const info = await sharp(destination).metadata();
    assert.strictEqual(info.format, 'webp');
    assert.strictEqual(info.exif, undefined);

    const smallDestination = path.join(fixture.publicDir, 'photos', 'generated', 'portugal', 'small.webp');
    const small = await encodeVariant(
      source,
      smallDestination,
      { width: 100, height: 100, maxDimension: 100, maxBytes: 500 * 1024, quality: 80 },
      'test small',
      { publicDir: fixture.publicDir },
    );
    assert.ok(Math.max(small.width, small.height) <= 100);

    await assert.rejects(
      encodeVariant(
        source,
        path.join(fixture.publicDir, 'photos', 'generated', 'portugal', 'impossible.webp'),
        { width: 1800, height: 2000, maxDimension: 2000, maxBytes: 10, quality: 80 },
        'test impossible',
        { publicDir: fixture.publicDir },
      ),
      /exceeds 10 bytes/,
    );

    assert.ok(qualitiesFor({ quality: 80 }).every((quality) => quality >= 20));
    console.log('Photo build tests passed.');
  } finally {
    cleanup(fixture);
    fs.rmSync(originals, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
