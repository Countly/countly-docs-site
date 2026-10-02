---
sidebar_label: "Journey Logs List"
keywords:
  - "/o/journey-enginge/journey-logs/list"
  - "list"
  - "journey-enginge"
  - "journey-logs"
last_update:
  date: "2026-02-16"
---

# List Journey Logs

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-enginge/journey-logs/list
```

## Overview

Returns journey execution log entries. Use the endpoint path exactly as shown.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- `Read` on `journey_engine` feature is required.
- Additional runtime restriction: requester must be global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application identifier |
| `journeyInstanceId` | String | No | Filter by journey instance ID |
| `journeyDefinitionId` | String | No | Filter by journey definition ID |
| `status` | String | No | Filter by status |
| `startTime` | String | No | Lower bound for log time filter |
| `endTime` | String | No | Upper bound for log time filter |

## Examples

```text
https://your-server.com/o/journey-enginge/journey-logs/list?api_key=YOUR_API_KEY&app_id=64afe321d5f9b2f77cb2c8ed&journeyDefinitionId=67164f4a1f1bd90d6354430a&status=completed
```

## Response

### Success Response

```json
[
  {
    "_id": "67164f4a1f1bd90d635443aa",
    "journeyInstanceId": "67164f4a1f1bd90d635443aa",
    "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
    "status": "completed",
    "time": "2024-01-01T11:30:00.000Z"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Journey log entries |
| `[].journeyInstanceId` | String | Journey instance ID |
| `[].journeyDefinitionId` | String | Journey definition ID |
| `[].status` | String | Log status |
| `[].time` | String | Log timestamp |

### Error Responses

| HTTP Status | Response |
|---|---|
| 401 | `{ "result": "User is not authorized to access this resource" }` |

## Behavior

1. Validates read access.
2. Enforces global admin access.
3. Builds filters from optional query params.
4. Returns logs sorted by newest first.

## Related Endpoints

- [Journey Engine - List Journey Instances](journey-engine-journey-instances-list.md)
- [Journey Engine - List Journey Block Logs](journey-engine-journey-block-logs-list.md)
- [Journey Engine - Debug Journey](journey-engine-debug.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_logs` | Endpoint data source | ** - Source of journey log entries |

</details>
