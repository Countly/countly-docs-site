---
sidebar_label: "Network Trace"
keywords:
  - "/o/apm/network"
  - "network"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - Network Trace

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/network
```

## Overview

Returns the aggregated and over-time data of one network trace (the requests the SDK made to one URL).

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
| `period` | String | No | Period of the data, for example `30days` or a date range. Defaults to `30days`. |
| `bucket` | String | No | Set to `hourly` to get the over-time data per hour instead of per day. |

## Examples

### Example: Read a network trace

```bash
curl "https://your-server.com/o/apm/network?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&id=TRACE_ID&period=30days"
```

## Response

### Success Response

```json
{
  "aggregate": {
    "example.com/demo/": {
      "name": "example.com/demo/",
      "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
      "data": {
        "response_code": 100
      }
    }
  },
  "overTime": {
    "example.com/demo/": {
      "name": "example.com/demo/",
      "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
      "data": {
        "response_code": {
          "2022.4.7": 100
        }
      }
    }
  },
  "metrices": {
    "response_code": true,
    "response_payload_size": true,
    "response_time": true
  },
  "trace": "example.com/demo/"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `trace` | String | Name of the trace. |
| `aggregate` | Object | Aggregated data of the trace for the whole period, keyed by trace name. |
| `overTime` | Object | Data of the trace over time, keyed by trace name, then by metric and date. |
| `metrices` | Object | Metrics reported for the trace. |

### Error Responses

- **HTTP 400** - Missing or invalid trace ID:
```json
{
  "result": "Device trace id not provided"
}
```

## Behavior

- Decodes `id` to the trace name and reads the stored data of that network trace for the period.
- When the trace has no data in the period, `aggregate` and `overTime` contain empty objects.

## Related Endpoints

- [Performance Monitoring - Overview](o-apm-overview.md)
- [Performance Monitoring - Metric Data](o-apm-metric.md)
- [Performance Monitoring - Device Trace](o-apm-device.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace data and properties | Reads aggregated trace data and trace properties. |

</details>
