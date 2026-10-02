---
sidebar_label: "Read"
keywords:
  - "/o/revenue"
  - "revenue"
last_update:
  date: "2026-02-16"
---

# Revenue - Analytics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/revenue
```

## Overview

Returns revenue analytics merged with paying-user timeline data for selected IAP events.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Examples

```text
/o/revenue?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&events=["Purchase","Buy"]&period=30days
```

```text
/o/revenue?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&events=Purchase&period=7days&no_cache=true
```

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

## Behavior

- Normalizes `events` into an array when needed.
- Loads session model for the requested period.
- Calculates paying users from configured IAP events and merges into response model.
- Returns raw merged object with time buckets and `p` counters.

## Limitations

- Meaningful revenue output depends on correctly configured `iap_events` and event sums.
- Large periods can trigger long-running processing.

## Related Endpoints

- [Revenue - Configuration](configuration.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `apps.plugins.revenue.iap_events` | `[]` | Paying-user calculation (`p` values) | Defines which incoming SDK events count as purchases |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.users` | User aggregates | Stores app-level user aggregate counters/metrics read or updated by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
