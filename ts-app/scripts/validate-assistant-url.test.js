const assert = require('assert');
const { validateAssistantUrl } = require('./validate-assistant-url');

const invalidValues = [
  ['', 'missing'],
  ['assistant.example.com', 'absolute'],
  ['http://assistant.example.com', 'HTTPS'],
  ['http://localhost:8000', 'HTTPS'],
  ['https://127.0.0.1:8000', 'development'],
  ['https://192.168.1.20', 'development'],
  ['https://example.com', 'placeholder'],
  ['https://your-ai-assistant.onrender.com', 'placeholder'],
  ['https://github.com/isabelSoares/ai-photographer-assistant', 'repository'],
];

for (const [value, reason] of invalidValues) {
  const result = validateAssistantUrl(value);
  assert.strictEqual(result.valid, false, `${value} should be rejected`);
  assert.match(result.message, new RegExp(reason, 'i'));
}

for (const value of [
  'https://ai-photographer-assistant.onrender.com/',
  'https://ai-photographer-assistant.onrender.com/photo-review',
]) {
  assert.deepStrictEqual(validateAssistantUrl(value), { valid: true, url: value });
}

console.log('Assistant URL validation tests passed.');
