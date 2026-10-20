---
sidebar_label: "Approval Queue"
keywords:
  - "/o/journey-engine/approval-queue"
  - "GET /o/journey-engine/approval-queue"
  - "approval-queue"
  - "journey-engine"
last_update:
  date: "2026-10-17"
---

# Journey Engine - Approval Queue

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/approval-queue
```

## Overview

List the journeys of an app that are waiting for approval, oldest submission first.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature
- The user must also be a journey approver or a global admin.

## Request Parameters

- `app_id` (required): Application ID

## Examples

### List journeys waiting for approval
```
GET /o/journey-engine/approval-queue?app_id=64afe321d5f9b2f77cb2c8ed
```

## Response

### Success Response

```json
{
  "result": [
    {
      "_id": "67164f4a1f1bd90d6354430a",
      "name": "Onboarding Journey",
      "appId": "64afe321d5f9b2f77cb2c8ed",
      "status": "pending_approval",
      "created": 1727101524294,
      "approval": {
        "versionId": "67164f4a1f1bd90d6354430b",
        "submittedBy": "MEMBER_ID",
        "submittedAt": 1727101624294
      },
      "version": {
        "_id": "67164f4a1f1bd90d6354430b",
        "version": 1,
        "blockCount": 4
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | Journey definitions with status pending approval. Empty when there are none. |
| `result[]._id` | String | Journey definition ID. |
| `result[].name` | String | Journey definition name. |
| `result[].appId` | String | App ID. |
| `result[].status` | String | Journey definition status. |
| `result[].created` | Number | Creation timestamp. |
| `result[].approval` | Object | Approval details stored with the journey, including `versionId` and the submission time `submittedAt`. |
| `result[].version` | Object | The submitted version: `_id`, `version` (number), `status` and `blockCount` (number of blocks). |

### Error Responses

- **403**: The user is neither a journey approver nor a global admin.

```json
{
  "result": "You do not have permission to view the approval queue"
}
```

- **500**: Failed to read the queue.

```json
{
  "result": "Failed to fetch approval queue"
}
```

## Behavior

- Only journeys of the requested app whose status is pending approval are returned.
- Results are sorted by submission time, oldest first.

## Related Endpoints

- [Approve or Reject Journey](journey-engine-approve.md)
- [List Journeys](journey-engine-list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Journey definitions | Reads the journeys pending approval. |
| `countly.journey_versions` | Journey versions | Reads the submitted version of each journey. |

</details>
