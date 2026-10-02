---
sidebar_label: "Stats Active Users Read"
keywords:
  - "/o/journey-engine/stats/active-users"
  - "GET /o/journey-engine/stats/active-users"
  - "active-users"
  - "journey-engine"
  - "stats"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Stats Active Users

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/active-users
```

## Overview

Return active user counts for journeys with comparison to previous period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `period` (optional): Time period for comparison (defaults to hourly)

## Examples

```
GET /o/journey-engine/stats/active-users?journeyDefinitionId=67164f4a1f1bd90d6354430a&period=7days
```

## Response

### Success Response

```json
{
  "activeUsers": 120,
  "previousActiveUsers": 110,
  "change": 9.09
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `activeUsers` | Number | Current period active-user count. The implementation sums `users_completed`. |
| `previousActiveUsers` | Number | Previous period active-user count. |
| `change` | Number or String | Percentage change from previous period, or `"-"` when previous count is zero. |

### Error Responses

- **500**: Query error

## Behavior

- Filters `journey_stats` by `journeyVersionId` and/or `journeyDefinitionId` when provided.
- Uses Countly period helpers when `period` is provided; otherwise defaults to the helper's hourly/current behavior.
- Calculates active users by summing `users_completed` for current and previous period arrays.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_stats` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
