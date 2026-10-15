---
sidebar_label: "Issues"
keywords:
  - "/o/apm/issues"
  - "issues"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-09"
---

# Performance Monitoring - Issues

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/issues
```

## Overview

Lists the network and device traces that have samples slower than their threshold in the period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Performance Monitoring feature (`performance_monitoring`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app. |
| `period` | String | No | Period of the data, for example `30days` or a date range. Defaults to `30days`. |

## Examples

### Example: List issues

```bash
curl "https://your-server.com/o/apm/issues?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&period=30days"
```

## Response

### Success Response

```json
[
  {
    "name": "example.com/demo/",
    "id": "96637f489b1786a3a575ee18096ea1f5:381caa66c42c2218db8e8f1b241f426f0d14e64ba957b536afd8f5b152ee57bd",
    "type": "network",
    "c": 1,
    "th": 2,
    "t": 16,
    "status": "open"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | One entry per trace with slow samples. Empty when there are none. |
| `name` | String | Trace name. |
| `id` | String | Trace ID, for use with the other Performance Monitoring endpoints. |
| `type` | String | `network` or `device`. |
| `c` | Number | Number of samples slower than the threshold. |
| `th` | Number | Threshold of the trace, in seconds. |
| `t` | Number | Total number of samples of the trace in the period. |
| `status` | String | `open` or `mute`. Traces without a stored status are reported as `open`. |

## Behavior

- Network traces are judged on `response_time` and device traces on `duration`.
- The device traces `app_in_background` and `app_in_foreground` are not listed.
- A trace is listed only when at least one sample is slower than its threshold.

## Related Endpoints

- [Performance Monitoring - Device Trace](o-apm-device.md)
- [Performance Monitoring - Edit](i-apm-edit.md)
- [Performance Monitoring - Change Status](i-apm-change-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace data and properties | Reads aggregated trace data and trace thresholds and statuses. |

</details>
