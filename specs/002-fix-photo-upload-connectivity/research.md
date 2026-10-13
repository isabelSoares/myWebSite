# Research: Fix Photo Upload Connectivity

## Current-state findings

- `PhotoAssistant.tsx` posts a JSON body containing a resized JPEG data URL, dimensions, and filename to the configured URL. `Content-Type: application/json` requires a browser preflight for a cross-origin request.
- `AI_ASSISTANT_URL` is injected into the GitHub Pages build as `REACT_APP_AI_ASSISTANT_URL`; the active value is not in this repository.
- The URL validator currently accepts the retired `ai-photographer-assistant.onrender.com` host, including its root and `/photo-review` paths.
- The frontend validates image formats and size locally, shows an in-progress state, and allows manual resubmission after a request failure. It has no deadline/abort behavior, and a network rejection may be shown as the raw `Failed to fetch` error.
- This checkout contains no Cloudflare Worker or inference-provider source. CORS response behavior and end-to-end photo retention therefore cannot be verified or changed here alone.

## Decisions

### Active service address

**Decision**: Continue to inject the complete active review-service URL through the existing `AI_ASSISTANT_URL` deployment variable, and reject the known retired Render host during validation.

**Rationale**: The frontend already accepts the service URL as configuration and posts to it directly. An environment-provided URL avoids hard-coding deployment details in the static site. Explicitly rejecting the retired host closes a current validation gap: tests presently treat it as valid.

**Alternatives considered**: Hard-code a presumed Worker hostname (rejected because the deployed Cloudflare URL is unavailable in this repository); allow any HTTPS URL (rejected because it permits accidental deployment back to the known dead host).

### Cross-origin service access

**Decision**: The companion Worker must handle `OPTIONS` before request-body parsing, allow the exact published origin `https://isabelsoares.github.io` for `POST` with `Content-Type`, and include the appropriate CORS headers on actual success and error responses. Do not enable credentials for the current cookie-free request.

**Rationale**: The browser preflights the current JSON request. CORS response headers must come from the service; changing only portfolio code cannot make a missing preflight response pass. Exact origin matching is sufficient for the deployed site and avoids granting browser access to unrelated websites. CORS is not authentication and does not prevent direct non-browser requests.

**Alternatives considered**: Wildcard origin (unnecessarily broad); changing JSON to a safelisted content type to avoid preflight (misrepresents the payload and evades rather than fixes the service policy); adding a frontend-shipped secret (not secret in a public static application).

### Deadline, failures, and retry

**Decision**: Enforce the 30-second visitor-visible deadline from the review action, covering image preparation, network exchange, and response parsing. Show progress immediately, replace raw network exceptions with actionable plain language, retain the valid selection, and require an explicit user retry. Ignore late responses from a request that has already timed out.

**Rationale**: Browser `fetch` rejects for network-level failures, including CORS failures, but does not reject solely because an HTTP response is 4xx/5xx. The frontend must check HTTP status and handle network/timeout/invalid-response cases separately. A timed-out POST may still be processing remotely; automatic retry could duplicate work or inference cost without server idempotency.

**Alternatives considered**: Automatic retry (rejected absent an idempotency contract); no timeout (conflicts with the specification and leaves visitors waiting indefinitely); claim that aborting the browser request cancels Worker/upstream processing (not guaranteed).

### Request/response contract

**Decision**: Preserve the existing JSON request fields and successful guidance result shape for this feature. Require readable structured errors on non-success responses and CORS headers on all responses. Coordinate any schema change with the companion Worker.

**Rationale**: Existing code already depends on the photo result fields (`summary`, `subjects`, `scenes`, `tips`, `uncertain`, `notice`, and `error_message`) and sends `image`, `width`, `height`, and `filename`. A coordinated contract avoids breaking the currently deployed service while making failures usable by the frontend.

**Alternatives considered**: Switch to multipart binary upload (not justified absent measured payload-size issues and would require a coordinated contract change); change the success response schema during the connectivity repair (unnecessary scope).

### Privacy and retention

**Decision**: Keep the specification’s no-retention outcome as a release requirement, but verify it across Worker code, Worker logging configuration, and the inference provider before asserting it end-to-end. Do not log image bodies or full image-derived payloads. If retention cannot be verified or controlled, revise the privacy claim before release rather than treating transient React state as proof of service-side non-retention.

**Rationale**: Frontend state is transient, but requests cross a Worker and may be sent to a model provider. Application storage, operational logs, and provider retention are distinct. A client-only review cannot establish end-to-end privacy.

**Alternatives considered**: Assume that no database means no retention (rejected because logging and provider policies remain); remove the privacy requirement silently (rejected because it contradicts the feature specification).

## External references

- [MDN: CORS guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) — preflight conditions, response headers, origin selection, and credentials.
- [Cloudflare Workers: CORS header proxy example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — Worker preflight and response-header patterns.
- [MDN: Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) — network rejection versus HTTP error status behavior.
- [MDN: AbortSignal.timeout()](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static) — browser timeout semantics; verify support against the project’s browser targets before selecting an API.
- [RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2) — idempotency and safe retry considerations.
- [Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/) — invocation/custom logs and retention configuration.
- [Cloudflare Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) — server-side verification if abuse controls are needed; not selected as part of this feature.
