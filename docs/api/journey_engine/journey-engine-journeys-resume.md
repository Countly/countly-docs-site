---
sidebar_label: "Resume"
keywords:
  - "/i/journey-engine/journeys/resume"
  - "POST /i/journey-engine/journeys/resume"
  - "resume"
  - "journey-engine"
  - "journeys"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Journeys Resume

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/journeys/resume
```

## Overview

Resume a paused journey version and set it back to active status.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyId` (required): Journey definition ID
- `versionId` (required): Journey version ID

## Examples

```json
POST /i/journey-engine/journeys/resume
Content-Type: application/json

{
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

## Response

### Success Response

```json
{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "id": "67164f4a1f1bd90d6354430b",
  "status": "active"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `journeyDefinitionId` | String | Journey definition ID from the request. |
| `id` | String | Journey version ID from the request. |
| `status` | String | `active` when the version was resumed. |

### Error Responses

- **400**: Invalid request
- **500**: Resume error

## Behavior

- Requires `journeyId` and `versionId` in the request body; missing values return `Invalid request`.
- Marks the selected journey version as `active`.
- Marks the journey definition as `active`.
- Resumes paused journey instances and recalculates pending wait-event execution times.
- Emits `journey_resumed` system log action.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
