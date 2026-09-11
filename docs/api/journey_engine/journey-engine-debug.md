---
sidebar_label: "Debug"
keywords:
  - "/o/journey-engine/debug"
  - "GET /o/journey-engine/debug"
  - "debug"
  - "journey-engine"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Debug

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/debug
```

## Overview

Admin-only debug endpoint that returns journeys, versions, instances, and block logs for a journey definition.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires **global admin** access.

## Request Parameters

- `journeyDefinitionId` (required if name not provided): Journey definition ID
- `name` (required if journeyDefinitionId not provided): Journey name
- `deviceId` (optional): Filter instances by device ID
- `appUserId` (optional): Filter instances by app user ID
- `startTime` (optional): Filter instances by start time (ISO or ms)
- `endTime` (optional): Filter instances by end time (ISO or ms)

## Examples

```
GET /o/journey-engine/debug?journeyDefinitionId=67164f4a1f1bd90d6354430a&deviceId=device_123
```

## Response

### Success Response

```json
[
  {
    "_id": "67164f4a1f1bd90d6354430a",
    "name": "Onboarding Journey",
    "journey_versions": [
      {
        "_id": "67164f4a1f1bd90d6354430b",
        "status": "active"
      }
    ],
    "journey_instances": [
      {
        "_id": "67164f4a1f1bd90d635443aa",
        "appUserId": "user_123",
        "status": "completed"
      }
    ]
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array | Journey definitions with debug expansions |
| `[]._id` | String | Journey definition ID |
| `[].name` | String | Journey name |
| `[].journey_versions` | Array | Joined versions for the journey. Each version contains filtered `journey_instances`. |
| `[].journey_versions[].name` | String | Version name. |
| `[].journey_versions[].status` | String | Version status. |
| `[].journey_versions[].journey_instances` | Array | Journey instances for this version after optional `deviceId`/`appUserId` filtering. |
| `[].journey_versions[].journey_instances[].deviceId` | String | Device ID. |
| `[].journey_versions[].journey_instances[].appUserId` | String | App user ID. |
| `[].journey_versions[].journey_instances[].startTime` | Number | Instance start timestamp. |
| `[].journey_versions[].journey_instances[].endTime` | Number or Null | Instance end timestamp. |
| `[].journey_versions[].journey_instances[].data` | Object | Instance data payload. |
| `[].journey_versions[].journey_instances[].block_log` | Array | Block logs joined by journey instance ID. |

### Error Responses

- **HTTP 400**
```json
{
  "result": "name or journeyDefinitionId is required"
}
```
- **HTTP 401**
```json
{
  "result": "User is not authorized to access this resource"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to get journey definition"
}
```

## Behavior

- Requires the authenticated member to be a global admin.
- Requires either `journeyDefinitionId` or `name`.
- Matches `journey_definition` by `_id` or exact `name`.
- Joins versions, journey instances, and block logs.
- Filters version instances by `deviceId` and/or `appUserId` when provided.
- The current handler intends to support `startTime`/`endTime`, but those filters reference the internal `match` object before it is initialized. Until the code is fixed, avoid relying on `startTime` and `endTime` for this endpoint.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_block_logs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
