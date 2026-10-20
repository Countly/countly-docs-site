---
sidebar_label: "Overview"
keywords:
  - "/o/apm/overview"
  - "overview"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - Overview

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/overview
```

## Overview

Returns the overview of the performance monitoring data of an app: all network traces, the device traces grouped by kind, the success rate of network requests, network latency per country and the slowest traces.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Performance Monitoring feature (`performance_monitoring`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app. |
| `app_type` | String | Yes | Type of the app, `web` or `mobile`. It decides which device metrics and device trace groups are returned. |
| `period` | String | No | Period of the data, for example `30days` or a date range. Defaults to `30days`. |
| `bucket` | String | No | Set to `hourly` to get the success rate per hour instead of per day. |

## Examples

### Example: Read the overview of a mobile app

```bash
curl "https://your-server.com/o/apm/overview?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&app_type=mobile&period=30days"
```

## Response

### Success Response

```json
{
  "network_traces": [
    {
      "name": "example.com/demo/",
      "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
      "data": {
        "response_code": 100,
        "response_time": 106
      }
    }
  ],
  "device_traces": {
    "duration_traces": [
      {
        "name": "for_loop",
        "id": "8a56755548e35d0ebf6a9f096b7e80fd:8a7d36e9b147ac059df9e524f6273bf1",
        "data": {
          "duration": 2000
        }
      }
    ]
  },
  "overview": {
    "success_rate": {
      "metric": "response_code",
      "data": {
        "response_code": {
          "2022.4.7": 100
        }
      }
    },
    "network_latency": [
      {
        "cc": "TR",
        "data": {
          "response_time": 375
        },
        "breakdown": {
          "below": 3,
          "between": 0,
          "above": 0
        }
      }
    ],
    "slow_networks": [
      {
        "name": "example.com/demo/",
        "id": "51dc02d105e5aaa1d576cbd9f2225726:0650152841ea0d08dd73b937a3987328c4f3a1675b2ba71137208da4fcacee51",
        "data": {
          "response_code": 100,
          "response_time": 106
        }
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `network_traces` | Array | All network traces with their `response_time` and `response_code`, slowest first. |
| `device_traces` | Object | Device traces grouped by kind, for example `duration_traces`. Mobile apps also get `screen_traces`; web apps get `page_load_traces` instead. |
| `overview.success_rate` | Object | Share of successful network responses over time. |
| `overview.network_latency` | Array | Response time per country code (`cc`), with a `breakdown` of the number of samples that are `below`, `between` or `above` the latency groups. |
| `overview.slow_networks` | Array | The first five entries of `network_traces`. |
| `overview.slow_screens` | Array | Mobile apps only: the first five screen traces. |
| `overview.app_start` | Object | Mobile apps only: the `app_start` trace. |

### Error Responses

- **HTTP 400** - `app_type` is missing:
```json
{
  "result": "App type not provided"
}
```

## Behavior

- Network traces are read for `response_time` and `response_code`.
- Device traces are read for `duration`, `slow_rendering_frames` and `frozen_frames`; for `web` apps they are read for `duration`, `first_paint` and `first_contentful_paint`.
- For `web` apps the response has no `screen_traces`. For `mobile` apps it has no `page_load_traces`.

## Related Endpoints

- [Performance Monitoring - Network Latency Breakdown](o-apm-network-latency-breakdown.md)
- [Performance Monitoring - Network Trace](o-apm-network.md)
- [Performance Monitoring - Device Trace](o-apm-device.md)
- [Performance Monitoring - Issues](o-apm-issues.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace data | Reads aggregated network and device trace data. |

</details>
