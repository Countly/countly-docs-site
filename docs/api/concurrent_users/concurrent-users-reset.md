---
sidebar_label: "Reset Maximum"
---

## Endpoint

`/i/concurrent_users_max/reset`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Reset the all-time maximum online user counters for an app.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the Online Users feature (`concurrent_users`)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Operation status: `Success` indicates reset completed |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 200 | `{\"result\": \"Failed to reset the max value of online users\"}` | Reset operation failed or app not found |
| 400 | `{\"result\": \"Insufficient permissions\"}` | User lacks Update permission on feature |
| 500 | `{\"result\": \"Failed to reset the max value of online users\"}` | Database or server error |

## Behavior/Processing

- Locates documents with keys `{appId}_overall` and `{appId}_overall_new` in `concurrent_users_max` collection
- Sets `mx` (maximum value) to `0` for both documents
- Clears all time-series history (per-day, per-hour, per-minute max records are also removed)
- Does not affect current live user counts; only resets the all-time maximum tracking
- Does not affect alert configurations or execution history

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_max` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Limitations

- Reset is permanent and cannot be undone
- Affects only maximum tracking; active user sessions continue uninterrupted
- Resetting an app's max does not affect other apps' max values

## Examples

### Example 1: Reset maximum values for an app

```bash
curl -X POST "https://your-server.com/i/concurrent_users_max/reset" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

### Example 2: Reset with auth token

```bash
curl -X POST "https://your-server.com/i/concurrent_users_max/reset" \
  -H "countly-token: YOUR_AUTH_TOKEN" \
  -d "app_id=YOUR_APP_ID"
```

## Related Endpoints

- [Get Online User Metrics](concurrent-users-metrics.md) - Retrieve current and historical metrics
- [Get Live Count](concurrent-users-live.md) - View current online users and all-time max

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
