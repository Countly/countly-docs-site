---
sidebar_label: "Read"
keywords:
  - "/o/active_users"
  - "active_users"
---

# Read

## Endpoint

```
/o/active_users
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve active user metrics (DAU, WAU, MAU) for a specified time period.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Read (active_users feature)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application ID to fetch metrics for |
| period | String or Array | No | Time period: "yesterday", "hour", "7days", "30days", "60days", "day", "month", or custom array [start_timestamp, end_timestamp] (default: "30days") |
| db_override | String | No | Override Drill adapter (ignored if set to "compare" or "config") |
| comparison | Boolean | No | When true, enables QueryRunner comparison mode (runs query on all available adapters for comparison logging) |

## Response

### Success Response

```json
{
  "calculating": false,
  "data": {
    "2024.2.11": {
      "d": 245,
      "w": 1820,
      "m": 5340
    },
    "2024.2.12": {
      "d": 258,
      "w": 1943,
      "m": 5467
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| calculating | Boolean | `true` when background calculation is in progress |
| data | Object | Dictionary of dates with metrics |
| `data.<date>.d` | Number | Daily Active Users for that calendar day |
| `data.<date>.w` | Number | Weekly Active Users (unique users in past 7 days including current day) |
| `data.<date>.m` | Number | Monthly Active Users (unique users in past 30 days including current day) |
| drillDisabled | Boolean | Present when Drill is disabled or unavailable |

### Error Responses

- **HTTP 400** - Missing authentication:
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- **HTTP 401** - Missing `app_id`:
```json
{
  "result": "No app_id provided"
}
```

## Behavior/Processing

- Requires Drill to be enabled; otherwise returns `drillDisabled: true` with empty data.
- Calculates missing or stale entries in the background and returns `calculating: true` until refreshed.
- `db_override` selects a Drill adapter unless set to `compare` or `config`.
- `comparison=true` enables comparison mode for query execution.
- For `period=month`, the response is grouped by month keys (`YYYY.M`) and values are averaged from daily values within each month.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.active_users` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

## Examples

### Example 1: Get Active Users for Last 30 Days

**Description**: Retrieves DAU/WAU/MAU metrics for the default 30-day period.

**Request**:
```bash
curl "https://your-server.com/o/active_users?api_key=YOUR_API_KEY&app_id=123456789&period=30days"
```

**Response**:
```json
{
  "calculating": false,
  "data": {
    "2024.2.11": {
      "d": 245,
      "w": 1820,
      "m": 5340
    },
    "2024.2.12": {
      "d": 258,
      "w": 1943,
      "m": 5467
    },
    "2024.2.13": {
      "d": 201,
      "w": 1756,
      "m": 5289
    }
  }
}
```

### Example 2: Get Active Users for Custom Date Range

**Description**: Retrieves active user metrics for a specific date range using timestamps.

**Request**:
```bash
curl "https://your-server.com/o/active_users?api_key=YOUR_API_KEY&app_id=123456789&period=[1707619200,1710297600]"
```

**Response**:
```json
{
  "calculating": false,
  "data": {
    "2024.2.11": {"d": 245, "w": 1820, "m": 5340},
    "2024.2.12": {"d": 258, "w": 1943, "m": 5467}
  }
}
```

---

## Related Endpoints

- [Active Users - Clear Cache](active-users-cache-clear.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-15
---

## Last Updated

2026-02-16
