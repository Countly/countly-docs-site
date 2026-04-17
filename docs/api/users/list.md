---
sidebar_label: "List/Profile"
keywords:
  - "/o"
  - "o"
---

# User Profiles - List or Profile

## Endpoint

```text
/o?method=user_details
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns either a paginated users list, a single user profile (when `uid` or `did` is provided), or a user-property breakdown when `projectionKey` is provided.

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
| `uid` | String | No | User ID for single-profile response |
| `did` | String | No | Device ID alternative to `uid` |
| `query` | String (JSON Object) | No | Drill-style user filter for list mode. The endpoint runs Drill query preprocessing before reading users, so query-builder field names such as `up.cc`, `up.p`, `up.av`, `chr`, and custom user-property filters can be used. |
| `projectionKey` | String (JSON Array) | No | User breakdown field list. The server parses the first item only and groups users by that field, for example `["cc"]`, `["p"]`, or `["custom.plan"]`. |
| `filter` | String | No | Built-in profile type filter. `user-known` returns users with profile info, `user-anonymous` returns users without profile info, and `user-all` disables this filter. |
| `profile_group` | String | No | Cohort/profile group id; adds a `chr.<profile_group>.in=true` filter. |
| `visibleColumns` | String (JSON Array) | No | Additional fields to include in list rows. `chr-group` is mapped from the stored `chr` field. |
| `fetchOnlyVisibleColumns` | Boolean String | No | If set, starts from a minimal projection and adds only requested visible columns. |
| `iSortCol_0` | Number | No | Sort column index |
| `sSortDir_0` | String | No | Sort direction (`asc`, `desc`) |
| `iDisplayStart` | Number | No | Pagination offset |
| `iDisplayLength` | Number | No | Pagination page size |
| `sSearch` | String | No | Text search in indexed fields |
| `exportToFile` | Boolean String | No | Streams matching users as an export file instead of returning JSON. |
| `type` | String | No | Export type used with `exportToFile`; `json` applies JSON line transformation. |
| `filename` | String | No | Export filename used with `exportToFile`. |
| `report_name` | String | No | Long-task/report name override for list or breakdown tasks. |
| `report_desc` | String | No | Long-task/report description. |
| `period_desc` | String | No | Long-task period label. Defaults to `User Data`. |
| `autoRefresh` | Boolean String | No | Long-task auto-refresh flag. |
| `force` | Boolean String | No | Forces long-task execution instead of reusing a matching running task. |
| `r_hour` | Number | No | Auto-refresh hour for a long task. Defaults to `2`. |
| `linked_to` | String | No | Optional long-task link target. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.show_notes_in_list` | `true` | List projection fields | Adds/removes `note` field in `aaData` list rows |

## Response

### List Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 245,
  "iTotalDisplayRecords": 50,
  "aaData": [
    {
      "_id": "d8f4d8f91ac1f1f5a8e6f0d9d3f4c0a71b2e3d4f",
      "uid": "u_102",
      "name": "Jane Doe",
      "sc": 42,
      "ls": 1739557500,
      "cc": "US"
    }
  ]
}
```

### Single Profile Response

When `uid` or `did` is provided, the endpoint returns a profile document instead of a DataTables list.

```json
{
  "_id": "d8f4d8f91ac1f1f5a8e6f0d9d3f4c0a71b2e3d4f",
  "uid": "u_102",
  "did": "device-102",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "cc": "US",
  "p": "iOS",
  "sc": 42,
  "ls": 1739557500,
  "picture": "https://www.gravatar.com/avatar/..."
}
```

### Breakdown Response

When `projectionKey` is provided in list mode, the endpoint groups matching users by the first projection key.

```json
{
  "sEcho": "1",
  "breakDownData": [
    {
      "_id": "US",
      "sum": 120
    },
    {
      "_id": "DE",
      "sum": 48
    }
  ],
  "projectionKey": "cc",
  "total": 245
}
```

### Long Task Response

For expensive list or breakdown requests, the task manager may return a task id instead of the final result.

```json
{
  "task_id": "67bd31c92e7f0b0012ab4567"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value for table requests |
| `iTotalRecords` | Number | Total users count |
| `iTotalDisplayRecords` | Number | Filtered users count |
| `aaData` | Array | User row objects |
| `aaData[].uid` | String | User ID, when known. |
| `aaData[].did` | String | Device ID. |
| `aaData[].name` | String | Display name. Falls back to `did` or an empty string. |
| `aaData[].cc` | String | Country code. |
| `aaData[].p` | String | Platform. |
| `aaData[].sc` | Number | Session count. |
| `aaData[].ls` | Number | Last seen timestamp. |
| `breakDownData` | Array | Breakdown rows returned when `projectionKey` is provided. |
| `breakDownData[]._id` | Any | Group value for the selected projection key. |
| `breakDownData[].sum` | Number | Number of matching users in this group. |
| `projectionKey` | String | First item parsed from the `projectionKey` array. |
| `total` | Number | Estimated total users in the app, used in breakdown mode. |
| `task_id` | String | Long-task id returned when the request continues asynchronously. |

### Error Responses

- **HTTP 400** - Invalid request params (example):
```json
{
  "result": "Error. Please check logs."
}
```

- **HTTP 401** - Invalid auth:
```json
{
  "result": "User does not exist"
}
```

## Behavior/Processing

- Without `uid`/`did`, returns list mode with filtering, sorting, and pagination.
- With `uid`/`did`, returns one user profile object.
- Parses `query` as JSON. Invalid JSON is logged and treated as an empty filter.
- Dispatches Drill query preprocessing for `query`, which lets query-builder user-property filters be translated before reading `app_users{appId}`.
- Applies `sSearch` as a text search and `filter` as a built-in known/anonymous profile filter.
- Parses `projectionKey` as a JSON array and uses only the first item for breakdown grouping.
- For breakdown mode, aggregates matching users by `projectionKey` and returns `breakDownData`, `projectionKey`, and `total`.
- For normal list mode, default projected fields include identity, location, device/platform, session counters, email, picture, and `events`; `visibleColumns` can add fields.
- If `users.show_notes_in_list` is enabled, list rows include `note`.
- Expensive list or breakdown requests can return `{ "task_id": "..." }` while the task manager continues processing.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&iDisplayStart=0&iDisplayLength=20
```

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&uid=u_102
```

### Filter users with a Drill-style user query

```text
/o?api_key=YOUR_API_KEY&
  app_id=YOUR_APP_ID&
  method=user_details&
  query={"up.cc":{"$in":["US","CA"]},"up.p":{"$in":["iOS"]}}&
  iDisplayStart=0&
  iDisplayLength=20
```

### Return a user-property breakdown

```text
/o?api_key=YOUR_API_KEY&
  app_id=YOUR_APP_ID&
  method=user_details&
  query={"up.cc":{"$in":["US","CA"]}}&
  projectionKey=["cc"]
```

### Include extra visible columns

```text
/o?api_key=YOUR_API_KEY&
  app_id=YOUR_APP_ID&
  method=user_details&
  visibleColumns=["email","custom.plan","chr-group"]&
  iDisplayStart=0&
  iDisplayLength=50
```

## Related Endpoints

- [User Profiles - Timeline Graph](graph.md)
- [User Profiles - Sessions](sessions.md)
- [User Profiles - Events Table](events-table.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-04-17
