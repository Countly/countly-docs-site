---
sidebar_label: "Read Overview"
keywords:
  - "/o/apm/overview"
  - "overview"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Overview

## Endpoint

```text
/o/apm/overview
```

## Overview

Returns the network and device traces of an app together with overview data: network success rate, network latency by country, and the slowest networks. Mobile apps also get the slowest screens and app start trace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `app_type` | String | Yes | Application type: `web` or `mobile`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the overview of a mobile app

```text
/o/apm/overview?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  app_type=mobile
```

## Response

### Success Response

```json
{
  "network_traces": [
    {
      "name": "example.com/demo/",
      "id": "TRACE_ID",
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
        "id": "TRACE_ID",
        "data": {
          "duration": 2000
        }
      }
    ],
    "page_load_traces": []
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
    "slow_networks": []
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `network_traces` | Array | Network traces, slowest response time first. |
| `device_traces` | Object | Device traces grouped by kind. Web apps do not get `screen_traces`; mobile apps do not get `page_load_traces`. |
| `overview.success_rate` | Object | Network success rate over time. |
| `overview.network_latency` | Array | Response time and breakdown (`below`, `between`, `above`) per country code, as in [Performance Monitoring - Read Network Latency Breakdown](o-apm-network-latency-breakdown.md). |
| `overview.slow_networks` | Array | The first 5 entries of `network_traces`. |
| `overview.slow_screens` | Array | Mobile apps only. The first 5 slow rendering screens. |
| `overview.app_start` | Object | Mobile apps only. App start trace. |

### Error Responses

- `400`

```json
{
  "result": "App type not provided"
}
```

## Behavior

- Network traces use the metrics `response_time` and `response_code`.
- Device traces use `duration`, `slow_rendering_frames` and `frozen_frames`; for `web` apps they use `duration`, `first_paint` and `first_contentful_paint`.

## Related Endpoints

- [Performance Monitoring - Read Network Latency Breakdown](o-apm-network-latency-breakdown.md)
- [Performance Monitoring - Read Issues](o-apm-issues.md)
