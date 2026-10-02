---
sidebar_label: "Journey Block Logs List"
keywords:
  - "/o/journey-engine/journey-block-logs/list"
  - "GET /o/journey-engine/journey-block-logs/list"
  - "list"
  - "journey-engine"
  - "journey-block-logs"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Journey Block Logs List

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/journey-block-logs/list
```

## Overview

List block logs for a journey definition and aggregate app user IDs per block.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires **global admin** access.

## Request Parameters

- `journeyDefinitionId` (required): Journey definition ID
- `startTime` (optional): Start time filter (ISO or ms)
- `endTime` (optional): End time filter (ISO or ms)
- `appUserId` (optional): Filter by app user ID

## Examples

```
GET /o/journey-engine/journey-block-logs/list?journeyDefinitionId=67164f4a1f1bd90d6354430a&startTime=2024-01-01&endTime=2024-01-31
```

## Response

### Success Response

```json
[
  {
    "_id": "block_1",
    "startTime": 1739239212000,
    "endTime": 1739239312000,
    "status": "completed",
    "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
    "appUserIds": ["user_1", "user_2"]
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array | Aggregated block log rows. |
| `_id` | String | Block ID. |
| `startTime` | Date or Number | First block log start time in the group. |
| `endTime` | Date or Number | First block log end time in the group. |
| `status` | String | First block log status in the group. |
| `journeyDefinitionId` | String | Journey definition ID. |
| `appUserIds` | Array | Unique app user IDs from joined journey instances. |

### Error Responses

- **400**: Missing journeyDefinitionId
- **401**: Not authorized
- **500**: Query error

## Behavior

- Requires the authenticated member to be a global admin.
- Requires `journeyDefinitionId`.
- Filters block logs by `journeyDefinitionId` and optional `startTime`/`endTime`.
- Joins `journey_instances` by `journeyInstanceId` and can filter joined instances by `appUserId`.
- Groups by `blockId`, returns first timing/status fields, and accumulates unique `appUserIds`.
- Sorts grouped rows by `startTime` ascending.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_block_logs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
