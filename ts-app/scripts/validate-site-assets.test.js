const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  validateAlbumPhotos,
  validateBuildOutput,
  validateLocalAssets,
  validateManifest,
} = require('./validate-site-assets');

function writeFile(filePath, content = '') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function createFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'site-assets-'));
  const appRoot = path.join(root, 'ts-app');
  const repoRoot = root;

  writeFile(
    path.join(appRoot, 'src', 'App.tsx'),
    "const photo = `${process.env.PUBLIC_URL}/photos/hero.webp`;\n",
  );
  writeFile(
    path.join(appRoot, 'src', 'components', 'hobbies', 'Hobbies.tsx'),
    "const album = albumPhotos('portugal', ['IMG_0001.webp']);\n",
  );
  writeFile(path.join(appRoot, 'public', 'photos', 'hero.webp'), 'hero');
  writeFile(path.join(appRoot, 'public', 'flower.ico'), 'icon');
  writeFile(
    path.join(appRoot, 'public', 'index.html'),
    '<link rel="icon" href="%PUBLIC_URL%/flower.ico" />\n',
  );
  writeFile(
    path.join(appRoot, 'public', 'manifest.json'),
    JSON.stringify({ icons: [{ src: 'flower.ico', sizes: 'any', type: 'image/x-icon' }] }),
  );
  writeFile(path.join(root, 'photos', 'portugal', 'IMG_0001.webp'), 'photo');
  writeFile(path.join(appRoot, 'build', 'index.html'), 'index');
  writeFile(path.join(appRoot, 'build', '404.html'), 'fallback');
  writeFile(path.join(appRoot, 'build', 'flower.ico'), 'icon');
  writeFile(
    path.join(appRoot, 'build', 'manifest.json'),
    JSON.stringify({ icons: [{ src: 'flower.ico' }] }),
  );

  return { root, appRoot, repoRoot };
}

function remove(filePath) {
  fs.unlinkSync(filePath);
}

function cleanup(fixture) {
  fs.rmSync(fixture.root, { recursive: true, force: true });
}

const tests = [
  {
    name: 'accepts a complete fixture',
    run(fixture) {
      assert.deepStrictEqual(validateLocalAssets({ appRoot: fixture.appRoot }).missing, []);
      assert.deepStrictEqual(validateAlbumPhotos({ repoRoot: fixture.repoRoot }).missing, []);
      assert.deepStrictEqual(validateManifest({ appRoot: fixture.appRoot }).missing, []);
      assert.deepStrictEqual(validateBuildOutput({ appRoot: fixture.appRoot }).missing, []);
    },
  },
  {
    name: 'reports a missing local public asset',
    run(fixture) {
      remove(path.join(fixture.appRoot, 'public', 'photos', 'hero.webp'));
      const result = validateLocalAssets({ appRoot: fixture.appRoot });
      assert.match(result.missing.join('\n'), /photos\/hero\.webp/);
    },
  },
  {
    name: 'reports a missing album photo',
    run(fixture) {
      remove(path.join(fixture.repoRoot, 'photos', 'portugal', 'IMG_0001.webp'));
      const result = validateAlbumPhotos({ repoRoot: fixture.repoRoot });
      assert.deepStrictEqual(result.missing, ['photos/portugal/IMG_0001.webp']);
    },
  },
  {
    name: 'reports a missing manifest icon',
    run(fixture) {
      remove(path.join(fixture.appRoot, 'public', 'flower.ico'));
      const result = validateManifest({ appRoot: fixture.appRoot });
      assert.match(result.missing.join('\n'), /public\/flower\.ico/);
    },
  },
  {
    name: 'reports a missing 404 fallback',
    run(fixture) {
      remove(path.join(fixture.appRoot, 'build', '404.html'));
      const result = validateBuildOutput({ appRoot: fixture.appRoot });
      assert.deepStrictEqual(result.missing, ['build/404.html']);
    },
  },
];

for (const test of tests) {
  const fixture = createFixture();
  try {
    test.run(fixture);
    console.log(`PASS ${test.name}`);
  } finally {
    cleanup(fixture);
  }
}

console.log('Site asset validation tests passed.');
