---
sidebar_label: "SDK Logs Read"
keywords:
  - "/o?method=sdk_logs"
  - "sdk_logs"
  - "logs"
last_update:
  date: "2026-10-16"
---

# SDK - SDK Logs Read

## Endpoint

```plaintext
/o?method=sdk_logs
```

## Overview

Returns the SDK logs gathered for one app user during the current capture, newest batch first, together with the capture state and line counts per log level. Start a capture with [SDK - SDK Logs Start](i-sdk-logs-start.md).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `sdk_logs`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |
| `uid` | String | Yes | Countly internal user ID. |
| `limit` | Integer | No | Batches per page. Values are limited to 1-200; defaults to `50`. |
| `skip` | Integer | No | Batches to skip. Defaults to `0`. |

## Examples

### Read the first 50 log batches of a user

```plaintext
/o?method=sdk_logs&api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=1
```

### Read the next page

```plaintext
/o?method=sdk_logs&api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=1&limit=50&skip=50
```

## Response

### Success Response

```json
{
  "state": {
    "s": 1,
    "i": "a1b2",
    "l": "ewidv",
    "b": 100,
    "st": 1682328445330,
    "by": "admin",
    "n": 12
  },
  "batches": [],
  "total": 1,
  "lines": 12,
  "counts": {
    "e": 1,
    "w": 2,
    "i": 9,
    "d": 0,
    "v": 0
  }
}
```

When the user has no capture, `state` is `null`, `batches` is empty and all counts are `0`.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `state` | Object | Gathering state saved on the user, or `null`. Fields are the same as in [SDK - SDK Logs Start](i-sdk-logs-start.md). |
| `batches` | Array | Log batches of the current capture, newest first. |
| `total` | Number | Number of batches in the capture. |
| `lines` | Number | Number of log lines in the capture. |
| `counts` | Object | Log lines per level: `e` (error), `w` (warning), `i` (info), `d` (debug), `v` (verbose). |

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
  "result": "Error fetching SDK logs"
}
```

## Behavior

- Reads the capture state from the app user, then the batches that belong to that capture.
- `limit` and `skip` page through batches only; `total`, `lines` and `counts` cover the whole capture.

## Related Endpoints

- [SDK - SDK Logs Start](i-sdk-logs-start.md)
- [SDK - SDK Logs Stop](i-sdk-logs-stop.md)
- [SDK - SDK Logs Delete](i-sdk-logs-delete.md)
