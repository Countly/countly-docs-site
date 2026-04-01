---
sidebar_label: "Timeline Graph"
keywords:
  - "/o"
  - "o"
---

# User Profiles - Timeline Graph

## Endpoint

```text
/o?method=user_details&calculate=graph
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns user activity timeline graph data.

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
| `calculate` | String | Yes | Must be `graph` |
| `uid` | String | No | User ID |
| `did` | String | No | Device ID alternative |
| `period` | String | No | Requested period |
| `bucket` | String | No | `daily`, `weekly`, `monthly`, `hourly` |
| `dbOverride` | String | No | Query adapter override |
| `comparisonMode` | Boolean/String | No | Comparison mode flag |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `users.*` | User profile feature defaults | User-details retrieval behavior in profile endpoints. | Changes to user feature settings can affect which profile-related fields/aggregations are returned. |

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

## Behavior/Processing

- Resolves `uid` from `did` when needed.
- Maps bucket aliases (`daily`, `weekly`, `monthly`, `hourly`) to internal bucket keys.
- Returns `{}` when user cannot be resolved.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_details&calculate=graph&uid=u_102&period=30days&bucket=daily
```

## Related Endpoints

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
