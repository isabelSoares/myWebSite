# Quickstart: Fix Photo Upload Connectivity

## Prerequisites

- Node.js 24+ and npm, as required by the portfolio repository.
- The active Cloudflare review endpoint URL and access to the GitHub repository variable `AI_ASSISTANT_URL`.
- The Cloudflare account has a registered `workers.dev` subdomain or a custom route for the Worker.
- Access to the companion assistant service repository to deploy and verify preflight, response CORS headers, and no-retention behavior.
- A supported test image (JPG, PNG, or WEBP) no larger than 10 MB. Use a non-sensitive image for manual testing.

## Local checks

Run from `ts-app/`:

```sh
npm ci
npm run test:assistant-url
npm test -- --watchAll=false
REACT_APP_AI_ASSISTANT_URL="https://<active-cloudflare-review-endpoint>" npm run validate:assistant-url
REACT_APP_AI_ASSISTANT_URL="https://<active-cloudflare-review-endpoint>" npm run build
```

Expected outcomes:

- URL validation rejects missing, placeholder, local/private, insecure, GitHub repository, and retired Render service URLs.
- Component tests verify successful review, visible progress, network/HTTP/invalid-response failures, the 30-second timeout state, and explicit retry without reselecting a valid photo.
- The build completes using the configured Cloudflare URL; it does not use the `example.invalid` test fallback.

## Service preflight check

Set `ASSISTANT_URL` to the complete active review endpoint, then run:

```sh
curl -i -X OPTIONS "$ASSISTANT_URL" \
  -H 'Origin: https://isabelsoares.github.io' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Expected response: a successful preflight response permitting the exact portfolio origin, `POST`, and `Content-Type`, without redirecting. The actual `POST` success and error responses must also include the appropriate CORS headers. Do not include a real photo in this preflight request.

## Published end-to-end check

1. Configure the active complete Cloudflare review URL as GitHub repository variable `AI_ASSISTANT_URL` and deploy the portfolio.
2. From `https://isabelsoares.github.io/myWebSite/projects`, select a supported test image and choose **Review photo**.
3. Verify progress appears promptly and guidance arrives within 30 seconds while the service is healthy.
4. In browser developer tools, verify the preflight and review request target the configured Cloudflare URL (never the retired Render host); verify there is no browser-origin access error.
5. Simulate a service failure and a response that exceeds the client deadline. Confirm an actionable failure appears within 30 seconds and the visitor can explicitly retry without refreshing or reselecting the image.
6. Confirm unsupported and oversized files are rejected before submission.
7. Verify the Worker and its inference provider do not retain the submitted photo or result, including through request-body logging or provider retention.

Repeat the successful production flow 20 times to evaluate the spec’s connectivity success criterion. Use the companion service repository’s tests and deployment procedure for Worker-specific validation; this repository cannot validate Worker behavior in isolation.
