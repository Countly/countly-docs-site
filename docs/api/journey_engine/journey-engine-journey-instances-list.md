---
sidebar_label: "Journey Instances List"
keywords:
  - "/o/journey-engine/journey-instances/list"
  - "GET /o/journey-engine/journey-instances/list"
  - "list"
  - "journey-engine"
  - "journey-instances"
---

# Journey Engine - Journey Instances List

## Endpoint

```
/o/journey-engine/journey-instances/list
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

List journey instances, optionally filtered by journey, status, or app user.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

Requires **global admin** access.

## Request Parameters

- `journeyVersionId` (optional): Filter by version ID
- `journeyDefinitionId` (optional): Filter by journey definition ID
- `status` (optional): Instance status
- `appUserId` (optional): Filter by app user ID

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

## Examples

```
GET /o/journey-engine/journey-instances/list?journeyDefinitionId=67164f4a1f1bd90d6354430a&status=completed
```

## Behavior/Processing

- Requires the authenticated member to be a global admin.
- Filters by `journeyVersionId`, `journeyDefinitionId`, `status`, and/or `appUserId` when provided.
- Sorts results by `startTime` descending.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Related Endpoints

- No related endpoints

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-04-18
