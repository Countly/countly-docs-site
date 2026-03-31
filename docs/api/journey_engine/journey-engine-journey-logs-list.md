---
sidebar_label: "Journey Logs List"
---

# List Journey Logs

## Endpoint

```
/o/journey-enginge/journey-logs/list
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns journey execution log entries. Use the endpoint path exactly as shown.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Behavior/Processing

1. Validates read access.
2. Enforces global admin access.
3. Builds filters from optional query params.
4. Returns logs sorted by newest first.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_logs` | Endpoint data source | ** - Source of journey log entries |

---

## Examples

```text
https://your-server.com/o/journey-enginge/journey-logs/list?api_key=YOUR_API_KEY&app_id=64afe321d5f9b2f77cb2c8ed&journeyDefinitionId=67164f4a1f1bd90d6354430a&status=completed
```

---

## Related Endpoints

- [Journey Engine - List Journey Instances](journey-engine-journey-instances-list.md)
- [Journey Engine - List Journey Block Logs](journey-engine-journey-block-logs-list.md)
- [Journey Engine - Debug Journey](journey-engine-debug.md)

---

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
