---
sidebar_label: "History"
keywords:
  - "/o"
  - "o"
---

# User Profiles - History

## Endpoint

```text
/o?method=user_details&calculate=history
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns single-user profile object enriched with historical property changes.

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
| `calculate` | String | Yes | Must be `history` |
| `uid` | String | No | User ID |
| `did` | String | No | Device ID alternative |
| `period` | String | No | Requested period |
| `periodOffset` | Number | No | Offset in minutes |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.*` | User profile feature defaults | User-details retrieval behavior in profile endpoints. | Changes to user feature settings can affect which profile-related fields/aggregations are returned. |

## Response

### Success Response

```json
{
  "_id": "d8f4d8f91ac1f1f5a8e6f0d9d3f4c0a71b2e3d4f",
  "uid": "u_102",
  "name": "Jane Doe",
  "history": {
    "cc": {
      "US": true,
      "DE": true
    },
    "p": {
      "iOS": {
        "17.2": true
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | User document ID |
| `uid` | String | User ID |
| `history` | Object | Historical property values map |

### Error Responses

- **HTTP 400** - Missing user identifier:
```json
{
  "result": "Missing parameter \"uid\" or \"did\""
}
```

- **HTTP 400** - User not found:
```json
{
  "result": "User not found"
}
```

## Behavior/Processing

- Loads base user profile from app users collection.
- Fetches historical values from query layer and adds them under `history`.
- Returns raw user object.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=history&uid=u_102&period=30days
```

## Related Endpoints

- [User Profiles - List or Profile](list.md)

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
