---
sidebar_label: "Edit Trace Threshold"
keywords:
  - "/i/apm/edit"
  - "apm"
  - "performance-monitoring"
last_update:
  date: "2026-10-01"
---

# Performance Monitoring - Edit Trace Threshold

<!-- REVIEW: the code does not say whether Performance Monitoring is an Enterprise-only feature. The note below follows the other feature folders; confirm it applies. -->
:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/apm/edit
```

## Overview

Sets the issue threshold of a network or device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Update (`performance_monitoring` feature)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application ID |
| `id` | String | Yes | Trace ID as returned by the Performance Monitoring read endpoints |
| `type` | String | Yes | Trace type: `network` or `device` |
| `threshold` | Number | Yes | New threshold value; must be a number greater than or equal to `0` |

## Examples

### Example 1: Set a network trace threshold

```bash
curl "https://your-server.com/i/apm/edit" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "id=TRACE_ID" \
  -d "type=network" \
  -d "threshold=500"
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
| `result` | String | Result message |

### Error Responses

- **HTTP 400** - Invalid trace type:
```json
{
  "result": "Unacceptable trace type"
}
```
- **HTTP 400** - Missing or undecodable trace ID:
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

## Behavior

- Decodes `id` to the trace name and updates the trace properties record for the app and trace type.
- Sets only the `threshold` field.
- Records an `apm_edited` system log entry with the values before and after the change.
<!-- REVIEW: when no matching trace record exists, the code reads the update result without checking it for null; the resulting response for an unknown trace is unclear. -->

## Related Endpoints

- [Performance Monitoring - Change Trace Status](change-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace properties | Updates `threshold` on the `{app_id}_{type}_{name}_props` document. |

</details>
