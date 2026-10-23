---
sidebar_label: "Approval Queue Read"
keywords:
  - "/o/journey-engine/approval-queue"
  - "GET /o/journey-engine/approval-queue"
  - "approval-queue"
  - "journey-engine"
last_update:
  date: "2026-10-23"
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

Return the journeys of an app that are waiting for approval. Approvers and global admins see every pending journey. Other members see only the journeys they submitted themselves.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required): App ID

## Examples

```
GET /o/journey-engine/approval-queue?app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "result": [
    {
      "_id": "67164f4a1f1bd90d6354430a",
      "name": "Onboarding Journey",
      "appId": "6991c75b024cb89cdc04efd2",
      "status": "pending_approval",
      "created": 1700000000000,
      "approval": {},
      "version": {
        "_id": "67164f4a1f1bd90d6354430b",
        "status": "draft",
        "version": 2,
        "blockCount": 5
      }
    }
  ],
  "canApprove": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | Journeys pending approval, oldest submission first. |
| `result[]._id` | String | Journey definition ID. |
| `result[].name` | String | Journey name. |
| `result[].appId` | String | App ID. |
| `result[].status` | String | Journey status. |
| `result[].created` | Number | Creation timestamp. |
| `result[].approval` | Object | Approval details of the submission. |
| `result[].version` | Object | The submitted version, with `_id`, `status`, `version` and `blockCount` (number of blocks). |
| `canApprove` | Boolean | `true` when the member is an approver or a global admin. |

### Error Responses

- **HTTP 403**
```json
{
  "result": "You do not have permission to view the approval queue"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to fetch approval queue"
}
```

## Behavior

- Returns only journeys of the given app with the pending approval status.
- Members who are neither approvers nor global admins get only the journeys they submitted.

## Related Endpoints

- [Approve Journey](journey-engine-approve.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Reads pending journeys. |
| `countly.journey_versions` | Submitted version lookup | Reads the submitted version of each journey. |

</details>
