---
sidebar_label: "SDK Logs Stop"
keywords:
  - "/i/sdk_logs/stop"
  - "stop"
  - "sdk_logs"
last_update:
  date: "2026-10-09"
---

# SDK - SDK Logs Stop

## Endpoint

```plaintext
/i/sdk_logs/stop
```

## Overview

Stops SDK log gathering for one app user. Logs already gathered are kept.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |
| `uid` | String | Yes | Countly internal user ID. |

## Examples

### Stop gathering

```plaintext
/i/sdk_logs/stop?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=1
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
| `result` | String | `Success` when gathering is marked as stopped. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"app_id\""
}
```

- `400`

```json
{
  "result": "Error: ..."
}
```

- `404`

```json
{
  "result": "No SDK log gathering state for this user"
}
```

- `500`

```json
{
  "result": "Error stopping SDK log gathering"
}
```

## Behavior

- Marks the user's gathering state as stopped and records the stop time.
- Gathered logs and counters are kept.

### Impact on Other Data

- Updates the user's document in `countly.app_users{appId}`.

## Related Endpoints

- [SDK - SDK Logs Start](i-sdk-logs-start.md)
- [SDK - SDK Logs Delete](i-sdk-logs-delete.md)
