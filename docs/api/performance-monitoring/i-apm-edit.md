---
sidebar_label: "Edit Trace Threshold"
keywords:
  - "/i/apm/edit"
  - "edit"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-09"
---

# Performance Monitoring - Edit Trace Threshold

## Endpoint

```text
/i/apm/edit
```

## Overview

Sets the threshold of a network or device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Trace ID, as returned by the Performance Monitoring read endpoints. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `threshold` | Number | Yes | New threshold value. Must be a number greater than or equal to `0`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Set a threshold on a network trace

```text
/i/apm/edit?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  type=network&
  threshold=500
```

## Response

### Success Response

```json
{
  "result": "Issue updated"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Confirmation message. |

### Error Responses

- `400`

```json
{
  "result": "Unacceptable trace type"
}
```

- `400`

```json
{
  "result": "APM id not provided"
}
```

- `400`

```json
{
  "result": "Threshold should be a number greater than equal to 0"
}
```

- `400`

```json
{
  "result": "Issue not updated"
}
```

## Behavior

### Impact on Other Data

- Updates the `threshold` of the trace in `countly.apm`.
- Writes an audit event to system logs.

## Related Endpoints

- [Performance Monitoring - Change Trace Status](i-apm-change-status.md)
