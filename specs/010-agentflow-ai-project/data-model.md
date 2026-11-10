# Data Model: Add AgentFlow AI Project to Portfolio

This feature introduces no persistence and no runtime data source. The model below describes the static presentation data and the published verification data used by the feature.

## Project Entry

Represents one personal project rendered by the Projects page.

| Field | Description | Validation / lifecycle |
|---|---|---|
| Kicker | Short category label above the title | Non-empty string; consistent with existing card kickers |
| Title | Project name shown as the card heading | Non-empty string; `AgentFlow AI` |
| Summary | Short plain-language description of the project | Non-empty string; describes secure multi-agent patient support |
| Tags | Technology tag line shown in the card footer | Non-empty string; `Python · FastAPI · LangGraph · React` |
| Destination | Public repository address opened by the card action | Absolute HTTPS URL; `https://github.com/isabelSoares/agentflow-ai` |
| Collection | The ordered set of project entries rendered by the grid | Static; additions appear after existing entries |

Existing entry preserved: the `CV Photo AI` project entry and its destination remain unchanged.

## Repository Destination

Represents the outbound navigation target attached to a project entry.

| Attribute | Description | Validation / lifecycle |
|---|---|---|
| Address | Public repository URL | Absolute HTTPS address; registered in release verification |
| Opens in new tab | Whether activation preserves the portfolio tab | Required true for project links |
| Safe navigation | Whether the opened page is isolated from the portfolio window | Required true (`noopener noreferrer`) |
| Accessible new-tab notice | Screen-reader announcement that the link opens in a new tab | Required in the link content |
| Availability | Whether the address currently resolves | Checked by the online release verification; failures are reported, not silently ignored |

## Verification Record

Represents the set of external addresses checked before publication.

| Field | Description | Validation / lifecycle |
|---|---|---|
| External addresses | Ordered list of published outbound destinations | Includes the AgentFlow AI repository alongside the existing destinations |
| Online probe | Whether addresses are requested during release verification | Executed only when online verification is requested |
| Outcome | Pass or reported failure for each address | Incorrect, unreachable, or malformed addresses produce a visible failure |

## State

The project card has no interactive state beyond the browser's native link behavior. The page may be shown in either the light or dark appearance and at narrow or wide viewport widths; these presentation states are inherited from existing site behavior and do not add new data.
