---
sidebar_label: "Edit"
keywords:
  - "/i/apm/edit"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-07"
---

# Performance Monitoring - Edit

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/apm/edit
```

## Overview

Sets the issue threshold, in seconds, of a network or device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of traces by the Performance Monitoring read endpoints (for example `/o/apm/network`, `/o/apm/device` and `/o/apm/issues`). |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `threshold` | Number | Yes | New threshold in seconds. Must be a number greater than or equal to `0`; use a whole number of seconds. Trace samples slower than the threshold are reported as issues. New traces start with a threshold of `2`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Set a threshold for a network trace

```text
/i/apm/edit?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  type=network&
  id=TRACE_ID&
  threshold=3
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
| `result` | String | Result message. |

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

## Behavior

- Updates the `threshold` stored for the trace identified by `id` and `type`.
- Writes an `apm_edited` system log entry with the trace settings before the change and the update.

## Related Endpoints

- [Performance Monitoring - Change Status](i-apm-change-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace properties | Sets `threshold` on the trace property document `<app_id>_<type>_<name>_props`. |

</details>
