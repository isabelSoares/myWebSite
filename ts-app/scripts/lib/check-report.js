const CATEGORIES = Object.freeze([
  'content',
  'assets',
  'routes',
  'deployment',
  'performance',
]);

const STATUSES = Object.freeze(['pass', 'fail', 'skip', 'warn']);

const EXIT_CODES = Object.freeze({
  PASS: 0,
  FAIL: 1,
  PREREQUISITE: 2,
});

function assertValue(value, allowed, name) {
  if (!allowed.includes(value)) {
    throw new Error(`${name} must be one of: ${allowed.join(', ')}`);
  }
}

function createReport() {
  return { checks: [] };
}

function addCheck(report, { id, category, status, detail }) {
  if (!id || typeof id !== 'string') {
    throw new Error('Check id is required.');
  }
  assertValue(category, CATEGORIES, 'Check category');
  assertValue(status, STATUSES, 'Check status');

  report.checks.push({
    id,
    category,
    status,
    detail: detail || '',
  });

  return report.checks[report.checks.length - 1];
}

function summarize(report) {
  const summary = { passed: 0, failed: 0, warnings: 0, skipped: 0 };

  for (const check of report.checks) {
    if (check.status === 'pass') summary.passed += 1;
    if (check.status === 'fail') summary.failed += 1;
    if (check.status === 'warn') summary.warnings += 1;
    if (check.status === 'skip') summary.skipped += 1;
  }

  return { status: summary.failed > 0 ? 'fail' : 'pass', summary };
}

function formatCheck(check) {
  return `[${check.status.toUpperCase()}] ${check.id} - ${check.detail}`;
}

function formatFinalLine(report) {
  const { status, summary } = summarize(report);

  if (status === 'fail') {
    return `Release check: FAIL (${summary.failed} failed)`;
  }

  return `Release check: PASS (${summary.passed} passed, ${summary.warnings} warnings, ${summary.skipped} skipped)`;
}

function printReport(report, { json = false, log = console.log } = {}) {
  if (json) {
    const { status, summary } = summarize(report);
    log(JSON.stringify({ status, checks: report.checks, summary }, null, 2));
    return;
  }

  for (const check of report.checks) {
    log(formatCheck(check));
  }
  log(formatFinalLine(report));
}

function exitCodeFor(report) {
  return summarize(report).status === 'fail' ? EXIT_CODES.FAIL : EXIT_CODES.PASS;
}

function truncateOutput(value, maxLength = 600) {
  const text = String(value || '').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

module.exports = {
  CATEGORIES,
  EXIT_CODES,
  STATUSES,
  addCheck,
  createReport,
  exitCodeFor,
  formatCheck,
  formatFinalLine,
  printReport,
  summarize,
  truncateOutput,
};
