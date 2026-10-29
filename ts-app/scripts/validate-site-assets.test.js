const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  DARK_THEME_COLOR,
  createSiteAssetReport,
  validateAlbumPhotos,
  validateBuildOutput,
  validateLocalAssets,
  validateManifest,
} = require('./validate-site-assets');
const {
  cleanup,
  createPhotoFixture,
  writeFile,
} = require('./lib/test-fixtures');

async function createFixture() {
  const fixture = await createPhotoFixture();
  writeFile(
    path.join(fixture.appRoot, 'src', 'App.tsx'),
    "const icon = `${process.env.PUBLIC_URL}/flower.ico`;\n",
  );
  writeFile(path.join(fixture.publicDir, 'flower.ico'), 'icon');
  writeFile(
    path.join(fixture.publicDir, 'index.html'),
    '<link rel="icon" href="%PUBLIC_URL%/flower.ico" />\n',
  );
  writeFile(
    path.join(fixture.publicDir, 'manifest.json'),
    JSON.stringify({
      icons: [{ src: 'flower.ico', sizes: 'any', type: 'image/x-icon' }],
      theme_color: DARK_THEME_COLOR,
      background_color: DARK_THEME_COLOR,
    }),
  );
  writeFile(path.join(fixture.buildDir, 'index.html'), 'index');
  writeFile(path.join(fixture.buildDir, '404.html'), 'fallback');
  writeFile(path.join(fixture.buildDir, 'flower.ico'), 'icon');
  writeFile(
    path.join(fixture.buildDir, 'manifest.json'),
    JSON.stringify({
      icons: [{ src: 'flower.ico' }],
      theme_color: DARK_THEME_COLOR,
      background_color: DARK_THEME_COLOR,
    }),
  );
  return fixture;
}

function remove(filePath) {
  fs.unlinkSync(filePath);
}

function generatedFile(fixture) {
  const directory = path.join(fixture.generatedDir, 'albums', 'portugal');
  return path.join(directory, fs.readdirSync(directory)[0]);
}

async function main() {
  const tests = [
    {
      name: 'accepts a complete fixture',
      run(fixture) {
        assert.deepStrictEqual(validateLocalAssets({ appRoot: fixture.appRoot }).missing, []);
        assert.deepStrictEqual(validateAlbumPhotos({ appRoot: fixture.appRoot }).missing, []);
        assert.deepStrictEqual(validateManifest({ appRoot: fixture.appRoot }).missing, []);
        assert.deepStrictEqual(validateBuildOutput({ appRoot: fixture.appRoot }).missing, []);
        const report = createSiteAssetReport({ appRoot: fixture.appRoot });
        assert.ok(report.checks.every((check) => check.id !== 'assets.external'));
        assert.strictEqual(report.checks.find((check) => check.id === 'assets.photos').status, 'pass');
      },
    },
    {
      name: 'reports a missing local public asset',
      run(fixture) {
        remove(path.join(fixture.publicDir, 'flower.ico'));
        const result = validateLocalAssets({ appRoot: fixture.appRoot });
        assert.match(result.missing.join('\n'), /flower\.ico/);
      },
    },
    {
      name: 'reports a missing generated photo',
      run(fixture) {
        remove(generatedFile(fixture));
        const result = validateAlbumPhotos({ appRoot: fixture.appRoot });
        assert.match(result.missing.join('\n'), /photos\/generated\/albums\/portugal/);
      },
    },
    {
      name: 'reports a missing manifest icon',
      run(fixture) {
        remove(path.join(fixture.publicDir, 'flower.ico'));
        const result = validateManifest({ appRoot: fixture.appRoot });
        assert.match(result.missing.join('\n'), /public\/flower\.ico/);
      },
    },
    {
      name: 'reports manifest theme colors that are not the dark default',
      run(fixture) {
        writeFile(
          path.join(fixture.publicDir, 'manifest.json'),
          JSON.stringify({
            icons: [{ src: 'flower.ico', sizes: 'any', type: 'image/x-icon' }],
            theme_color: '#f4f0e8',
            background_color: '#f4f0e8',
          }),
        );
        const result = validateManifest({ appRoot: fixture.appRoot });
        assert.match(result.missing.join('\n'), /theme_color must be #17262b/);
        assert.match(result.missing.join('\n'), /background_color must be #17262b/);
      },
    },
    {
      name: 'reports a missing 404 fallback',
      run(fixture) {
        remove(path.join(fixture.buildDir, '404.html'));
        const result = validateBuildOutput({ appRoot: fixture.appRoot });
        assert.deepStrictEqual(result.missing, ['build/404.html']);
      },
    },
    {
      name: 'reports a missing photo manifest',
      run(fixture) {
        remove(fixture.manifestPath);
        const result = validateAlbumPhotos({ appRoot: fixture.appRoot });
        assert.strictEqual(result.sourceFound, false);
        assert.match(result.missing.join('\n'), /photo manifest is missing/);
      },
    },
  ];

  for (const test of tests) {
    const fixture = await createFixture();
    try {
      test.run(fixture);
      console.log(`PASS ${test.name}`);
    } finally {
      cleanup(fixture);
    }
  }

  console.log('Site asset validation tests passed.');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
