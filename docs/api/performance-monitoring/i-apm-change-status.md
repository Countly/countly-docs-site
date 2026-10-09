---
sidebar_label: "Change Trace Status"
keywords:
  - "/i/apm/change-status"
  - "change-status"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-09"
---

# Performance Monitoring - Change Trace Status

## Endpoint

```text
/i/apm/change-status
```

## Overview

Mutes or reopens the issue status of a network or device trace.

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
| `status` | String | Yes | New status: `open` or `mute`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Mute a device trace

```text
/i/apm/change-status?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  type=device&
  status=mute
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
  "result": "Valid status not provided"
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

- Updates the `status` of the trace in `countly.apm`.
- Writes an audit event to system logs.

## Related Endpoints

- [Performance Monitoring - Edit Trace Threshold](i-apm-edit.md)
