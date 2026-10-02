---
sidebar_label: "Read Detail"
keywords:
  - "/o/journey-engine/stats/active-users/detail"
  - "GET /o/journey-engine/stats/active-users/detail"
  - "detail"
  - "journey-engine"
  - "stats"
  - "active-users"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Stats Active Users Detail

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/active-users/detail
```

## Overview

Return active user counts grouped by interval (daily, weekly, monthly).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `period` (optional): Time period filter
- `interval` (optional): `daily`, `weekly`, or `monthly` (default: daily)

## Examples

```
GET /o/journey-engine/stats/active-users/detail?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days&interval=daily
```

## Response

### Success Response

```json
[
  {"_id": {"year": 2024, "month": 1, "day": 1}, "activeUsers": 20},
  {"_id": {"year": 2024, "month": 1, "day": 2}, "activeUsers": 30}
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array | Aggregated active-user buckets. |
| `_id.year` | Number | Bucket year. |
| `_id.month` | Number | Bucket month for daily/monthly/weekly intervals. |
| `_id.week` | Number | Bucket week for daily/weekly intervals. |
| `_id.day` | Number | Bucket day for daily interval. |
| `activeUsers` | Number | Sum of `users_completed` for the bucket. |

### Error Responses

- **500**: Query error

## Behavior

- Uses Countly period helpers to build the current period date array.
- Filters by `journeyVersionId` and/or `journeyDefinitionId` when provided.
- Groups by `daily`, `weekly`, or `monthly`; any other interval falls back to an empty group key.
- Sorts by year, month, week, and day.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_stats` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
