---
sidebar_label: "Metric Data"
keywords:
  - "/o/apm/metric"
  - "metric"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - Metric Data

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/metric
```

## Overview

Returns the aggregated and over-time data of one metric of a network or device trace, optionally filtered by a user query and with a breakdown by user attributes.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Performance Monitoring feature (`performance_monitoring`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app the trace belongs to. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of the traces listed by the Performance Monitoring read endpoints. |
| `type` | String | Yes | Trace type, `network` or `device`. |
| `metric` | String | Yes | Name of the metric, for example `response_time` or `duration`. |
| `period` | String | Yes | Period of the data: `month`, `day`, `yesterday`, `hour`, `NUMBERdays` (for example `30days`) or a custom range as a JSON array. |
| `bucket` | String | No | `daily` (default) or `hourly`. |
| `attributes` | String | No | Set to `true` to also return the data broken down by user attributes. |
| `query` | String (JSON) | No | Filter on the samples, as a JSON user query. |

## Examples

### Example: Read a metric of a network trace

```bash
curl "https://your-server.com/o/apm/metric?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&id=TRACE_ID&type=network&metric=response_code&period=30days&attributes=true"
```

## Response

### Success Response

```json
{
  "aggregate": {
    "name": "example.com/demo/",
    "id": "9d232097a7b4ca58a6a70b6199a37239:5db26f32df77f701429269d7c11dfac61cc8fd1f0fa44d7bb7f70d462d2af0da",
    "data": {
      "response_code": 100
    }
  },
  "overTime": {
    "name": "example.com/demo/",
    "id": "33f58230c12602b45f3d62afd7f69cee:1fee05c8058f5b75534ca43cf0c372ae8f6f1eeabc145c4a43ee9d22c3a924b9",
    "data": {
      "response_code": {
        "2022.4.7": 100
      }
    }
  },
  "trace": "example.com/demo/",
  "attributes": {
    "up.d": {
      "Unknown": {
        "c": 16,
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
| `aggregate` | Object | Aggregated data of the metric for the whole period. |
| `overTime` | Object | Data of the metric over time. |
| `attributes` | Object | Only with `attributes=true` and when sample-level data is stored for the app. Keyed by user attribute (`up.d`, `up.cty`, `up.rgn`, `up.cc`, `up.p`, `up.pv`, `up.av`, `up.c`, `up.brw`, `up.brwv`), then by attribute value. Each value has `c` (number of samples), `v` (value of the metric) and `t` (total samples). |

### Error Responses

- **HTTP 400** - Invalid request:
```json
{
  "result": "Unacceptable trace type."
}
```

Other messages for HTTP 400: `Trace id not provided.`, `Metric not provided.`, `Missing request parameter: period`, `Bad request parameter: period`, `Metric data could not be fetched.`. A `query` that cannot be parsed is also rejected with HTTP 400.

## Behavior

- Without sample-level data stored for the app, the endpoint reads the aggregated trace data and `query` and `attributes` have no effect.

## Related Endpoints

- [Performance Monitoring - Samples](o-apm-samples.md)
- [Performance Monitoring - Network Trace](o-apm-network.md)
- [Performance Monitoring - Device Trace](o-apm-device.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Aggregated trace data | Reads aggregated trace data. |
| Drill events collection of the trace type | Samples | Reads the samples of the trace in the period. |

</details>
