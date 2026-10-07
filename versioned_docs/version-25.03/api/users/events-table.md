---
sidebar_label: "Read Table"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# User Profiles - Events Table

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=user_details&calculate=eventsTable
```

## Overview

Returns per-user event table data with filtering and pagination.

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
| `calculate` | String | Yes | Must be `eventsTable` |
| `uid` | String | No | User ID |
| `did` | String | No | Device ID alternative |
| `period` | String | No | Requested period |
| `event` | String | No | Event filter (`all`, `custom-events`, or event key) |
| `session` | String (JSON Object/String) | No | Session filter |
| `sSearch` | String | No | Search filter |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=eventsTable&uid=u_102&period=30days&event=all&iDisplayStart=0&iDisplayLength=20
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 1245,
  "iTotalDisplayRecords": 100,
  "aaData": [
    {
      "ts": 1739557500,
      "e": "purchase",
      "c": {
        "amount": 49.99,
        "currency": "USD"
      },
      "dur": 250
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value for table requests |
| `iTotalRecords` | Number | Total matched records |
| `iTotalDisplayRecords` | Number | Displayed records |
| `aaData` | Array | Event rows |

### Error Responses

- **HTTP 400** - Query execution issue:
```json
{
  "result": "Error. Please check logs."
}
```

## Behavior

- Maps shorthand system event names (for example `view`, `crash`, `survey`) to internal keys.
- Supports offset pagination via `iDisplayStart` and `iDisplayLength`.
- If endpoint returns error from backend query layer, response includes message wrapper.

## Related Endpoints

- [User Profiles - Sessions](sessions.md)
- [User Profiles - Timeline Graph](graph.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.*` | User profile feature defaults | User-details retrieval behavior in profile endpoints. | Changes to user feature settings can affect which profile-related fields/aggregations are returned. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

</details>
