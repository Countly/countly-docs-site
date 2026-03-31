---
sidebar_label: "User Properties Delete"
---
# Delete user properties

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/user-properties/delete
```

## Overview

Deletes a user-property definition and unsets its values from all user profiles in the target app.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Property identifier in `group|property` format. Supported groups: `custom`, `up`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when property deletion is completed. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

- Splits `id` into group and property.
- For `custom`, unsets `custom.{property}` from `countly.app_users{appId}`.
- For `up`, unsets `{property}` from `countly.app_users{appId}`.
- Removes matching property metadata from `countly_drill.drill_meta`.
- Writes system logs with `dm-dt-custom-delete` or `dm-dt-up-delete`.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-dt-custom-delete` | `id` for custom user property delete | `{ setQuery, id }` |
| `dm-dt-up-delete` | `id` for built-in user property delete | `{ setQuery, id }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | User profile data cleanup | Unsets the selected user-property field from all user profiles in the app collection. |
| `countly_drill.drill_meta` | User-property metadata cleanup | Removes per-property metadata documents and unsets property definition under `_meta_up`. |
| `countly.systemlogs` | Audit trail | Writes `dm-dt-custom-delete` or `dm-dt-up-delete` with deleted property context. |

---

## Examples

### Delete a custom user property

```text
/i/data-manager/user-properties/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=custom|subscription_tier
```

### Delete an `up` property

```text
/i/data-manager/user-properties/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=up|company
```

---

## Related Endpoints

- [User Properties - Read](user-properties-read.md)

---

## Last Updated

2026-02-16
