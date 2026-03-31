---
sidebar_label: "Get Live Count"
---

## Endpoint

`/o?method=live`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Get the current number of online users and the all-time maximum counts for an application. Returns both regular users and new users separately. The response is updated in real-time based on active sessions.

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
| app_id | String | Yes | Application identifier |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `concurrent_users.*` | Online Users feature defaults | Live-count and alert behavior for online-user endpoints. | Changes to Online Users settings can alter alert handling, thresholds, or returned live metrics. |

## Response

### Success Response

```json
{
  "o": 1250,
  "n": 45,
  "om": 5000,
  "nm": 250
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| o | Number | Current number of online (existing) users in the app |
| n | Number | Current number of new online users in the app |
| om | Number | All-time maximum concurrent online (existing) users |
| nm | Number | All-time maximum concurrent new online users |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Missing required parameters"}` | Missing `app_id` or authentication |
| 500 | `{"result": "Concurrent users API error."}` | Server error in data retrieval or processing |

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Limitations

- Requires `Read` permission on the Online Users feature (`concurrent_users`)
- `om` and `nm` reset when maximum values are explicitly cleared via `/i/concurrent_users_max/reset`
- Data updates every `read_interval` seconds (default: 10 seconds); values lag slightly behind real-time

## Examples

### Example: Get live user counts

```bash
curl "https://your-server.com/o?method=live&app_id=YOUR_APP_ID" \
  -d "api_key=YOUR_API_KEY"
```

## Related Endpoints

- [Get Online User Metrics](concurrent-users-metrics.md) - Retrieve detailed online user metrics by time mode

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
