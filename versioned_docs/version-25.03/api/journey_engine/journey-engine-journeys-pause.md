---
sidebar_label: "Pause"
keywords:
  - "/i/journey-engine/journeys/pause"
  - "POST /i/journey-engine/journeys/pause"
  - "pause"
  - "journey-engine"
  - "journeys"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Journeys Pause

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/journeys/pause
```

## Overview

Pause an active journey version and set it to paused status. Pauses running instances.

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
POST /i/journey-engine/journeys/pause
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
  "status": "paused"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `journeyDefinitionId` | String | Journey definition ID from the request. |
| `id` | String | Journey version ID from the request. |
| `status` | String | `paused` when the version was paused. |

### Error Responses

- **400**: Invalid request
- **500**: Pause error

## Behavior

- Requires `journeyId` and `versionId` in the request body; missing values return `Invalid request`.
- Marks the selected journey version as `paused`.
- Marks the journey definition as `draft`.
- Clears content queue entries for the paused journey.
- Pauses running journey instances and related pending journey events.
- Emits `journey_paused` system log action.

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
