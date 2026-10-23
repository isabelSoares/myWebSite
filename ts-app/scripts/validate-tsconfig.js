const fs = require('fs');
const path = require('path');

const {
  EXIT_CODES,
  addCheck,
  createReport,
  exitCodeFor,
  printReport,
} = require('./lib/check-report');
const { APP_ROOT } = require('./lib/routes');

function validateTsConfig({ appRoot = APP_ROOT } = {}) {
  const configPath = path.join(appRoot, 'tsconfig.json');
  const errors = [];

  if (!fs.existsSync(configPath)) {
    return { errors: ['tsconfig.json is missing'], config: null };
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    return { errors: [`tsconfig.json is invalid JSON: ${error.message}`], config: null };
  }

  const compilerOptions = config.compilerOptions;
  if (!compilerOptions || typeof compilerOptions !== 'object') {
    return { errors: ['tsconfig.json compilerOptions must be an object'], config };
  }

  const target = String(compilerOptions.target || '').toUpperCase();
  if (target !== 'ES2020') errors.push('compilerOptions.target must be ES2020');

  const moduleResolution = String(compilerOptions.moduleResolution || '').toLowerCase();
  if (moduleResolution !== 'node') errors.push('compilerOptions.moduleResolution must be node');

  const module = String(compilerOptions.module || '').toLowerCase();
  if (module !== 'esnext') errors.push('compilerOptions.module must remain esnext');

  if (compilerOptions.ignoreDeprecations !== '6.0') {
    errors.push('compilerOptions.ignoreDeprecations must be "6.0" for TypeScript 4.9.5');
  }

  return { errors, config };
}

function createTsConfigReport({ appRoot = APP_ROOT } = {}) {
  const report = createReport();
  const result = validateTsConfig({ appRoot });
  addCheck(report, {
    id: 'config.tsconfig',
    category: 'content',
    status: result.errors.length === 0 ? 'pass' : 'fail',
    detail: result.errors.length === 0
      ? 'ES2020 target and TypeScript 4.9 deprecations are configured'
      : result.errors.join('; '),
  });
  return report;
}

function main() {
  const report = createTsConfigReport();
  printReport(report);
  return exitCodeFor(report);
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`TypeScript config check could not run: ${error.message}`);
    process.exitCode = EXIT_CODES.PREREQUISITE;
  }
}

module.exports = { createTsConfigReport, validateTsConfig };
