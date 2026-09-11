---
sidebar_label: "Clear Cache"
keywords:
  - "/i/active_users/clear_active_users_cache"
  - "clear_active_users_cache"
  - "active_users"
last_update:
  date: "2026-02-16"
---

# Clear Cache

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/active_users/clear_active_users_cache
```

## Overview

Manually invalidate cached active user data to force recalculation on the next request.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Read (active_users feature)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Conditional* | Application ID to clear cache for |
| all_apps | Boolean | Conditional* | If `true`, clear cache for all applications (global admin only) |

*Required: Provide `app_id` for app-specific clearing, or use `all_apps=true` with global admin credentials.

## Examples

### Example 1: Clear Cache for Specific App

**Description**: Clears active users cache for a single application.

**Request**:
```bash
curl "https://your-server.com/i/active_users/clear_active_users_cache?api_key=YOUR_API_KEY&app_id=123456789"
```

**Response**:
```json
{
  "result": "Success"
}
```

### Example 2: Clear Cache for All Apps

**Description**: Clears active users cache for all applications.

**Request**:
```bash
curl "https://your-server.com/i/active_users/clear_active_users_cache?api_key=YOUR_API_KEY&all_apps=true"
```

**Response**:
```json
{
  "result": "Success"
}
```

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
| result | String | Result message |

### Error Responses

- **HTTP 200** - Missing parameter:
```json
{
  "result": "Missing parameter \"app_id\" or \"all_apps\""
}
```
- **HTTP 401** - Missing `app_id` for non-global admin:
```json
{
  "result": "No app_id provided"
}
```
- **HTTP 400** - Database error:
```json
{
  "result": "Db error"
}
```

## Behavior

- If `app_id` is provided, clears cache for that application only.
- If `all_apps=true`, clears cache for all applications (global admin credentials required).

## Related Endpoints

- [Active Users - Read](active-users-metrics.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.active_users` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
