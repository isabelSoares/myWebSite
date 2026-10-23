const assert = require('assert');

const { validateTsConfig } = require('./validate-tsconfig');
const { cleanup, createTempApp, writeJson } = require('./lib/test-fixtures');

function config(overrides = {}) {
  return {
    compilerOptions: {
      target: 'ES2020',
      module: 'esnext',
      moduleResolution: 'node',
      ignoreDeprecations: '6.0',
      ...overrides,
    },
  };
}

function main() {
  const fixture = createTempApp();
  try {
    writeJson(`${fixture.appRoot}/tsconfig.json`, config());
    assert.deepStrictEqual(validateTsConfig({ appRoot: fixture.appRoot }).errors, []);

    writeJson(`${fixture.appRoot}/tsconfig.json`, config({ target: 'es5' }));
    assert.match(validateTsConfig({ appRoot: fixture.appRoot }).errors.join('\n'), /ES2020/);

    writeJson(`${fixture.appRoot}/tsconfig.json`, config({ ignoreDeprecations: undefined }));
    assert.match(validateTsConfig({ appRoot: fixture.appRoot }).errors.join('\n'), /ignoreDeprecations/);

    writeJson(`${fixture.appRoot}/tsconfig.json`, config({ moduleResolution: 'bundler' }));
    assert.match(validateTsConfig({ appRoot: fixture.appRoot }).errors.join('\n'), /node/);

    console.log('TypeScript config tests passed.');
  } finally {
    cleanup(fixture);
  }
}

main();
