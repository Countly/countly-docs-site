---
sidebar_label: "SDK Test Arm/Disarm"
keywords:
  - "/i/sdk-test"
  - "arm"
  - "disarm"
  - "sdk-test"
last_update:
  date: "2026-10-09"
---

# SDK - SDK Connection Test Arm/Disarm

## Endpoint

```plaintext
/i/sdk-test/{arm|disarm}
```

## Overview

Arms or disarms an SDK connection test for one app user. An armed test is valid for one hour. Any other sub-path is not handled by this endpoint.

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
| `uid` | String | Conditional | Countly internal user ID. Required if `device_id` is not provided. |
| `device_id` | String | Conditional | Device ID of the user. Required if `uid` is not provided. |

## Examples

### Arm a test

```plaintext
/i/sdk-test/arm?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&device_id=device_123
```

### Disarm a test

```plaintext
/i/sdk-test/disarm?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&device_id=device_123
```

## Response

### Success Response

For `arm`:

```json
{
  "tid": "ct_lk2x9a1_f3k9zq",
  "exp": 1682332045330
}
```

For `disarm`:

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `tid` | String | ID of the armed test (`arm` only). |
| `exp` | Number | Expiry time in milliseconds (`arm` only). |
| `result` | String | `Success` (`disarm` only). |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"uid\" or \"device_id\""
}
```

- `400`

```json
{
  "result": "User not found"
}
```

- `500`

```json
{
  "result": "Server error"
}
```

## Behavior

- `arm` cancels any test already armed for the user, then arms a new one that expires after one hour.
- `disarm` clears the armed flag of the user and cancels their armed test.
- Both actions are written to system logs.

### Impact on Other Data

- Updates the user's document in `countly.app_users{appId}`.
- Writes test records to `countly.sdk_connection_tests`.

## Related Endpoints

- [SDK - SDK Logs Start](i-sdk-logs-start.md)
