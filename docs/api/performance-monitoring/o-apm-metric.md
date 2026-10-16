---
sidebar_label: "Read Metric"
keywords:
  - "/o/apm/metric"
  - "metric"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Metric

## Endpoint

```text
/o/apm/metric
```

## Overview

Returns the aggregate data and the data over time of one metric of a network or device trace. It can also return the attributes of the trace, such as the device and city of the users.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Trace ID, as returned by [Performance Monitoring - Read Overview](o-apm-overview.md). |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `metric` | String | Yes | Metric name, for example `response_time` or `duration`. |
| `period` | String or Array | Yes | Period value: `month`, `day`, `yesterday`, `hour`, `{number}days` such as `30days`, or a date range array. |
| `query` | JSON String (Object) | No | Filter object applied to the data. |
| `bucket` | String | No | Time bucket. Defaults to `daily`. |
| `attributes` | Boolean | No | Set to `true` to also return attribute data. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read a metric for 30 days

```text
/o/apm/metric?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  type=network&
  metric=response_code&
  period=30days
```

### Read a metric with attributes

```text
/o/apm/metric?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  type=network&
  metric=response_code&
  period=30days&
  attributes=true
```

## Response

### Success Response

```json
{
  "aggregate": {
    "name": "example.com/demo/",
    "id": "TRACE_ID",
    "data": {
      "response_code": 100
    }
  },
  "overTime": {
    "name": "example.com/demo/",
    "id": "TRACE_ID",
    "data": {
      "response_code": {
        "2022.4.7": 100
      }
    }
  },
  "trace": "example.com/demo/",
  "attributes": {
    "up.cty": {
      "Ankara": {
        "c": 3,
        "v": 100,
        "t": 16
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `trace` | String | Name of the trace. |
| `aggregate` | Object | Aggregate data of the metric. |
| `overTime` | Object | Data of the metric over time. |
| `attributes` | Object | Attribute data. Only returned when `attributes=true`. |

### Error Responses

- `400`

```json
{
  "result": "Unacceptable trace type."
}
```

- `400`

```json
{
  "result": "Trace id not provided."
}
```

- `400`

```json
{
  "result": "Metric not provided."
}
```

- `400`

```json
{
  "result": "Missing request parameter: period"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

- `400`

```json
{
  "result": "Metric data could not be fetched."
}
```

## Related Endpoints

- [Performance Monitoring - Read Samples](o-apm-samples.md)
- [Performance Monitoring - Read Network Trace](o-apm-network.md)
- [Performance Monitoring - Read Device Trace](o-apm-device.md)
