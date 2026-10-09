---
sidebar_label: "SDK Logs Start"
keywords:
  - "/i/sdk_logs/start"
  - "start"
  - "sdk_logs"
last_update:
  date: "2026-10-09"
---

# SDK - SDK Logs Start

## Endpoint

```plaintext
/i/sdk_logs/start
```

## Overview

Starts SDK log gathering for one app user. The next SDK config request of that user carries the directive that switches log gathering on. Logs gathered by an earlier capture for the same user are cleared.

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
| `levels` | String | No | Log levels to capture, any of the letters `e` (error), `w` (warning), `i` (info), `d` (debug), `v` (verbose). Defaults to all levels. |
| `batch_size` | Integer | No | Lines per upload. Values are limited to 10-500; defaults to `100`. |

## Examples

### Start gathering error and warning logs

```plaintext
/i/sdk_logs/start?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=1&levels=ew&batch_size=50
```

## Response

### Success Response

```json
{
  "result": "Success",
  "state": {
    "s": 1,
    "i": "a1b2",
    "l": "ewidv",
    "b": 100,
    "st": 1682328445330,
    "by": "admin",
    "n": 0
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when gathering is started. |
| `state` | Object | Gathering state saved on the user. |
| `state.s` | Number | `1` while gathering is on. |
| `state.i` | String | Capture ID. |
| `state.l` | String | Log levels captured. |
| `state.b` | Number | Lines per upload. |
| `state.st` | Number | Start time in milliseconds. |
| `state.by` | String | Username of the member who started the capture. |
| `state.n` | Number | Lines gathered so far. |

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
  "result": "No such app user"
}
```

- `500`

```json
{
  "result": "Error starting SDK log gathering"
}
```

## Behavior

- Saves the gathering state on the app user.
- Deletes log batches stored for the user by an earlier capture.

### Impact on Other Data

- Updates the user's document in `countly.app_users{appId}`.
- Deletes older batches of the user from `countly.sdk_logs{appId}`.

## Related Endpoints

- [SDK - SDK Logs Stop](i-sdk-logs-stop.md)
- [SDK - SDK Logs Delete](i-sdk-logs-delete.md)
