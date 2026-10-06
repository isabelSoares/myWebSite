const configuredAssistantUrl = process.env.REACT_APP_AI_ASSISTANT_URL?.trim();

// This fallback is for local rendering/tests only. Production builds validate the environment value first.
export const AI_ASSISTANT_URL = configuredAssistantUrl || 'https://ai-photographer-assistant.example.invalid';
