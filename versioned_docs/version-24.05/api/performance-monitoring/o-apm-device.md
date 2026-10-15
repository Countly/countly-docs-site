---
sidebar_label: "Device Trace"
keywords:
  - "/o/apm/device"
  - "device"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-09"
---

# Performance Monitoring - Device Trace

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/device
```

## Overview

Returns the aggregated and over-time data of one device trace (a custom trace reported by the SDK, such as the duration of an operation).

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

### Example: Read a device trace

```bash
curl "https://your-server.com/o/apm/device?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&id=TRACE_ID&period=30days"
```

## Response

### Success Response

```json
{
  "aggregate": {
    "for_loop": {
      "name": "for_loop",
      "id": "b3009e035c1d06c8b2b74fb972ba7039:341bbf3f86d4f815827202b8b35a7462",
      "data": {
        "duration": [2000, 2000, 2000]
      }
    }
  },
  "overTime": {
    "for_loop": {
      "name": "for_loop",
      "id": "b3009e035c1d06c8b2b74fb972ba7039:341bbf3f86d4f815827202b8b35a7462",
      "data": {
        "duration": {
          "2022.4.7": [2000, 2000, 2000]
        }
      }
    }
  },
  "metrices": {
    "duration": true
  },
  "trace": "for_loop"
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

- Decodes `id` to the trace name and reads the stored data of that device trace for the period.
- When the trace has no data in the period, `aggregate` and `overTime` contain empty objects.

## Related Endpoints

- [Performance Monitoring - Issues](o-apm-issues.md)
- [Performance Monitoring - Edit](i-apm-edit.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace data and properties | Reads aggregated trace data and trace properties. |

</details>
