---
sidebar_label: "Delete Alert"
---

## Endpoint

`/i/concurrent_alert/delete`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Permanently remove an online user alert from your application. This stops all monitoring and notifications associated with the alert. The deletion is permanent and cannot be undone.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Delete` on the `alerts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| alertId | String | Yes | Alert ObjectID to delete (MongoDB format) |

## Response

### Success Response

```json
{
  "result": "Deleted an alert"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Status message confirming deletion |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 200 | `{\"result\": \"Failed to delete the alert\"}` | Alert not found or deletion failed |
| 500 | `{\"result\": \"Failed to delete the alert\"}` | Database or server error during deletion |

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_alerts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

## Limitations

- Alert deletion is permanent and cannot be undone
- Cannot batch delete multiple alerts in a single request

## Examples

### Example: Delete an alert

```bash
curl -X POST "https://your-server.com/i/concurrent_alert/delete" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "alertId=507f1f77bcf86cd799439011"
```

## Related Endpoints

- [Get Alerts](concurrent-users-alerts.md) - Retrieve alerts for an application
- [Create or Update Alert](concurrent-users-alert-save.md) - Create a new alert or modify existing one
- [Update Alert Status](concurrent-users-alert-status.md) - Enable or disable alerts

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
