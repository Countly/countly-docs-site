---
sidebar_label: "Read Samples"
keywords:
  - "/o/apm/samples"
  - "samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Samples

## Endpoint

```text
/o/apm/samples
```

## Overview

Returns a page of the recorded samples of one metric of a network or device trace.

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
| `iDisplayStart` | Number | No | Number of samples to skip. Defaults to `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Defaults to `10`. |
| `sEcho` | String | No | Value returned unchanged in the response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the first 10 samples of a metric

```text
/o/apm/samples?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID&
  type=network&
  metric=response_time&
  period=30days
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 16,
  "iTotalDisplayRecords": 16,
  "aaData": []
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Value of the `sEcho` request parameter. |
| `iTotalRecords` | Number | Total number of samples. |
| `iTotalDisplayRecords` | Number | Total number of samples. |
| `aaData` | Array | Samples of the requested page. |

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
  "result": "Samples data could not be fetched."
}
```

## Related Endpoints

- [Performance Monitoring - Read Metric](o-apm-metric.md)
- [Performance Monitoring - Read User Samples](o-apm-user-samples.md)
