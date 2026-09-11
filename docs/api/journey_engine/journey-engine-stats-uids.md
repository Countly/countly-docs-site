---
sidebar_label: "Stats UIDs Read"
keywords:
  - "/o/journey-engine/stats/uids"
  - "GET /o/journey-engine/stats/uids"
  - "uids"
  - "journey-engine"
  - "stats"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Stats Uids

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/uids
```

## Overview

Retrieve unique user IDs for a given stats metric (entered, engaged, completed, etc.).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `uidType` (required): One of:
  - `users_entered`
  - `users_engaged`
  - `users_completed`
  - `users_drop_off`
  - `content_viewed`
  - `content_interacted`
- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `period` (optional): Time period filter

## Examples

```
GET /o/journey-engine/stats/uids?uidType=users_completed&journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
```

## Response

### Success Response

```json
{
  "uids": ["user_1", "user_2", "user_3"],
  "uidType": "users_entered",
  "total": 3
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `uids` | Array | Unique user IDs collected from the selected metric UID array. |
| `uidType` | String | Requested UID metric type. |
| `total` | Number | Number of returned unique user IDs. |
| `error` | String | Error message returned for missing/invalid `uidType` or query failure. |

### Error Responses

- **400**: Missing or invalid uidType
- **500**: Query error

## Behavior

- Requires `uidType`.
- Accepts only `users_entered`, `users_engaged`, `users_completed`, `content_viewed`, `content_interacted`, and `users_drop_off`.
- Filters `journey_stats` by `journeyVersionId`, `journeyDefinitionId`, and current period array when provided.
- Reads from the matching `<uidType>_uids` array, unwinds values, groups unique ids, sorts by uid, and returns them as `uids`.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_stats` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
