const fs = require('fs');
const path = require('path');

const {
  addCheck,
  createReport,
  printReport,
} = require('./lib/check-report');
const {
  APP_ROOT,
} = require('./lib/routes');

const MIN_NORMAL_TEXT = 4.5;
const MIN_NON_TEXT = 3;

const THEME_PAIRS = Object.freeze([
  { fg: 'site-text', bg: 'site-background', min: MIN_NORMAL_TEXT, label: 'body text on background' },
  { fg: 'site-text', bg: 'site-surface', min: MIN_NORMAL_TEXT, label: 'body text on surface' },
  { fg: 'site-muted', bg: 'site-background', min: MIN_NORMAL_TEXT, label: 'muted text on background' },
  { fg: 'site-muted', bg: 'site-surface', min: MIN_NORMAL_TEXT, label: 'muted text on surface' },
  { fg: 'site-subtle', bg: 'site-background', min: MIN_NORMAL_TEXT, label: 'subtle text on background' },
  { fg: 'site-subtle', bg: 'site-surface', min: MIN_NORMAL_TEXT, label: 'subtle text on surface' },
  { fg: 'site-on-text', bg: 'site-text', min: MIN_NORMAL_TEXT, label: 'text on inverse surface' },
  { fg: 'site-on-accent', bg: 'site-accent', min: MIN_NORMAL_TEXT, label: 'text on accent' },
  { fg: 'site-on-teal-hover', bg: 'site-teal-hover', min: MIN_NORMAL_TEXT, label: 'text on teal hover' },
  { fg: '#17262b', bg: 'site-teal-light', min: MIN_NORMAL_TEXT, label: 'selected navigation text' },
  { fg: 'site-teal', bg: 'site-background', min: MIN_NORMAL_TEXT, label: 'link accent on background' },
  { fg: 'site-teal', bg: 'site-surface', min: MIN_NORMAL_TEXT, label: 'link accent on surface' },
  { fg: 'site-accent', bg: 'site-background', min: MIN_NON_TEXT, label: 'focus ring on background' },
  { fg: 'site-accent', bg: 'site-surface', min: MIN_NON_TEXT, label: 'focus ring on surface' },
  { fg: 'site-muted', bg: 'site-border', min: MIN_NON_TEXT, label: 'disabled control text' },
]);

const FOCUS_STYLE_REQUIREMENTS = Object.freeze([
  {
    file: 'src/components/top-bar/TopBar.scss',
    selectors: [
      '.top-bar-button:focus-visible',
      '.top-bar-mark:focus-visible',
      '.theme-toggle:focus-visible',
    ],
  },
  { file: 'src/components/hobbies/PhotoAlbum.scss' },
  {
    file: 'src/components/about-me/AboutMe.scss',
    selectors: [
      '.primary-action:focus-visible',
      '.text-action:focus-visible',
    ],
  },
  { file: 'src/components/personal-projects/PersonalProjects.scss' },
  { file: 'src/components/personal-projects/photo-assistant.scss' },
]);

const SOURCE_EXTENSIONS = new Set(['.css', '.scss']);

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
}

function findBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`).exec(css);
  return match ? match[1] : '';
}

function extractVariables(block) {
  const variables = {};
  const pattern = /--([\w-]+)\s*:\s*(#(?:[0-9a-f]{3}|[0-9a-f]{6}))\s*;/gi;

  let match;
  while ((match = pattern.exec(block)) !== null) {
    variables[match[1]] = match[2];
  }

  return variables;
}

function parseThemeVariables(css) {
  return {
    light: extractVariables(findBlock(css, ':root')),
    dark: extractVariables(findBlock(css, ':root.dark-mode')),
  };
}

function parseHexColor(value) {
  const text = String(value || '').trim();
  if (!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(text)) return null;

  const hex = text.slice(1);
  const expanded = hex.length === 3
    ? hex.split('').map((character) => `${character}${character}`).join('')
    : hex;

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

function relativeLuminance(color) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    (0.2126 * channel(color.r))
    + (0.7152 * channel(color.g))
    + (0.0722 * channel(color.b))
  );
}

function contrastRatio(foreground, background) {
  const fg = parseHexColor(foreground);
  const bg = parseHexColor(background);
  if (!fg || !bg) {
    throw new Error(`Unsupported color pair: ${foreground} on ${background}`);
  }

  const lighter = Math.max(relativeLuminance(fg), relativeLuminance(bg));
  const darker = Math.min(relativeLuminance(fg), relativeLuminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveColor(value, variables) {
  if (value.startsWith('#')) return value;
  return variables[value];
}

function validateThemeContrast({ appRoot = APP_ROOT } = {}) {
  const cssPath = path.join(appRoot, 'src', 'index.css');
  if (!fs.existsSync(cssPath)) {
    return { checked: 0, failures: ['src/index.css is missing.'] };
  }

  const themes = parseThemeVariables(fs.readFileSync(cssPath, 'utf8'));
  const failures = [];
  let checked = 0;

  for (const [theme, variables] of Object.entries(themes)) {
    for (const pair of THEME_PAIRS) {
      const foreground = resolveColor(pair.fg, variables);
      const background = resolveColor(pair.bg, variables);
      const missing = [
        !foreground ? pair.fg : null,
        !background ? pair.bg : null,
      ].filter(Boolean);

      if (missing.length > 0) {
        failures.push(`${theme}: missing ${missing.map((name) => `--${name}`).join(' and ')} for ${pair.label}`);
        continue;
      }

      let ratio;
      try {
        ratio = contrastRatio(foreground, background);
      } catch (error) {
        failures.push(`${theme}: ${pair.label} ${error.message}`);
        continue;
      }

      checked += 1;
      if (ratio + 0.005 < pair.min) {
        failures.push(
          `${theme}: ${pair.label} is ${ratio.toFixed(2)}:1, below ${pair.min}:1`,
        );
      }
    }
  }

  return { checked, failures };
}

function hasAccentFocusRule(content) {
  const pattern = /:focus-visible[^{]*\{([^}]*)\}/g;

  let match;
  while ((match = pattern.exec(content)) !== null) {
    if (/outline\s*:\s*[^;]*var\(--site-accent\)/.test(match[1])) {
      return true;
    }
  }

  return false;
}

function validateFocusStyles({ appRoot = APP_ROOT } = {}) {
  const srcDir = path.join(appRoot, 'src');
  const failures = [];

  const indexCssPath = path.join(srcDir, 'index.css');
  if (!fs.existsSync(indexCssPath)) {
    failures.push('src/index.css is missing.');
  } else {
    const indexCss = fs.readFileSync(indexCssPath, 'utf8');
    const hasGlobalSelector = /:where\([^)]*\)\s*:focus-visible/.test(indexCss);
    if (!hasGlobalSelector || !hasAccentFocusRule(indexCss)) {
      failures.push('src/index.css must define a global :focus-visible outline using --site-accent.');
    }
  }

  for (const requirement of FOCUS_STYLE_REQUIREMENTS) {
    const filePath = path.join(appRoot, requirement.file);
    if (!fs.existsSync(filePath)) {
      failures.push(`${requirement.file} is missing.`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    if (!hasAccentFocusRule(content)) {
      failures.push(`${requirement.file} must keep a :focus-visible outline using --site-accent.`);
    }

    for (const selector of requirement.selectors || []) {
      if (!content.includes(selector)) {
        failures.push(`${requirement.file} must keep ${selector}.`);
      }
    }
  }

  const styles = walkFiles(srcDir);
  for (const file of styles) {
    const content = fs.readFileSync(file, 'utf8');
    if (/outline\s*:\s*(?:none|0(?:px)?)\s*(?:;|!)/i.test(content)) {
      failures.push(`${path.relative(appRoot, file)} disables focus outlines.`);
    }
  }

  return {
    checked: 1 + FOCUS_STYLE_REQUIREMENTS.length + styles.length,
    failures,
  };
}

function createThemeAccessibilityReport({ appRoot = APP_ROOT } = {}) {
  const report = createReport();

  const contrast = validateThemeContrast({ appRoot });
  addCheck(report, {
    id: 'theme.contrast',
    category: 'content',
    status: contrast.failures.length === 0 ? 'pass' : 'fail',
    detail: contrast.failures.length === 0
      ? `${contrast.checked} theme color pairs meet WCAG AA contrast`
      : contrast.failures.join('; '),
  });

  const focus = validateFocusStyles({ appRoot });
  addCheck(report, {
    id: 'theme.keyboard',
    category: 'content',
    status: focus.failures.length === 0 ? 'pass' : 'fail',
    detail: focus.failures.length === 0
      ? `${focus.checked} focus-style targets keep visible keyboard outlines`
      : focus.failures.join('; '),
  });

  return report;
}

if (require.main === module) {
  const report = createThemeAccessibilityReport();
  printReport(report, { json: process.argv.includes('--json') });
  process.exitCode = report.checks.some((check) => check.status === 'fail') ? 1 : 0;
}

module.exports = {
  FOCUS_STYLE_REQUIREMENTS,
  MIN_NON_TEXT,
  MIN_NORMAL_TEXT,
  THEME_PAIRS,
  contrastRatio,
  createThemeAccessibilityReport,
  parseHexColor,
  parseThemeVariables,
  validateFocusStyles,
  validateThemeContrast,
};
