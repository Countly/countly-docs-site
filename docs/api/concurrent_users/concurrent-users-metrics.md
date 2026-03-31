---
sidebar_label: "Get Metrics"
---

# /o?method=concurrent

## Endpoint

`/o?method=concurrent`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve online user metrics in multiple time modes, including real-time counts, time series, and max values.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the Online Users feature (`concurrent_users`)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| r_apps | String (JSON) | No | JSON array of app IDs to query across multiple apps |
| app_id | String | Yes (if r_apps not provided) | Single app ID fallback |
| mode | Number | No (default: 0) | Mode selector for data granularity |
| add_new | Boolean | No | Include new-user metrics (`ns_n`) when true |

**mode values**:
- `0`: Current online counts
- `1`: Metrics breakdown (country, device, source)
- `2`: Last 60 minutes (per-minute data)
- `3`: Last 24 hours (per-hour data)
- `4`: Last 30 days (per-day data)
- `5`: All-time maximum values

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `concurrent_users.*` | Online Users feature defaults | Live-count and alert behavior for online-user endpoints. | Changes to Online Users settings can alter alert handling, thresholds, or returned live metrics. |

## Response

### Success Response (mode: 0 - Current Online)

```json
{
  "ns_o": {
    "5be987d7b93798516eb5289a": {
      "o": 1250,
      "m": {
        "cc": {"US": 450, "UK": 280, "FR": 200, "DE": 150},
        "lv": {"iPhone": 520, "Android": 600, "Web": 130},
        "src": {"organic": 800, "paid": 350, "direct": 100}
      }
    }
  },
  "ns_n": {
    "5be987d7b93798516eb5289a": {
      "o": 45,
      "m": {
        "cc": {"US": 20, "UK": 12, "FR": 8, "DE": 5},
        "lv": {"iPhone": 18, "Android": 22, "Web": 5},
        "src": {"organic": 30, "paid": 12, "direct": 3}
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| ns_o | Object | Existing user metrics (keys are app IDs) |
| `ns_o.\{appId\}.o` | Number | Current count of existing online users |
| `ns_o.\{appId\}.m` | Object | Metrics breakdown object |
| `ns_o.\{appId\}.m.cc` | Object | Online users by country code |
| `ns_o.\{appId\}.m.lv` | Object | Online users by device type |
| `ns_o.\{appId\}.m.src` | Object | Online users by traffic source |
| ns_n | Object | New user metrics (keys are app IDs); only present if `add_new=true` |
| `ns_n.\{appId\}.o` | Number | Current count of new online users |
| `ns_n.\{appId\}.m` | Object | Metrics breakdown for new users (same structure as ns_o.m) |

**For modes 2-4 (time series)**: Returns arrays of data points; each point includes `data` (count) and `time` (timestamp).

**For mode 5 (overall max)**: Returns single aggregate object with `mx` field containing the all-time maximum.

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{\"result\": \"Neither r_apps nor app_id is provided.\"}` | Missing both query parameters |
| 400 | `{\"result\": \"Insufficient permissions\"}` | User lacks Read permission on feature |
| 500 | `{\"result\": \"Concurrent users API error.\"}` | Server error in data aggregation or retrieval |

## Behavior/Processing

- If `r_apps` is missing/invalid, falls back to `app_id`
- Returns **400** if neither `r_apps` nor `app_id` provided
- Invalid `mode` values default to `0`

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_active` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.concurrent_users_max` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_users\{appId\}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

## Limitations

- `r_apps` parameter is limited to a reasonable number of app IDs to prevent query overload
- `add_new` parameter adds significant query overhead; use only when new user metrics are needed
- Time series queries (modes 2-4) may return empty data if insufficient sampling intervals have passed
- `mode:1` (metrics breakdown) may omit dimensions with 0 users for brevity
- Metrics are sampled every `sampling_interval` seconds (default: 30 seconds)
- Alert condition window must be at least `alert_interval` minutes (default: 3 minutes)

## Examples

### Example 1: Get current online counts (mode: 0)

```bash
curl "https://your-server.com/o?method=concurrent&app_id=YOUR_APP_ID&mode=0" \
  -d "api_key=YOUR_API_KEY"
```

### Example 2: Get metrics breakdown by geography/device (mode: 1)

```bash
curl "https://your-server.com/o?method=concurrent&app_id=YOUR_APP_ID&mode=1" \
  -d "api_key=YOUR_API_KEY"
```

### Example 3: Get hourly trend for last 24 hours (mode: 3)

```bash
curl "https://your-server.com/o?method=concurrent&r_apps=[\"YOUR_APP_ID\"]&mode=3&add_new=true" \
  -d "api_key=YOUR_API_KEY"
```

### Example 4: Get all-time maximum values (mode: 5)

```bash
curl "https://your-server.com/o?method=concurrent&app_id=YOUR_APP_ID&mode=5" \
  -d "api_key=YOUR_API_KEY"
```

## Related Endpoints

- [Get Live Count](concurrent-users-live.md) - Current online users and all-time max (simple view)
- [Get All Alerts](concurrent-users-alerts.md) - View configured online user alerts

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

Last Updated: 2026-02-14

---

## Last Updated

2026-02-16
