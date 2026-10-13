# Data Model: Fix Photo Upload Connectivity

This feature adds no persistent entities. The following entities describe transient client state and the request/response boundary only.

## Photo Review Request

Represents one visitor attempt to request photo guidance.

| Field | Meaning | Validation / lifecycle |
|---|---|---|
| Selected photo | Visitor-selected image held for the active review | JPG, PNG, or WEBP; no larger than 10 MB before existing client-side preparation |
| Prepared image | Image payload sent for review | Produced for the existing service contract; exists only while the review is active |
| Width and height | Prepared image dimensions | Positive finite values supplied with the image |
| Filename | Original selected filename, if retained by the current service contract | Metadata only; must not be logged with image data |
| Attempt identifier | Identifies the current in-browser attempt for response handling | A late response must not replace a timeout or newer attempt’s state |

The configured service URL identifies the request destination but is deployment configuration, not visitor data.

## Photo Review Outcome

Represents the result the visitor can read for one request.

| Outcome | Information | Visitor behavior |
|---|---|---|
| Completed | Existing guidance summary, detected subjects/scenes, tips, uncertainty, and optional notice | Display the result and permit starting another review |
| Failed | Plain-language explanation for network failure, HTTP rejection, invalid response, or unavailable service | Preserve a still-valid photo and provide an explicit recovery action |
| Timed out | Indicates the 30-second client-visible deadline elapsed | Preserve the selection, allow explicit retry, ignore a late response for this attempt |

Raw internal exception details, image contents, and provider stack traces are not visitor-facing error text.

## Review Status Lifecycle

```text
ready -> preparing/submitting -> in progress -> completed
                                  |
                                  +-> failed
                                  +-> timed out

failed/timed out -> in progress (explicit retry with a new attempt identifier)
completed -> ready (visitor chooses another photo or resets)
```

The temporary photo and result stay within the current review session only; no persistent storage is introduced. Server, logs, and inference-provider retention are external integration properties and must be verified separately.
