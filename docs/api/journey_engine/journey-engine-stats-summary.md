---
sidebar_label: "Stats Summary Read"
keywords:
  - "/o/journey-engine/stats/summary"
  - "GET /o/journey-engine/stats/summary"
  - "summary"
  - "journey-engine"
  - "stats"
---

# Journey Engine - Stats Summary

## Endpoint

```
/o/journey-engine/stats/summary
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Return summary metrics for journeys, with optional period comparison.

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
- `period` (optional): Time period (e.g., "7days", "30days"). Use "0days" for all-time

## Response

### Success Response

```json
{
  "usersEntered": 1200,
  "usersCompleted": 450,
  "usersEngaged": 680,
  "usersDropOff": 150,
  "contentViewed": 900,
  "content_interacted": 320,
  "usersEnteredChange": 12.5,
  "usersCompletedChange": -5.4,
  "usersEngagedChange": 3.2,
  "usersDropOffChange": 1.0,
  "contentViewedChange": 8.1,
  "content_interacted_change": 2.7,
  "uniqueUsersEntered": 950,
  "uniqueUsersCompleted": 420,
  "uniqueUsersEngaged": 600,
  "uniqueUsersDropOff": 120,
  "uniqueContentViewed": 780,
  "uniqueContentInteracted": 250
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
GET /o/journey-engine/stats/summary?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
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
