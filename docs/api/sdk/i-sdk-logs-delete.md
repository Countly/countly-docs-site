---
sidebar_label: "SDK Logs Delete"
keywords:
  - "/i/sdk_logs/delete"
  - "delete"
  - "sdk_logs"
last_update:
  date: "2026-10-09"
---

# SDK - SDK Logs Delete

## Endpoint

```plaintext
/i/sdk_logs/delete
```

## Overview

Deletes the SDK logs gathered for one app user and resets the user's gathered line count. A capture that is running keeps running.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |
| `uid` | String | Yes | Countly internal user ID. |

## Examples

### Delete gathered logs

```plaintext
/i/sdk_logs/delete?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=1
```

## Response

### Success Response

```json
{
  "result": "Success",
  "deleted": 3
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when the logs are deleted. |
| `deleted` | Number | Number of stored log batches deleted. |

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

- `500`

```json
{
  "result": "Failed to delete SDK log batches"
}
```

The message names what failed: `line allowance`, `log batches`, or both joined with `and`.

## Behavior

- Deletes every stored log batch of the user.
- Resets the gathered line count of the user to `0`.
- The gathering state itself is kept.

### Impact on Other Data

- Deletes the user's batches from `countly.sdk_logs{appId}`.
- Updates the user's document in `countly.app_users{appId}`.

## Related Endpoints

- [SDK - SDK Logs Start](i-sdk-logs-start.md)
- [SDK - SDK Logs Stop](i-sdk-logs-stop.md)
