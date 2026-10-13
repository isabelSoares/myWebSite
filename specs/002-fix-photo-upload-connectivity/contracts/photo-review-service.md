# Photo Review Service Contract

This is the browser-to-service contract for the portfolio’s external photo-analysis service. The service implementation is not in this repository; its owner must implement and verify the service-side requirements before production end-to-end acceptance.

## Destination Configuration

- The portfolio build receives the complete HTTPS review endpoint through `AI_ASSISTANT_URL` (exposed to the client as `REACT_APP_AI_ASSISTANT_URL`).
- The value must identify the active Cloudflare-hosted review handler. It must not be empty, a placeholder, a development/private URL, or `ai-photographer-assistant.onrender.com`.
- The frontend submits to the configured value as-is; a required service route must be part of the configured URL.

## Browser Request

| Property | Contract |
|---|---|
| Review request | `POST` to the configured review endpoint |
| Content type | `application/json` |
| Body | `{ "image": "<prepared image data URL>", "width": <positive number>, "height": <positive number>, "filename": "<selected filename>" }` |
| Origin | Production portfolio origin `https://isabelsoares.github.io` |
| Credentials | None in the current frontend contract |

Because the request uses JSON, a browser sends an `OPTIONS` preflight before the `POST`.

## Preflight Response

For the exact production origin, the service must answer preflight without requiring a JSON body and must:

- Allow origin `https://isabelsoares.github.io`.
- Allow method `POST`.
- Allow request header `Content-Type`.
- Avoid credential permission because the current client does not send cookies or credentials.
- Avoid redirects for the preflight response.

If origin selection is dynamic, include `Vary: Origin`. Local development origins may be added explicitly when needed. Do not use suffix/substring origin checks.

## Review Response

### Success

- Return a successful HTTP status and JSON compatible with the current `PhotoGuidanceResult` client shape:
  - `summary: string`
  - `subjects: DetectedObject[]`
  - `scenes: SceneLabel[]`
  - `tips: GuidanceTip[]`
  - `uncertain: boolean`
  - `notice: string | null`
  - `error_message: string | null`
- Include the appropriate CORS headers on the response so the browser can expose it to the portfolio.
- Do not cache photo-specific results; use `Cache-Control: no-store`.

### Failure

- Return a non-success HTTP status for a rejected request and a readable JSON body containing an `error` string. A stable `code` and `retryable` boolean are recommended for consistent visitor guidance.
- Include the same appropriate CORS headers on error responses as on successful responses. A browser must be able to expose the error response to the frontend.
- Do not include internal stack traces or provider secrets in public errors.
- Validate request structure, dimensions, and decoded image payload size server-side; browser-side file validation is not a security boundary.

## Deadline, Retry, and Privacy

- The browser presents a completed outcome or actionable failure within 30 seconds of the visitor starting review, including client-side image preparation and response parsing.
- The frontend performs explicit user-driven retries only. The service must not assume a browser timeout means remote processing was cancelled.
- The service and inference provider must satisfy the feature’s no-retention requirement, including log/observability configuration. Image bodies and full image-derived payloads must not be logged.
- CORS is not authentication or abuse prevention. Do not depend on origin checking to reject non-browser callers.

## Compatibility Note

Before implementation, confirm the active Cloudflare endpoint path and current Worker response/error shapes with the service owner. Any incompatible route or schema changes must be coordinated on both sides; the public portfolio must not ship a guessed hostname or path.
