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

Sets the `threshold` of a network or device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Encrypted trace ID, as returned in the `id` field of the trace lists in `/o/apm` responses. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `threshold` | Number | Yes | New threshold. Must be a number greater than or equal to `0`. |
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

- `400`

```json
{
  "result": "Issue not updated"
}
```

<!-- REVIEW: the code does not say what unit the threshold uses for each trace type, and an unknown trace id is not rejected explicitly; confirm both with the developers -->

## Behavior

- Decrypts `id` to the trace name and updates the trace property document `<app_id>_<type>_<name>_props`, setting `threshold`.
- Writes an `apm_edited` system log entry with the document before the change and the update.

## Related Endpoints

- [Performance Monitoring - Change Status](i-apm-change-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace properties | Sets `threshold` on the trace property document. |

</details>
