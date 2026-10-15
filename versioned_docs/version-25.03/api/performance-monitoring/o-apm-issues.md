---
sidebar_label: "Issues Read"
keywords:
  - "/o/apm/issues"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Issues Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/issues
```

## Overview

Returns the network and device traces that have samples slower than their issue threshold in the requested period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `period` | String or Array | No | Period of the data. Defaults to `30days`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read issues of the last 30 days

```text
/o/apm/issues?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  period=30days
```

## Response

### Success Response

```json
[
  {
    "name": "example.com/api/items",
    "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
    "type": "network",
    "c": 4,
    "th": 2,
    "t": 120,
    "status": "open"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `name` | String | Name of the trace. |
| `id` | String | Trace ID, for use in the other Performance Monitoring endpoints. |
| `type` | String | Trace type: `network` or `device`. |
| `c` | Number | Number of samples slower than the threshold. |
| `th` | Number | Issue threshold of the trace, in seconds. |
| `t` | Number | Total number of samples of the trace in the period. |
| `status` | String | Issue status of the trace. |

## Behavior

- Network traces are checked by their response time and device traces by their duration.
- The device traces `app_in_background` and `app_in_foreground` are not checked.
- The threshold can be changed with [Performance Monitoring - Edit](i-apm-edit.md) and the status with [Performance Monitoring - Change Status](i-apm-change-status.md).

## Related Endpoints

- [Performance Monitoring - Edit](i-apm-edit.md)
- [Performance Monitoring - Change Status](i-apm-change-status.md)
- [Performance Monitoring - Overview Read](o-apm-overview.md)
