---
sidebar_label: "Read User"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# Read user funnels

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=user_funnels
```

## Overview

Returns funnels where a specific user appears, along with calculated progression data for that user context.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `funnels` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `user_funnels`. |
| `app_id` | String | Yes | Target app ID. |
| `uid` | String | Yes | User ID to evaluate. |
| `period` | String or JSON String (Array/Object) | No | Analysis period. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o?
  method=user_funnels&
  app_id=64f5c0d8f4f7ac0012ab3456&
  uid=1234567890abcdef&
  period=30days
```

## Response

### Success Response

```json
[
  {
    "_id": "67f1c22912df5acb8f8d5caaf0f89a31",
    "name": "Purchase Funnel",
    "steps": ["Product View", "Add to Cart", "Purchase"],
    "step": 2,
    "data": {
      "total_users": 1,
      "success_users": 0,
      "success_rate": 0,
      "steps": [
        {"step": "Product View", "users": 1},
        {"step": "Add to Cart", "users": 1},
        {"step": "Purchase", "users": 0}
      ]
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Funnels in which user appeared in at least first step. |
| `[].step` | Number | Number of contiguous steps the user progressed through. |
| `[].data` | Object | Per-funnel calculated data payload for the user filter. |

### Error Responses

No explicit error response path; on calculation/query failures endpoint returns an empty array.

## Behavior

- Loads all funnels for the app.
- Runs funnel calculation for each funnel with `{ uid: <uid> }` filter.
- Returns only funnels where computed user progression is greater than zero.

## Related Endpoints

- [Funnels - Analyze](funnel-query-read.md)
- [Funnels - Read](funnel-single-read.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

</details>
