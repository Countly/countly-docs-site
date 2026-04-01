---
sidebar_label: "Read"
keywords:
  - "/o/revenue"
  - "revenue"
---

# Revenue - Analytics

## Endpoint

```text
/o/revenue
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns revenue analytics merged with paying-user timeline data for selected IAP events.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Revenue: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `events` | String or JSON Array | Yes | Revenue event key(s). Example: `events=["Purchase","Buy"]` |
| `period` | String | Yes | Period descriptor (for example `30days`) |
| `no_cache` | Boolean/String | No | Bypass cached query results |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `apps.plugins.revenue.iap_events` | `[]` | Paying-user calculation (`p` values) | Defines which incoming SDK events count as purchases |

## Response

### Success Response

```json
{
  "2026": {
    "2": {
      "15": {
        "u": {
          "e": {
            "Purchase": { "c": 3, "s": 44.97 }
          },
          "s": 12
        },
        "p": 1
      },
      "p": 1
    },
    "p": 1
  },
  "lu": 1739629204
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `YYYY` | Object | Year bucket |
| `YYYY.MM` | Object | Month bucket |
| `YYYY.MM.DD` | Object | Day bucket |
| `u` | Object | Session + event aggregate for that bucket |
| `u.e` | Object | Event aggregates keyed by event name |
| `u.s` | Number | Session count |
| `p` | Number | Paying users count |
| `lu` | Number | Last update timestamp |

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

- Normalizes `events` into an array when needed.
- Loads session model for the requested period.
- Calculates paying users from configured IAP events and merges into response model.
- Returns raw merged object with time buckets and `p` counters.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.users` | User aggregates | Stores app-level user aggregate counters/metrics read or updated by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/o/revenue?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&events=["Purchase","Buy"]&period=30days
```

```text
/o/revenue?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&events=Purchase&period=7days&no_cache=true
```

## Limitations

- Meaningful revenue output depends on correctly configured `iap_events` and event sums.
- Large periods can trigger long-running processing.

## Related Endpoints

- [Revenue - Configuration](configuration.md)

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
