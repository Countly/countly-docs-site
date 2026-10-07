---
sidebar_label: "Change Status"
keywords:
  - "/i/apm/change-status"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-07"
---

# Performance Monitoring - Change Status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

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
| `id` | String | Yes | Encrypted trace ID, as returned in the `id` field of the trace lists in `/o/apm` responses. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `status` | String | Yes | `open` or `mute`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Mute a device trace

```text
/i/apm/change-status?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  type=device&
  id=TRACE_ID&
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
  "result": "Valid status not provided"
}
```

- `400`

```json
{
  "result": "Issue not updated"
}
```

<!-- REVIEW: an unknown trace id is not rejected explicitly in the code; confirm the response with the developers -->

## Behavior

- Decrypts `id` to the trace name and updates the trace property document `<app_id>_<type>_<name>_props`, setting `status`.
- Writes an `apm_edited` system log entry with the document before the change and the update.

## Related Endpoints

- [Performance Monitoring - Edit](i-apm-edit.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace properties | Sets `status` on the trace property document. |

</details>
