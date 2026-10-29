const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  EXIT_CODES,
  addCheck,
  createReport,
  printReport,
  truncateOutput,
} = require('./lib/check-report');
const {
  APP_ROOT,
  BUILD_DIR,
  REPO_ROOT,
  REQUIRED_BUILD_FILES,
} = require('./lib/routes');
const { validateAssistantUrl } = require('./validate-assistant-url');
const {
  createSiteAssetReport,
  validateBuildOutput,
} = require('./validate-site-assets');
const { createPhotoPrivacyReport } = require('./validate-photo-privacy');
const { createThemeAccessibilityReport } = require('./validate-theme-accessibility');
const { createTsConfigReport } = require('./validate-tsconfig');

const EXTERNAL_URLS = [
  'https://www.instagram.com/isabel.infilm/',
  'https://www.linkedin.com/in/isabel-soares-58116b1a4',
  'https://github.com/isabelSoares',
  'https://github.com/isabelSoares/ai-photographer-assistant',
  'https://github.com/isabelSoares/cv-detect-people-my-gallery',
];

const SECRET_PATTERNS = [
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS access key', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'GitHub token', pattern: /gh[pousr]_[A-Za-z0-9]{30,}/ },
  { name: 'GitHub fine-grained token', pattern: /github_pat_[A-Za-z0-9_]{20,}/ },
  { name: 'OpenAI-style token', pattern: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'Slack token', pattern: /xox[baprs]-[A-Za-z0-9-]{10,}/ },
  { name: 'Cloudflare token assignment', pattern: /CLOUDFLARE_API_TOKEN\s*[:=]\s*['"]?[A-Za-z0-9_-]{20,}/ },
];

const TEXT_EXTENSIONS = new Set([
  '.css', '.env', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.scss',
  '.sh', '.svg', '.ts', '.tsx', '.txt', '.yaml', '.yml',
]);

function parseArgs(argv) {
  return {
    json: argv.includes('--json'),
    online: argv.includes('--online'),
  };
}

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: APP_ROOT,
    env: { ...process.env, CI: 'true' },
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.error) {
    return { ok: false, output: result.error.message };
  }

  return {
    ok: result.status === 0,
    output: truncateOutput(`${result.stdout || ''}\n${result.stderr || ''}`),
  };
}

function commandCheck(report, { id, category, command, args, successDetail }) {
  const { ok, output } = runCommand(command, args);
  addCheck(report, {
    id,
    category,
    status: ok ? 'pass' : 'fail',
    detail: ok ? successDetail : output || 'command failed',
  });
  return ok;
}

function typeCheck(report) {
  const { ok, output } = runCommand(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['tsc', '--noEmit'],
  );

  addCheck(report, {
    id: 'types',
    category: 'content',
    status: ok ? 'pass' : 'fail',
    detail: ok ? 'TypeScript type check passed' : output || 'type check failed',
  });

  const deprecation = /deprecat/i.test(output);
  addCheck(report, {
    id: 'types.deprecations',
    category: 'content',
    status: ok && !deprecation ? 'pass' : 'fail',
    detail: ok
      ? (deprecation ? truncateOutput(output) : 'no TypeScript deprecation warnings')
      : 'type check must pass before deprecation warnings can be evaluated',
  });
}

function configChecks(report) {
  const configReport = createTsConfigReport();
  for (const check of configReport.checks) {
    addCheck(report, check);
  }
}

async function photoPrivacyChecks(report) {
  const photoReport = await createPhotoPrivacyReport();
  for (const check of photoReport.checks) {
    addCheck(report, check);
  }
}

function themeAccessibilityChecks(report) {
  const accessibilityReport = createThemeAccessibilityReport();
  for (const check of accessibilityReport.checks) {
    addCheck(report, check);
  }
}

function scriptTestsCheck(report) {
  const scripts = [
    'scripts/validate-assistant-url.test.js',
    'scripts/validate-site-assets.test.js',
    'scripts/validate-theme-accessibility.test.js',
    'scripts/validate-photo-limits.test.js',
    'scripts/build-photos.test.js',
    'scripts/validate-photo-privacy.test.js',
    'scripts/validate-tsconfig.test.js',
  ];
  const failures = [];

  for (const script of scripts) {
    const { ok, output } = runCommand(process.execPath, [script]);
    if (!ok) {
      failures.push(`${script}: ${output}`);
    }
  }

  addCheck(report, {
    id: 'tests.scripts',
    category: 'content',
    status: failures.length === 0 ? 'pass' : 'fail',
    detail: failures.length === 0
      ? 'Node release-script tests passed'
      : failures.join('; '),
  });
}

function assistantUrlCheck(report) {
  const value = process.env.REACT_APP_AI_ASSISTANT_URL;
  const result = validateAssistantUrl(value);

  if (!result.valid) {
    addCheck(report, {
      id: 'assistant-url',
      category: 'deployment',
      status: 'fail',
      detail: result.message,
    });
    return false;
  }

  let host = 'configured host';
  try {
    host = new URL(result.url).hostname;
  } catch {
    host = 'configured host';
  }

  addCheck(report, {
    id: 'assistant-url',
    category: 'deployment',
    status: 'pass',
    detail: `assistant endpoint is valid (${host})`,
  });
  return true;
}

