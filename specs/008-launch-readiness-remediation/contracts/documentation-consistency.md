# Contract: Documentation Consistency

**Feature**: `008-launch-readiness-remediation`
**Applies to**: `README.md`, `specs/005-pre-launch-verification/scalability-report.md`, and the current 007 records.

## Canonical terms

| Concept | Canonical documentation name | Unchanged route/internal name |
|---------|------------------------------|-------------------------------|
| Experience page | **Experience** | `/resume`, `ResumeCV` |
| AI photo review product | **AI Photographer Assistant** (full name on first mention; "assistant" thereafter) | `PhotoAssistant` |
| Albums page | **Hobbies** | `/hobbies` |

Existing visible navigation labels MUST NOT be changed by this feature.

## Counts

The current records MUST state:

| Item | Required value | Source of truth |
|------|----------------|-----------------|
| Albums | 14 | manifest |
| Album photos | 172 | manifest |
| Featured photos | 2 | manifest |
| Total photos | 174 | manifest + featured |
| Generated derivatives | 348 | generated directory |
| Generated footprint | 59.92 MB (re-measure at implementation time) | filesystem |
| Footprint limit | 64 MB | `photo-limits.js` |

Counts are derived from the manifest, never estimated. If the manifest changes, the records change in the same change set.

## Capacity record

`specs/005-pre-launch-verification/scalability-report.md` MUST:

1. Describe locally generated WebP derivatives, not external photo hotlinking.
2. State the current footprint and derivative count, not the retired 245 MB / 202-file figure.
3. State that album strips use 540 px thumbnails and dialogs load larger derivatives on demand.
4. Record the highest published-site concurrency actually measured and label the larger target `PROVEN`, `UNPROVEN`, or `RE-SCOPED`.
5. Include a note that it supersedes the earlier external-host assumption from the 005 planning artifacts.
6. Retain the direct-link status-code observation and its decision.

## 007 corrections

- The data-model invariant must say the rotation metadata was corrected and the derivatives, albums, and ordering were unchanged.
- The plan scale must say 172 album photos plus 2 featured photos.
- The 007 task list must carry inline status notes for any item that remains open.

## Prohibited claims

The corrected records MUST NOT claim:

- That original photographs are hotlinked from a code-hosting service.
- That full-size originals are used as strip thumbnails.
- That the 1,000-visitor target is proven without a measurement at that concurrency.
- That a visual check passed when no captured artifact or reviewer confirmation exists.
- That a non-200 direct-link status is a missing page when the SPA body renders.
