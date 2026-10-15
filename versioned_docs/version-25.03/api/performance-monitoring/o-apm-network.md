---
sidebar_label: "Network Trace Read"
keywords:
  - "/o/apm/network"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Network Trace Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/network
```

## Overview

Returns the aggregated and over-time metrics of one network trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of traces by [Overview Read](o-apm-overview.md). |
| `period` | String or Array | No | Period of the data. Defaults to `30days`. |
| `bucket` | String | No | `hourly` returns the over-time data per hour; otherwise it is returned per day. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read a network trace

```text
/o/apm/network?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  period=30days
```

## Response

### Success Response

```json
{
  "trace": "example.com/api/items",
  "aggregate": {
    "name": "example.com/api/items",
    "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
    "data": {
      "response_time": [106, 106, 106]
    }
  },
  "overTime": {
    "name": "example.com/api/items",
    "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
    "data": {
      "response_time": {
        "2022.4.7": [106, 106, 106]
      }
    }
  },
  "metrices": {
    "response_time": true
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `trace` | String | Name of the trace. |
| `aggregate` | Object | Aggregated metrics of the trace over the period, with `name`, `id` and `data`. Empty if there is no data. |
| `overTime` | Object | Metrics of the trace per day (or per hour), with `name`, `id` and `data`. Empty if there is no data. |
| `metrices` | Object | Metrics recorded for the trace. |

### Error Responses

- `400`

```json
{
  "result": "Device trace id not provided"
}
```

## Related Endpoints

- [Performance Monitoring - Overview Read](o-apm-overview.md)
- [Performance Monitoring - Metric Read](o-apm-metric.md)
- [Performance Monitoring - Edit](i-apm-edit.md)
