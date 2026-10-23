---
sidebar_label: "SDK Test Status/History"
keywords:
  - "/o/sdk-test"
  - "status"
  - "history"
  - "sdk-test"
last_update:
  date: "2026-10-23"
---

# SDK - SDK Connection Test Status/History

## Endpoint

```plaintext
/o/sdk-test/{status|history}
```

## Overview

Reads SDK connection tests. `status` returns the armed test and the recent test runs of one app user. `history` returns the recent test runs of the whole app. Any other sub-path is not handled by this endpoint.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |
| `uid` | String | Conditional | Countly internal user ID. For `status` only. Required if `device_id` is not provided. |
| `device_id` | String | Conditional | Device ID of the user. For `status` only. Required if `uid` is not provided. |
| `limit` | Number | No | Number of runs to return. For `history` only. Defaults to `50`, with a minimum of `1` and a maximum of `200`. |

## Examples

### Read the status of a user

```plaintext
/o/sdk-test/status?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&device_id=device_123
```

### Read the history of an app

```plaintext
/o/sdk-test/history?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&limit=20
```

## Response

### Success Response

For `status`:

```json
{
  "flag": {
    "id": "ct_lk2x9a1_f3k9zq",
    "ts": 1682328445330,
    "exp": 1682332045330,
    "by": "6991c75b024cb89cdc04efd1"
  },
  "runs": [
    {
      "app_id": "6991c75b024cb89cdc04efd2",
      "uid": "1",
      "did": "device_123",
      "tid": "ct_lk2x9a1_f3k9zq",
      "status": "armed",
      "armed": {
        "ts": 1682328445330,
        "by": "6991c75b024cb89cdc04efd1",
        "by_name": "Jane Doe",
        "exp": 1682332045330
      }
    }
  ],
  "plugins": {
    "remote-config": true,
    "ab-testing": false,
    "surveys": true,
    "star-rating": true,
    "content": false
  }
}
```

For `history`:

```json
{
  "tests": [
    {
      "app_id": "6991c75b024cb89cdc04efd2",
      "uid": "1",
      "did": "device_123",
      "tid": "ct_lk2x9a1_f3k9zq",
      "status": "armed",
      "armed": {
        "ts": 1682328445330,
        "by": "6991c75b024cb89cdc04efd1",
        "by_name": "Jane Doe",
        "exp": 1682332045330
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `flag` | Object or Null | The armed test of the user: `id`, `ts` (armed time), `exp` (expiry time) and `by` (member who armed it). `null` when no test is armed or it has expired. (`status` only.) |
| `runs` | Array | The 5 most recent test runs of the user, newest first. (`status` only.) |
| `plugins` | Object | Whether each of `remote-config`, `ab-testing`, `surveys`, `star-rating` and `content` is enabled. (`status` only.) |
| `tests` | Array | Test runs of the app, newest first. (`history` only.) |

Each run contains `app_id`, `uid`, `did`, `tid` (test ID), `status` and `armed` (`ts`, `by`, `by_name`, `exp`), and may contain further fields recorded for the run.

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

- `status` returns an error when the user is not found.
- `history` does not need `uid` or `device_id`.

## Related Endpoints

- [SDK - Connection Test Arm/Disarm](i-sdk-test.md)
