---
sidebar_label: "Create or Update Alert"
---

## Endpoint

`/i/concurrent_alert/save`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Create a new online user alert or update an existing one. Supports threshold-based alerts that trigger when online user counts exceed or fall below specified limits. Use this endpoint to programmatically set up automated monitoring for online user activity.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `alerts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| alert | String (JSON) | Yes | JSON-stringified alert object |

## Alert Object

**Common fields**:
- `name` (String, required)
- `condition_title` (String, required)
- `type` (String, required): `t` for threshold alerts, other values for metric/offline alerts
- `enabled` (Boolean, required)

**Threshold alerts (`type: "t"`)**:
- `def` (String, required): `max` or `min`
- `users` (Number, required): must be $\geq 0$
- `minutes` (Number, required): must be within the configured alert window
- `email` (Array, optional): email recipients

**Other alert types**:
- `minutes` is set to `30` by the server

**Update-only**:
- `_id` (String, required for updates)
- `reset` (Boolean, optional): when true, clears `last_triggered` and resets `defined_at`

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `concurrent_users.*` | Online Users feature defaults | Live-count and alert behavior for online-user endpoints. | Changes to Online Users settings can alter alert handling, thresholds, or returned live metrics. |

## Response

### Success Response - Create

```
"5d4472152de8f07336f3b352"
```

Returns the new alert's ObjectID as a string.

### Success Response - Update

```json
{
  "_id": "5d4472152de8f07336f3b352",
  "name": "Peak Traffic",
  "app": "5be987d7b93798516eb5289a",
  "condition_title": "Users exceed 5000",
  "type": "t",
  "enabled": true,
  "def": "max",
  "users": 5000,
  "minutes": 5,
  "email": ["admin@company.com"],
  "created_by": "5d4472152de8f07336f3b100",
  "defined_at": 1564896097406
}
```

Returns the full updated alert object.

### Response Fields

| Field | Type | Description |
|---|---|---|
| _id | String | Alert ObjectID; present in update response only |
| name | String | Alert display name |
| app | String | Application ID; present in update response only |
| condition_title | String | Human-readable condition description |
| type | String | Alert type: `t` for threshold |
| enabled | Boolean | Active status of the alert |
| def | String | Trigger mode: `max` (exceeds threshold) or `min` (falls below) |
| users | Number | Threshold value for alert trigger |
| minutes | Number | Time window in minutes for condition evaluation |
| email | Array | Email addresses to notify when alert triggers |
| created_by | String | ObjectID of creator; present in update response only |
| defined_at | Number | Timestamp (ms) of creation/modification; present in update response only |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 200 | `{\"result\": \"Not enough args\"}` | Missing required alert fields |
| 200 | `{\"result\": \"Invalid users value (at least 0)\"}` | `users` parameter is negative |
| 200 | `{\"result\": \"Invalid minutes value (must be between N and M)\"}` | `minutes` outside configured range |
| 400 | `{\"result\": \"Insufficient permissions\"}` | User lacks Create permission on alerts feature |
| 500 | `{\"result\": \"Failed to create an alert\"}` | Database insert error |
| 500 | `{\"result\": \"Failed to save the alert\"}` | Database update error on modify |

## Behavior/Processing

- Create (no `_id`): Returns ObjectID as string
- Update (with `_id`): Returns full alert object
- Clears `last_triggered` if `reset=true` on update

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_alerts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

## Limitations

- Cannot batch multiple alerts in in a single request (one alert per call)
- Alert type cannot be changed after creation; delete and recreate to change
- Email addresses are accepted but not formally validated; typos silently fail during notification
- `minutes` parameter must be within the configured alert window (see index for defaults)

## Examples

### Example 1: Create a simple threshold alert

```bash
curl -X POST "https://your-server.com/i/concurrent_alert/save" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'alert={"name":"Peak Traffic Alert","condition_title":"Online users exceed 1000","enabled":true,"type":"t","def":"max","users":1000,"minutes":5}'
```

### Example 2: Create alert with email recipients

```bash
curl -X POST "https://your-server.com/i/concurrent_alert/save" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'alert={"name":"Critical Traffic","condition_title":"Online users exceed 5000","enabled":true,"type":"t","def":"max","users":5000,"minutes":10,"email":["admin@company.com","ops@company.com"]}'
```

### Example 3: Update an existing alert

```bash
curl -X POST "https://your-server.com/i/concurrent_alert/save" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'alert={"_id":"507f1f77bcf86cd799439011","name":"Updated Alert","condition_title":"Online users exceed 2000","enabled":true,"type":"t","def":"max","users":2000,"minutes":8}'
```

## Related Endpoints

- [Get Alerts](concurrent-users-alerts.md) - Retrieve alerts for an application
- [Delete Alert](concurrent-users-alert-delete.md) - Remove an alert configuration
- [Update Alert Status](concurrent-users-alert-status.md) - Enable or disable alerts in bulk

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
