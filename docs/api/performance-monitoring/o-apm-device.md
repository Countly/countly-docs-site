---
sidebar_label: "Read Device Trace"
keywords:
  - "/o/apm/device"
  - "device"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Device Trace

## Endpoint

```text
/o/apm/device
```

## Overview

Returns the aggregate data, data over time and metrics of one device trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `id` | String | Yes | Trace ID, as returned by [Performance Monitoring - Read Overview](o-apm-overview.md). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read a device trace

```text
/o/apm/device?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=TRACE_ID
```

## Response

### Success Response

```json
{
  "aggregate": {
    "for_loop": {
      "name": "for_loop",
      "id": "TRACE_ID",
      "data": {
        "duration": [2000, 2000],
        "bytes": [20, 20]
      }
    }
  },
  "overTime": {
    "for_loop": {
      "name": "for_loop",
      "id": "TRACE_ID",
      "data": {
        "duration": {
          "2022.4.7": [2000, 2000]
        },
        "bytes": {
          "2022.4.7": [20, 20]
        }
      }
    }
  },
  "metrices": {
    "bytes": true,
    "duration": true
  },
  "trace": "for_loop"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `trace` | String | Name of the trace. |
| `aggregate` | Object | Aggregate data of the trace. |
| `overTime` | Object | Data of the trace over time. |
| `metrices` | Object | All metrics of the trace. |

### Error Responses

- `400`

```json
{
  "result": "Device trace id not provided"
}
```

## Related Endpoints

- [Performance Monitoring - Read Network Trace](o-apm-network.md)
- [Performance Monitoring - Read Metric](o-apm-metric.md)
- [Performance Monitoring - Edit Trace Threshold](i-apm-edit.md)
