const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  FOCUS_STYLE_REQUIREMENTS,
  contrastRatio,
  createThemeAccessibilityReport,
  parseThemeVariables,
  validateFocusStyles,
  validateThemeContrast,
} = require('./validate-theme-accessibility');

const THEME_CSS = `:root {
  color-scheme: light;
  --site-background: #f4f0e8;
  --site-surface: #fffdf8;
  --site-text: #17262b;
  --site-muted: #53676a;
  --site-subtle: #5f7071;
  --site-border: #cdd2c9;
  --site-accent: #243b53;
  --site-teal: #155e63;
  --site-teal-hover: #155e63;
  --site-teal-light: #63b3b5;
  --site-on-teal-hover: #fffdf8;
  --site-on-accent: #fffdf8;
  --site-on-text: #fffdf8;
}

:root.dark-mode {
  color-scheme: dark;
  --site-background: #17262b;
  --site-surface: #20383d;
  --site-text: #f4f0e8;
  --site-muted: #c4d0d0;
  --site-subtle: #a5b5b5;
  --site-border: #486269;
  --site-accent: #f2c94c;
  --site-teal: #63b3b5;
  --site-teal-hover: #24585d;
  --site-teal-light: #7ddbdb;
  --site-on-teal-hover: #f4f0e8;
  --site-on-accent: #17262b;
  --site-on-text: #17262b;
}

:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--site-accent);
  outline-offset: 3px;
}
`;

const FOCUS_SCSS = `.top-bar-button:focus-visible,
.top-bar-mark:focus-visible,
.theme-toggle:focus-visible,
.primary-action:focus-visible,
.text-action:focus-visible,
.film-frame:focus-visible,
.assistant-repo-link:focus-visible {
  outline: 3px solid var(--site-accent);
  outline-offset: 3px;
}
`;

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function createFixture() {
  const appRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-accessibility-'));
  writeFile(path.join(appRoot, 'src', 'index.css'), THEME_CSS);
  for (const requirement of FOCUS_STYLE_REQUIREMENTS) {
    writeFile(path.join(appRoot, requirement.file), FOCUS_SCSS);
  }
  return appRoot;
}

function cleanup(appRoot) {
  fs.rmSync(appRoot, { recursive: true, force: true });
}

function main() {
  const tests = [
    {
      name: 'calculates WCAG contrast ratios',
      run() {
        assert.ok(Math.abs(contrastRatio('#000000', '#ffffff') - 21) < 0.01);
        assert.ok(Math.abs(contrastRatio('#ffffff', '#ffffff') - 1) < 0.01);
      },
    },
    {
      name: 'parses light and dark theme variables',
      run() {
        const themes = parseThemeVariables(THEME_CSS);
        assert.strictEqual(themes.light['site-text'], '#17262b');
        assert.strictEqual(themes.dark['site-text'], '#f4f0e8');
      },
    },
    {
      name: 'accepts theme contrast that meets WCAG AA',
      run(appRoot) {
        const result = validateThemeContrast({ appRoot });
        assert.deepStrictEqual(result.failures, []);
        assert.ok(result.checked > 20);
      },
    },
    {
      name: 'reports low theme contrast',
      run(appRoot) {
        writeFile(
          path.join(appRoot, 'src', 'index.css'),
          THEME_CSS.replace('--site-text: #17262b;', '--site-text: #f4f0e8;'),
        );
        const result = validateThemeContrast({ appRoot });
        assert.match(result.failures.join('\n'), /light: body text on background is 1\.00:1, below 4\.5:1/);
      },
    },
    {
      name: 'reports a missing theme variable',
      run(appRoot) {
        writeFile(
          path.join(appRoot, 'src', 'index.css'),
          THEME_CSS.replace('  --site-muted: #53676a;\n', ''),
        );
        const result = validateThemeContrast({ appRoot });
        assert.match(result.failures.join('\n'), /light: missing --site-muted for muted text on background/);
      },
    },
    {
      name: 'accepts component and global keyboard focus styles',
      run(appRoot) {
        const result = validateFocusStyles({ appRoot });
        assert.deepStrictEqual(result.failures, []);
      },
    },
    {
      name: 'reports a missing global focus fallback',
      run(appRoot) {
        writeFile(
          path.join(appRoot, 'src', 'index.css'),
          THEME_CSS.replace(/:where\([^)]*\):focus-visible \{[\s\S]*?\}\n/, ''),
        );
        const result = validateFocusStyles({ appRoot });
        assert.match(result.failures.join('\n'), /global :focus-visible outline/);
      },
    },
    {
      name: 'reports a missing focus selector on a key control',
      run(appRoot) {
        const filePath = path.join(appRoot, 'src/components/top-bar/TopBar.scss');
        writeFile(
          filePath,
          fs.readFileSync(filePath, 'utf8').replace('.theme-toggle:focus-visible,', ''),
        );
        const result = validateFocusStyles({ appRoot });
        assert.match(result.failures.join('\n'), /must keep \.theme-toggle:focus-visible/);
      },
    },
    {
      name: 'reports focus outline suppression',
      run(appRoot) {
        const filePath = path.join(appRoot, 'src/components/hobbies/PhotoAlbum.scss');
        writeFile(
          filePath,
          `${fs.readFileSync(filePath, 'utf8')}\n.unused:focus-visible { outline: none; }\n`,
        );
        const result = validateFocusStyles({ appRoot });
        assert.match(result.failures.join('\n'), /PhotoAlbum\.scss disables focus outlines/);
      },
    },
    {
      name: 'creates a passing theme accessibility report',
      run(appRoot) {
        const report = createThemeAccessibilityReport({ appRoot });
        assert.deepStrictEqual(report.checks.map((check) => check.id), ['theme.contrast', 'theme.keyboard']);
        assert.ok(report.checks.every((check) => check.status === 'pass'));
      },
    },
  ];

  for (const test of tests) {
    const appRoot = createFixture();
    try {
      test.run(appRoot);
      console.log(`PASS ${test.name}`);
    } finally {
      cleanup(appRoot);
    }
  }

  console.log('Theme accessibility validation tests passed.');
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
