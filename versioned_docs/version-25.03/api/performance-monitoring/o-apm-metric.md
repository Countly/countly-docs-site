---
sidebar_label: "Metric Read"
keywords:
  - "/o/apm/metric"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Metric Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/metric
```

## Overview

Returns the aggregated and over-time values of one metric of a trace. The data can be filtered with a query and, on request, split by user attributes.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of traces by [Overview Read](o-apm-overview.md). |
| `metric` | String | Yes | Name of the metric, for example `response_time` or `duration`. |
| `period` | String or Array | Yes | `month`, `day`, `yesterday`, `hour`, `<number>days` (for example `30days`), or a custom range as a JSON array. |
| `query` | JSON String (Object) | No | Filter on the samples, in the same format as the Drill `queryObject`. |
| `bucket` | String | No | `hourly`, or `daily` (default). Sets the granularity of `overTime`. |
| `attributes` | String | No | `true` also returns the data split by user attributes. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the response time of a network trace

```text
/o/apm/metric?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  type=network&
  id=TRACE_ID&
  metric=response_time&
  period=30days
```

## Response

### Success Response

```json
{
  "trace": "example.com/api/items",
  "aggregate": {},
  "overTime": {},
  "attributes": {}
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `trace` | String | Name of the trace. |
| `aggregate` | Object | Aggregated value of the metric over the period, with `name`, `id` and `data`. Empty if there is no data. |
| `overTime` | Object | Values of the metric per day (or per hour), with `name`, `id` and `data`. Empty if there is no data. |
| `attributes` | Object | Values of the metric split by user attribute. Only present when `attributes` is `true` and the server has Drill. |

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

- [Performance Monitoring - Samples Read](o-apm-samples.md)
- [Performance Monitoring - Overview Read](o-apm-overview.md)
