const PLACEHOLDER_HOSTS = new Set(['example.com', 'example.invalid', 'example.test']);

function isPrivateHost(hostname) {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1' || host === '0.0.0.0') {
    return true;
  }
  if (/^(10|127)\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host)) {
    return true;
  }
  const private172 = host.match(/^172\.(\d+)\./);
  return Boolean(private172 && Number(private172[1]) >= 16 && Number(private172[1]) <= 31);
}

function validateAssistantUrl(value) {
  if (!value || !value.trim()) {
    return { valid: false, message: 'Assistant URL is missing.' };
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return { valid: false, message: 'Assistant URL must be an absolute URL.' };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (parsed.protocol !== 'https:') {
    return { valid: false, message: 'Assistant URL must use HTTPS.' };
  }
  if (parsed.username || parsed.password) {
    return { valid: false, message: 'Assistant URL must not contain credentials.' };
  }
  if (isPrivateHost(hostname)) {
    return { valid: false, message: 'Assistant URL must not point to a development or private host.' };
  }
  if (PLACEHOLDER_HOSTS.has(hostname) || hostname.endsWith('.example.com') || hostname.endsWith('.example.invalid')) {
    return { valid: false, message: 'Assistant URL must not be a placeholder.' };
  }
  if (hostname === 'github.com' || hostname.endsWith('.github.com')) {
    return { valid: false, message: 'Assistant URL must point to the deployed application, not its repository.' };
  }
  if (/your[-_]|replace[-_]?me|todo|example|placeholder/i.test(value)) {
    return { valid: false, message: 'Assistant URL must not be a placeholder.' };
  }

  return { valid: true, url: value };
}

if (require.main === module) {
  const result = validateAssistantUrl(process.env.REACT_APP_AI_ASSISTANT_URL);
  if (!result.valid) {
    console.error(result.message);
    process.exit(1);
  }
  console.log(`Assistant URL validated: ${result.url}`);
}

module.exports = { validateAssistantUrl };
