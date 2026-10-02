---
sidebar_label: "Stats Summary Read"
keywords:
  - "/o/journey-engine/stats/summary"
  - "GET /o/journey-engine/stats/summary"
  - "summary"
  - "journey-engine"
  - "stats"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Stats Summary

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/summary
```

## Overview

Return summary metrics for journeys, with optional period comparison.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `period` (optional): Time period (e.g., "7days", "30days"). Use "0days" for all-time

## Examples

```
GET /o/journey-engine/stats/summary?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
```

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

## Behavior

- Filters `journey_stats` by `journeyVersionId` and/or `journeyDefinitionId` when provided.
- When `period` is not `0days`, computes current and previous period arrays with Countly period helpers and returns percentage change fields.
- When `period=0days`, aggregates all matching stats and returns previous-period fields as `null`; change fields remain `"-"`.
- Unique counts are calculated separately by unwinding each `*_uids` field to avoid loading large UID arrays in memory.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_stats` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
