---
sidebar_label: "Stats Performance Read"
---

# Journey Engine - Stats Performance

## Endpoint

```
/o/journey-engine/stats/performance
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Return performance metrics over time (users entered, completed, engaged, drop-off).

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `period` (optional): Time period filter. Use "0days" for yearly aggregation

## Response

### Success Response

```json
{
  "2024.01.01": {"usersEntered": 10, "usersCompleted": 2, "usersEngaged": 6, "usersDropOff": 1},
  "2024.01.02": {"usersEntered": 14, "usersCompleted": 3, "usersEngaged": 7, "usersDropOff": 2}
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Object or Array | Response payload returned by this endpoint. |
### Error Responses

- **500**: Query error

## Examples

```
GET /o/journey-engine/stats/performance?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_stats` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

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
