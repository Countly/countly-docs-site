---
sidebar_label: "Get Alerts"
---

# Concurrent Users - Get Alerts

## Endpoint

`/o?method=concurrent_alerts`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve all online user alerts accessible to your user. Results include alerts configured for the application, filtering based on your permissions and visible apps. The response shows each alert's configuration, triggering status, and notification recipients.

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
| app_id | String | Yes | Application ID used by the read-permission validator before listing visible alerts |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `concurrent_users.*` | Online Users feature defaults | Live-count and alert behavior for online-user endpoints. | Changes to Online Users settings can alter alert handling, thresholds, or returned live metrics. |

## Response

### Success Response

```json
[
  {
    "_id": "5d4472152de8f07336f3b352",
    "name": "High Online Users Peak",
    "app": "5be987d7b93798516eb5289a",
    "type": "t",
    "enabled": true,
    "def": "max",
    "condition_title": "Online users exceed 5000",
    "users": 5000,
    "minutes": 5,
    "email": ["admin@company.com", "ops@company.com"],
    "created_by": "5d4472152de8f07336f3b100",
    "createdByUser": "John Admin",
    "last_triggered": 1567474533960,
    "defined_at": 1564896097406,
    "status": "ready"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| _id | String (ObjectID) | Unique alert identifier |
| name | String | User-friendly alert name |
| app | String | Application ID this alert monitors |
| type | String | Alert type: `t` (threshold), `m` (metric), `o` (offline) |
| enabled | Boolean | Whether the alert is currently active |
| def | String | Alert definition: `max` (triggers on peak) or `min` (triggers on drop) |
| condition_title | String | Human-readable description of alert condition |
| users | Number | Threshold count (for type `t` alerts) |
| minutes | Number | Time window in minutes for evaluating the condition |
| email | Array | List of email addresses to notify |
| created_by | String | ObjectID of the member who created the alert |
| createdByUser | String | Full name of the alert creator |
| last_triggered | Number | Timestamp (ms) of the last alert trigger; absent if never triggered |
| defined_at | Number | Timestamp (ms) when alert was created or last modified |
| status | String | Alert status: `ready` (operational), other values indicate processing state |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{\"result\": \"Insufficient permissions\"}` | User lacks Read permission on feature |
| 500 | `{\"result\": \"Concurrent users API error.\"}` | Server error in alert retrieval |

## Behavior/Processing

- Requires `Read` permission on `concurrent_users`.
- Reads alerts from `concurrent_users_alerts` using the same visibility filter as the Online Users feature. Global admins can see all alerts; other users only see alerts for visible apps.
- Returns only alert configuration fields selected by the handler: `_id`, `name`, `app`, `def`, `users`, `minutes`, `email`, `enabled`, `condition_title`, `type`, `created_by`, `alertBy`, and `allGroups`.
- Loads `members` and enriches each alert with `createdByUser` by matching `created_by` to the member `_id`.
- Does not paginate in the handler; the full visible alert list is returned.
- Database/read errors return `Concurrent users API error.`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.concurrent_users_alerts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

## Limitations

- Results filtered by user permissions: global admins see all alerts; others see only alerts for apps they have access to
- Maximum 1000 alerts returned in a single request
- Alert definitions cannot be modified after creation; must delete and recreate to change type
- `last_triggered` field only appears if the alert has fired at least once

## Examples

### Example: List all accessible alerts

```bash
curl "https://your-server.com/o?method=concurrent_alerts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

### Example: List alerts with auth token header

```bash
curl -H "countly-token: YOUR_AUTH_TOKEN" \
  "https://your-server.com/o?method=concurrent_alerts&app_id=YOUR_APP_ID"
```

## Related Endpoints

- [Create or Update Alert](concurrent-users-alert-save.md) - Create a new alert or update existing one
- [Delete Alert](concurrent-users-alert-delete.md) - Remove an alert
- [Update Alert Status](concurrent-users-alert-status.md) - Enable or disable alerts

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

Last Updated: 2026-04-18

---

## Last Updated

2026-02-16
