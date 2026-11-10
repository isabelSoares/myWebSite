# Quickstart: Add AgentFlow AI Project to Portfolio

Validation guide for the AgentFlow AI project-card integration. See [spec.md](spec.md) for requirements, [data-model.md](data-model.md) for the presentation model, and [contracts/ui.md](contracts/ui.md) for the observable UI contract.

## Prerequisites

- Node.js 24 or newer and npm
- Repository dependencies installed from `ts-app/`
- No AgentFlow AI backend or deployment is required

## Setup

```sh
cd ts-app
npm ci
```

## Scenario 1 — Projects page renders the new card

```sh
cd ts-app
npm test -- --watchAll=false -- App.test.tsx
```

Expected:

- The Projects page test finds the AgentFlow AI link by its repository destination.
- The link has `target="_blank"` and `rel="noopener noreferrer"`.
- The test asserting that the homepage renders no project cards still passes.
- The existing CV Photo AI and AI Photographer Assistant assertions still pass.

## Scenario 2 — Visual and responsive check

```sh
cd ts-app
npm start
```

Open <http://localhost:3000/projects> and verify:

- The AgentFlow AI card appears after the CV Photo AI card with the same structure and spacing.
- The card shows the `AgentFlow AI` heading, a summary, and the `Python · FastAPI · LangGraph · React` tag line.
- Activating “View project” opens `https://github.com/isabelSoares/agentflow-ai` in a new tab and the portfolio tab remains unchanged.
- Toggling to the light appearance keeps the card legible.
- Narrowing the viewport to a mobile width stacks the cards in one column without horizontal overflow.
- Tabbing with the keyboard reaches the action with a visible focus outline.

Expected: all checks pass; no other Projects page content changes.

## Scenario 3 — Accessibility coverage

```sh
cd ts-app
npm test -- --watchAll=false
npm run validate:theme-accessibility
```

Expected:

- The Jest and axe accessibility coverage for the Projects route passes.
- The theme contrast and focus-style validation passes without new tokens.

## Scenario 4 — Release verification

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release
```

Expected:

- The release-script tests, interface tests, accessibility checks, photo checks, build, and SPA fallback checks pass.
- The committed-secret scan passes.

To probe the registered external addresses, including the AgentFlow AI repository:

```sh
cd ts-app
REACT_APP_AI_ASSISTANT_URL="https://<your-cloudflare-endpoint>/" npm run verify:release -- --online
```

Expected: the AgentFlow AI repository is among the checked addresses; an unreachable or incorrect address produces a visible warning or failure rather than being silently skipped.

## Scenario 5 — Production build

```sh
cd ts-app
npm run build
```

Expected: the build succeeds and the Projects page still renders the AgentFlow AI card when served.
