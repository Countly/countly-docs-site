---
sidebar_label: "Timeline Graph"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# User Profiles - Timeline Graph

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=user_details&calculate=graph
```

## Overview

Returns user activity timeline graph data.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- User Profiles: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `method` | String | Yes | Must be `user_details` |
| `calculate` | String | Yes | Must be `graph` |
| `uid` | String | No | User ID |
| `did` | String | No | Device ID alternative |
| `period` | String | No | Requested period |
| `bucket` | String | No | `daily`, `weekly`, `monthly`, `hourly` |

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=graph&uid=u_102&period=30days&bucket=daily
```

## Response

### Success Response

```json
{
  "totals": {
    "s": 12,
    "e": 54,
    "d": 9,
    "ds": 3,
    "tsd": 4210
  },
  "graph": {
    "2026:2:14": { "s": 2, "e": 8 },
    "2026:2:15": { "s": 1, "e": 5 }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `totals` | Object | Aggregated user totals in selected period |
| `graph` | Object | Bucketed timeline points |

### Error Responses

- **HTTP 400** - Query execution issue:
```json
{
  "result": "Error. Please check logs."
}
```

## Behavior

- Resolves `uid` from `did` when needed.
- Maps bucket aliases (`daily`, `weekly`, `monthly`, `hourly`) to internal bucket keys.
- Returns `{}` when user cannot be resolved.

## Related Endpoints

- [User Profiles - Sessions](sessions.md)
- [User Profiles - Events Table](events-table.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.*` | User profile feature defaults | User-details retrieval behavior in profile endpoints. | Changes to user feature settings can affect which profile-related fields/aggregations are returned. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
