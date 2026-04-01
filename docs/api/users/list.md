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

Returns either a paginated users list or a single user profile (when `uid` or `did` is provided).

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
| `query` | String (JSON Object) | No | Filter query for list mode |
| `iSortCol_0` | Number | No | Sort column index |
| `sSortDir_0` | String | No | Sort direction (`asc`, `desc`) |
| `iDisplayStart` | Number | No | Pagination offset |
| `iDisplayLength` | Number | No | Pagination page size |
| `sSearch` | String | No | Text search in indexed fields |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.show_notes_in_list` | `true` | List projection fields | Adds/removes `note` field in `aaData` list rows |

## Response

### Success Response

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

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value for table requests |
| `iTotalRecords` | Number | Total users count |
| `iTotalDisplayRecords` | Number | Filtered users count |
| `aaData` | Array | User row objects |

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

- Without `uid`/`did`, returns list mode with filtering/sorting/pagination.
- With `uid`/`did`, returns one user profile object.
- Supports optional breakdown workflow when `projectionKey` is used (may return task response).

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

2026-02-16