function copySiteAssetChecks(report) {
  const assetReport = createSiteAssetReport({ requireBuild: false });
  for (const check of assetReport.checks) {
    addCheck(report, check);
  }
}

function ensurePagesFallback() {
  const index = path.join(BUILD_DIR, 'index.html');
  const fallback = path.join(BUILD_DIR, '404.html');
  if (fs.existsSync(index) && !fs.existsSync(fallback)) {
    fs.copyFileSync(index, fallback);
  }
}

function fallbackCheck(report) {
  const missing = REQUIRED_BUILD_FILES
    .filter((file) => !fs.existsSync(path.join(BUILD_DIR, file)))
    .map((file) => `build/${file}`);

  addCheck(report, {
    id: 'routes.fallback',
    category: 'routes',
    status: missing.length === 0 ? 'pass' : 'fail',
    detail: missing.length === 0
      ? 'index.html and 404.html exist'
      : `missing: ${missing.join('; ')}`,
  });
}

function buildAssetsCheck(report) {
  const result = validateBuildOutput({ appRoot: APP_ROOT });
  addCheck(report, {
    id: 'assets.build',
    category: 'assets',
    status: result.missing.length === 0 ? 'pass' : 'fail',
    detail: result.missing.length === 0
      ? 'build output and manifest icons resolve'
      : `missing: ${result.missing.join('; ')}`,
  });
}

function privacyCheck(report) {
  const tracked = spawnSync('git', ['ls-files', '-z'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });

  if (tracked.error || tracked.status !== 0) {
    addCheck(report, {
      id: 'privacy.no-secrets',
      category: 'deployment',
      status: 'fail',
      detail: tracked.error ? tracked.error.message : truncateOutput(tracked.stderr),
    });
    return;
  }

  const findings = [];
  for (const file of tracked.stdout.split('\0').filter(Boolean)) {
    if (!TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) continue;
    const fullPath = path.join(REPO_ROOT, file);
    if (!fs.existsSync(fullPath)) continue;

    let content;
    try {
      content = fs.readFileSync(fullPath, 'utf8');
    } catch {
      continue;
    }

    for (const { name, pattern } of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        findings.push(`${name} in ${file}`);
      }
    }
  }

  addCheck(report, {
    id: 'privacy.no-secrets',
    category: 'deployment',
    status: findings.length === 0 ? 'pass' : 'fail',
    detail: findings.length === 0
      ? 'no committed credential patterns detected'
      : findings.join('; '),
  });
}

async function checkExternalUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: controller.signal });
    if (response.status === 405 || response.status === 501) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal });
    }
    return { url, status: response.status, ok: response.status < 500 };
  } catch (error) {
    return { url, status: 0, ok: false, error: error.message };
  } finally {
    clearTimeout(timeout);
  }
}

async function externalLinksCheck(report, online) {
  if (!online) {
    addCheck(report, {
      id: 'links.external',
      category: 'routes',
      status: 'skip',
      detail: 'online checks not requested',
    });
    return;
  }

  const urls = [...EXTERNAL_URLS];
  if (process.env.REACT_APP_AI_ASSISTANT_URL) {
    urls.push(process.env.REACT_APP_AI_ASSISTANT_URL);
  }

  const results = await Promise.all(urls.map(checkExternalUrl));
  const softStatuses = new Set([403, 429, 999]);
  const hardFailures = results.filter((result) => !result.ok && !softStatuses.has(result.status));
  const softFailures = results.filter((result) => softStatuses.has(result.status));
  const detail = results
    .map((result) => `${result.url} -> ${result.status || result.error || 'unreachable'}`)
    .join('; ');

  addCheck(report, {
    id: 'links.external',
    category: 'routes',
    status: hardFailures.length === 0 ? (softFailures.length > 0 ? 'warn' : 'pass') : 'fail',
    detail: hardFailures.length === 0 ? detail : `unreachable: ${detail}`,
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const report = createReport();

  typeCheck(report);
  configChecks(report);

  commandCheck(report, {
    id: 'lint',
    category: 'content',
    command: process.platform === 'win32' ? 'npx.cmd' : 'npx',
    args: ['eslint', 'src', '--ext', '.ts,.tsx'],
    successDetail: 'ESLint passed',
  });

  commandCheck(report, {
    id: 'tests',
    category: 'content',
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['test', '--', '--watchAll=false'],
    successDetail: 'Jest test suite passed',
  });

  scriptTestsCheck(report);
  assistantUrlCheck(report);
  copySiteAssetChecks(report);
  themeAccessibilityChecks(report);

  commandCheck(report, {
    id: 'build',
    category: 'deployment',
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['run', 'build'],
    successDetail: 'production build completed',
  });

  ensurePagesFallback();
  fallbackCheck(report);
  buildAssetsCheck(report);
  await photoPrivacyChecks(report);
  privacyCheck(report);
  await externalLinksCheck(report, options.online);

  printReport(report, { json: options.json });
  return report.checks.some((check) => check.status === 'fail')
    ? EXIT_CODES.FAIL
    : EXIT_CODES.PASS;
}

if (require.main === module) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(`Release check could not run: ${error.message}`);
      process.exitCode = EXIT_CODES.PREREQUISITE;
    });
}

module.exports = { main };
