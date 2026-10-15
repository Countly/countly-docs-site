---
sidebar_label: "Device Trace Read"
keywords:
  - "/o/apm/device"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Device Trace Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/device
```

## Overview

Returns the aggregated and over-time metrics of one device trace.

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

### Read a device trace

```text
/o/apm/device?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  period=30days
```

## Response

### Success Response

```json
{
  "trace": "for_loop",
  "aggregate": {
    "name": "for_loop",
    "id": "739782df7973fc5ccb5cbecf32566ca0:116623a584addc571e16efe886546393",
    "data": {
      "duration": [2000, 2000, 2000]
    }
  },
  "overTime": {
    "name": "for_loop",
    "id": "739782df7973fc5ccb5cbecf32566ca0:116623a584addc571e16efe886546393",
    "data": {
      "duration": {
        "2022.4.7": [2000, 2000, 2000]
      }
    }
  },
  "metrices": {
    "duration": true
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
