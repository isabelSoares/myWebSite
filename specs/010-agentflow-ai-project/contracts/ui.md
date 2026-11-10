# UI Contract: AgentFlow AI Project Card

This contract describes the observable user-facing behavior of the AgentFlow AI entry on the Projects page. It is a presentation contract, not a runtime service interface.

## Placement

- The entry appears inside the existing “More things I've been exploring.” project grid on the Projects page (`/projects`).
- The entry appears after the existing CV Photo AI entry in the static project list.
- The entry does not appear on the homepage or any other route.

## Card Structure

The card exposes the following content, in order:

| Element | Contract |
|---|---|
| Kicker | A short category label rendered above the title |
| Title | A heading whose accessible name is `AgentFlow AI` |
| Summary | A plain-language description of secure multi-agent patient support |
| Tags | A technology tag line: `Python · FastAPI · LangGraph · React` |
| Action | A view-project link whose accessible name identifies the project and communicates that it opens in a new tab |

The card uses the same structural elements, classes, typography, spacing, and footer arrangement as the CV Photo AI card.

## Action Behavior

- **Destination**: `https://github.com/isabelSoares/agentflow-ai`
- **New tab**: activation opens the destination in a new browser tab (`target="_blank"`).
- **Safe navigation**: the link carries `rel="noopener noreferrer"`.
- **Preservation**: the portfolio tab remains loaded and unchanged.
- **Accessible notice**: the link includes a visually hidden “(opens in a new tab)” announcement.
- **Keyboard**: the action is reachable in logical tab order and shows the existing focus-visible outline.

## Presentation States

| State | Expected result |
|---|---|
| Light appearance | Card text, tags, background, border, and action remain legible and consistent with other cards |
| Dark appearance | Card text, tags, background, border, and action remain legible and consistent with other cards |
| Wide viewport | Two project cards render side by side within the existing grid |
| Narrow viewport | Cards stack in a single column and the page has no horizontal overflow |
| Destination unavailable or incorrect | The card still renders; online release verification reports the problem |

## Regression Guarantees

- The CV Photo AI card, the AI Photographer Assistant section, and all other Projects page content remain present and behaviorally unchanged.
- The homepage continues to render zero personal project cards.
- The new entry adds no network request, storage, authentication, or embedded service.

## Verification Hooks

- Interface tests locate the AgentFlow AI link by its destination and assert the destination, `target`, and `rel`.
- Release verification includes the AgentFlow AI repository in its external address list.
