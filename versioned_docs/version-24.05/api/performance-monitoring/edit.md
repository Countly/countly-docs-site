---
sidebar_label: "Edit"
keywords:
  - "/i/apm/edit"
  - "edit"
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

Sets the threshold of an existing network or device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Performance Monitoring: `Update` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |
| `id` | String | Yes | Trace ID, as returned by the Performance Monitoring read endpoints |
| `type` | String | Yes | Trace type: `network` or `device` |
| `threshold` | Number | Yes | New threshold value; must be a number greater than or equal to 0 |

<!-- REVIEW: the code does not check that the trace exists or that app_id is valid before updating; confirm the behavior for an unknown trace with the developers -->

## Examples

### Example: Set a threshold

```bash
curl "https://your-server.com/i/apm/edit?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&id=TRACE_ID&type=network&threshold=500"
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
| `result` | String | Operation status |

### Error Responses

- **HTTP 400** - Invalid trace type:
```json
{
  "result": "Unacceptable trace type"
}
```

- **HTTP 400** - Missing or unusable trace ID:
```json
{
  "result": "APM id not provided"
}
```

- **HTTP 400** - Invalid threshold:
```json
{
  "result": "Threshold should be a number greater than equal to 0"
}
```

- **HTTP 400** - Update failed:
```json
{
  "result": "Issue not updated"
}
```

- **HTTP 400** - Missing auth params:
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- **HTTP 401** - Auth/user validation failed:
```json
{
  "result": "User does not exist"
}
```

## Behavior

1. Validates the user's update permission for Performance Monitoring.
2. Checks `type`, decodes `id` and checks `threshold`.
3. Sets `threshold` on the trace's properties document in `countly.apm`.
4. Writes an `apm_edited` system log entry.

## Related Endpoints

- [Performance Monitoring - Change Status](change-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace properties | Sets `threshold` on the trace's properties document. |

</details>
