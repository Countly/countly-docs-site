---
sidebar_label: "Read Table"
---

# User Profiles - Events Table

## Endpoint

```text
/o?method=user_details&calculate=eventsTable
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns per-user event table data with filtering and pagination.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

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
| `limit` | Number | No | Explicit limit override |
| `skip` | Number | No | Explicit skip override |
| `cursor` | String | No | Cursor pagination token (ClickHouse mode) |
| `paginationMode` | String | No | Cursor mode (`snapshot` or `live`) |
| `dbOverride` | String | No | Query adapter override |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.*` | User profile feature defaults | User-details retrieval behavior in profile endpoints. | Changes to user feature settings can affect which profile-related fields/aggregations are returned. |

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
| `hasNextPage` | Boolean | Returned for cursor-based pagination |
| `nextCursor` | String | Cursor for next page |

### Error Responses

- **HTTP 400** - Query execution issue:
```json
{
  "result": "Error. Please check logs."
}
```

## Behavior/Processing

- Maps shorthand system event names (for example `view`, `crash`, `survey`) to internal keys.
- Supports Mongo-like pagination and cursor pagination.
- If endpoint returns error from backend query layer, response includes message wrapper.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=eventsTable&uid=u_102&period=30days&event=all&iDisplayStart=0&iDisplayLength=20
```

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=eventsTable&uid=u_102&period=30days&event=purchase&dbOverride=clickhouse&paginationMode=snapshot
```

## Related Endpoints

- [User Profiles - Sessions](sessions.md)
- [User Profiles - Timeline Graph](graph.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
