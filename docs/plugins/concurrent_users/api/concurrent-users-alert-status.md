---
sidebar_label: "Update Alert Status"
---

## Endpoint

`/i/concurrent_alert/status`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Enable or disable alerts in bulk to manage which alerts are active. Disabling temporarily suspends monitoring without deleting configuration, useful for maintenance windows. Enabling resets the alert's trigger state and start evaluation fresh.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `alerts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| status | String (JSON) | Yes | JSON map of alert ID to enabled state (`true` or `false`) |

## Response

### Success Response

```json
true
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| (response) | Boolean | Always `true` on success; indicates status updates were applied |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{\"result\": \"Insufficient permissions\"}` | User lacks Update permission on alerts feature |
| 500 | `{\"result\": \"Concurrent users API error.\"}` | Server error during status update |

## Behavior/Processing

- Request accepts a JSON map of alert IDs to boolean states: `{"alert_id_1": true, "alert_id_2": false}`
- When enabling (`true`): Sets `defined_at` to current timestamp and clears `last_triggered` (restarts the alert)
- When disabling (`false`): Only updates `enabled` field; preserves `last_triggered`
- For metric-type alerts (`type: "m"` or `type: "o"`): Server refetches and updates internal cache records
- All specified alerts are updated atomically; partial failures are not returned individually

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_alerts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Limitations

- Maximum 1000 alert status changes per request
- Disabling an alert does not clear its `last_triggered` timestamp (use delete and recreate to fully reset)
- Non-existent alert IDs in the status map are silently ignored (no error returned)

## Examples

### Example 1: Enable and disable multiple alerts

```bash
curl "https://your-server.com/i/concurrent_alert/status" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'status={"507f1f77bcf86cd799439011":true,"607f1f77bcf86cd799439022":false}'
```

### Example 2: Disable all alerts for maintenance

```bash
curl "https://your-server.com/i/concurrent_alert/status" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'status={"507f1f77bcf86cd799439011":false,"507f1f77bcf86cd799439012":false}'
```

## Related Endpoints

- [Get Alerts](concurrent-users-alerts.md) - Retrieve alerts and their current status
- [Create or Update Alert](concurrent-users-alert-save.md) - Create a new alert or modify existing configuration
- [Delete Alert](concurrent-users-alert-delete.md) - Permanently remove an alert

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
