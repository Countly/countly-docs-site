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
| `(root object)` | Object | Summary metrics for the selected journey scope and period. |
| `usersEntered` | Number | Sum of `users_entered` from matching `journey_stats` documents. |
| `usersCompleted` | Number | Sum of `users_completed`. |
| `usersEngaged` | Number | Sum of `users_engaged`. |
| `usersDropOff` | Number | Sum of `users_drop_off`. |
| `contentViewed` | Number | Sum of `content_viewed`. |
| `content_interacted` | Number | Sum of `content_interacted`. |
| `previousUsersEntered` | Number or Null | Previous period count. `null` when `period=0days`. |
| `previousUsersCompleted` | Number or Null | Previous period count. `null` when `period=0days`. |
| `previousUsersEngaged` | Number or Null | Previous period count. `null` when `period=0days`. |
| `previousUsersDropOff` | Number or Null | Previous period count. `null` when `period=0days`. |
| `previousContentViewed` | Number or Null | Previous period count. `null` when `period=0days`. |
| `previous_content_interacted` | Number or Null | Previous period count. `null` when `period=0days`. |
| `usersEnteredChange` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `usersCompletedChange` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `usersEngagedChange` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `usersDropOffChange` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `contentViewedChange` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `content_interacted_change` | Number or String | Percentage change from previous period, or `"-"` when unavailable. |
| `uniqueUsersEntered` | Number | Unique user count from `users_entered_uids`. |
| `uniqueUsersCompleted` | Number | Unique user count from `users_completed_uids`. |
| `uniqueUsersEngaged` | Number | Unique user count from `users_engaged_uids`. |
| `uniqueUsersDropOff` | Number | Unique user count from `users_drop_off_uids`. |
| `uniqueContentViewed` | Number | Unique user count from `content_viewed_uids`. |
| `uniqueContentInteracted` | Number | Unique user count from `content_interacted_uids`. |

### Error Responses

- **500**: Query error

## Examples

```
GET /o/journey-engine/stats/summary?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
```

## Behavior/Processing

- Filters `journey_stats` by `journeyVersionId` and/or `journeyDefinitionId` when provided.
- When `period` is not `0days`, computes current and previous period arrays with Countly period helpers and returns percentage change fields.
- When `period=0days`, aggregates all matching stats and returns previous-period fields as `null`; change fields remain `"-"`.
- Unique counts are calculated separately by unwinding each `*_uids` field to avoid loading large UID arrays in memory.

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

2026-04-18
