---
sidebar_label: "Retention - Read"
keywords:
  - "/o"
  - "o"
---

# Retention Segments - Read

## Endpoint

```text
/o?method=retention
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns retention data for selected period and event scope.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Retention Segments: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `method` | String | Yes | Must be `retention` |
| `period` | String | Yes | `adaily`, `aweekly`, or `amonthly` |
| `rettype` | String | No | `full`, `classic`, or `unbounded`; default `full` |
| `evt` | String | No | Event key; default `[CLY]_session` |
| `range` | String (JSON Array) | No | Timestamp range `[from,to]` in milliseconds |
| `span` | Number | No | Last N units when `range` is not provided |
| `query` | String (JSON Object) | No | User filter query |
| `save_report` | Boolean/String | No | Enables long report workflow |
| `no_cache` | Boolean/String | No | Bypass retention cache |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `retention_segments.span` | `10` | Default `span` when request omits `span` and `range` | Changes default number of returned retention buckets |

## Response

### Success Response

```json
[
  {
    "_id": "20260210",
    "tu": 152,
    "1": 58,
    "2": 37,
    "3": 30
  },
  {
    "_id": "20260211",
    "tu": 167,
    "1": 63,
    "2": 35,
    "3": 22
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Cohort start date in `yyyymmdd` format |
| `tu` | Number | Total users in the cohort |
| `1`, `2`, `3`, ... | Number | Returning users at offset day/week/month |

### Error Responses

- **HTTP 400** - Missing auth:
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- **HTTP 401** - Invalid auth:
```json
{
  "result": "User does not exist"
}
```

## Behavior/Processing

- Applies defaults: `rettype=full`, `evt=[CLY]_session`.
- Uses retention cache first unless `no_cache=true`.
- Calculates cohort retention from event stream and optional user filter.
- Supports long-running report mode with `save_report`.

### Retention Type Differences

| Type | Use Case | Definition |
|---|---|---|
| `full` | Standard retention | Users active on date X, returns on X+N |
| `classic` | Cohort analysis | Users first seen on X, returns on X+N |
| `unbounded` | Broad analysis | Any active user in range, then returns |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.retention_cache` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=retention&period=adaily&span=14
```

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=retention&period=aweekly&rettype=classic&evt=purchase
```

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=retention&period=adaily&range=[1738368000000,1739145599000]&query={"up.cc":"US"}
```

## Limitations

- Large spans and complex filters can take longer.
- Cache is TTL-based and may lag latest writes.

## Related Endpoints

- [Retention Segments - Overview](index.md)

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
