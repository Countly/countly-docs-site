---
sidebar_label: "Journey Block Logs List"
---

# Journey Engine - Journey Block Logs List

## Endpoint

```
/o/journey-engine/journey-block-logs/list
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

List block logs for a journey definition and aggregate app user IDs per block.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

Requires **global admin** access.

## Request Parameters

- `journeyDefinitionId` (required): Journey definition ID
- `startTime` (optional): Start time filter (ISO or ms)
- `endTime` (optional): End time filter (ISO or ms)
- `appUserId` (optional): Filter by app user ID

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
| `(root value)` | Object or Array | Response payload returned by this endpoint. |
### Error Responses

- **400**: Missing journeyDefinitionId
- **401**: Not authorized
- **500**: Query error

## Examples

```
GET /o/journey-engine/journey-block-logs/list?journeyDefinitionId=67164f4a1f1bd90d6354430a&startTime=2024-01-01&endTime=2024-01-31
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_block_logs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
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

2026-02-16
