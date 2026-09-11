---
sidebar_label: "Journey Instances List"
keywords:
  - "/o/journey-engine/journey-instances/list"
  - "GET /o/journey-engine/journey-instances/list"
  - "list"
  - "journey-engine"
  - "journey-instances"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Journey Instances List

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/journey-instances/list
```

## Overview

List journey instances, optionally filtered by journey, status, or app user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires **global admin** access.

## Request Parameters

- `journeyVersionId` (optional): Filter by version ID
- `journeyDefinitionId` (optional): Filter by journey definition ID
- `status` (optional): Instance status
- `appUserId` (optional): Filter by app user ID

## Examples

```
GET /o/journey-engine/journey-instances/list?journeyDefinitionId=67164f4a1f1bd90d6354430a&status=completed
```

## Response

### Success Response

```json
[
  {
    "_id": "67164f4a1f1bd90d635443aa",
    "journeyId": "67164f4a1f1bd90d6354430b",
    "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
    "appUserId": "user_123",
    "status": "completed",
    "startTime": 1739239212000,
    "endTime": 1739239312000
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array | Journey instance documents. |
| `_id` | String | Journey instance ID. |
| `journeyId` | String | Journey version ID. |
| `journeyDefinitionId` | String | Journey definition ID. |
| `appId` | String | App ID. |
| `deviceId` | String | Device ID, when stored. |
| `appUserId` | String | App user ID. |
| `status` | String | Instance status such as `running`, `completed`, `error`, `stopped`, or `paused`. |
| `currentBlockIndex` | String | Current block ID/index value. |
| `startTime` | Number | Instance start timestamp. |
| `endTime` | Number or Null | Instance end timestamp. |
| `data` | Object | Journey instance data payload. |
| `blocks` | Array | Block definitions copied into the instance. |

### Error Responses

- **401**: Not authorized

## Behavior

- Requires the authenticated member to be a global admin.
- Filters by `journeyVersionId`, `journeyDefinitionId`, `status`, and/or `appUserId` when provided.
- Sorts results by `startTime` descending.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
