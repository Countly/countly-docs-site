---
sidebar_label: "Approval Queue"
keywords:
  - "/o/journey-engine/approval-queue"
  - "approval-queue"
  - "journey-engine"
last_update:
  date: "2026-10-16"
---

# Journey Engine - Approval Queue

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/journey-engine/approval-queue
```

## Overview

Returns all journeys of the app that are waiting for approval, oldest submission first. Use [Approve or Reject Journey](journey-engine-approve.md) to decide on them.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature.
- **Additional rule**: the member must be an approver (`journey_approver`) or a global admin. Other members get `403`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |

## Examples

### Read the approval queue

```text
/o/journey-engine/approval-queue?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "result": [
    {
      "_id": "67164f4a1f1bd90d6354430a",
      "name": "Welcome journey",
      "appId": "6991c75b024cb89cdc04efd2",
      "status": "pending_approval",
      "created": 1760000000000,
      "approval": {
        "versionId": "67164f4a1f1bd90d6354430b"
      },
      "version": {
        "_id": "67164f4a1f1bd90d6354430b",
        "status": "draft",
        "version": 2,
        "blockCount": 6
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | Journeys with the status `pending_approval`. Empty when none are waiting. |
| `result[]._id` | String | Journey definition ID. |
| `result[].name` | String | Journey name. |
| `result[].appId` | String | App ID. |
| `result[].status` | String | Always `pending_approval`. |
| `result[].created` | Number | Creation time. |
| `result[].approval` | Object | Approval details stored with the journey, including the submitted `versionId`. |
| `result[].version` | Object | The submitted version: `_id`, `status`, `version` and `blockCount` (number of blocks). Missing if the version cannot be found. |

### Error Responses

- `403`

```json
{
  "result": "You do not have permission to view the approval queue"
}
```

- `500`

```json
{
  "result": "Failed to fetch approval queue"
}
```

## Behavior

- Only journeys of the given app are returned.
- Read-only. Nothing is modified.

## Related Endpoints

- [Approve or Reject Journey](journey-engine-approve.md)
- [List Journeys](journey-engine-list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and approver flag. |
| `countly.journey_definition` | Pending journeys | Reads journeys with the status `pending_approval`. |
| `countly.journey_versions` | Submitted version | Reads the version's status, number and block count. |

</details>
