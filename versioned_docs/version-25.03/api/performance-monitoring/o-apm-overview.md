---
sidebar_label: "Overview Read"
keywords:
  - "/o/apm/overview"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Overview Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/overview
```

## Overview

Returns the performance overview of an app: all network and device traces with their aggregated metrics, the success rate of network requests, and the network latency by country.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `app_type` | String | Yes | Type of the app: `web` or `mobile`. |
| `period` | String or Array | No | Period of the data. Defaults to `30days`. |
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
  "network_traces": [],
  "device_traces": {},
  "overview": {
    "success_rate": {},
    "network_latency": [],
    "slow_networks": [],
    "slow_screens": [],
    "app_start": {}
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `network_traces` | Array | All network traces with their aggregated metrics (`response_time`, `response_code`). Each trace has `name`, `id` and `data`. |
| `device_traces` | Object | Device traces, grouped by kind. For `web` apps the duration, first paint and first contentful paint are aggregated; for `mobile` apps the duration, slow rendering frames and frozen frames. |
| `overview.success_rate` | Object | Success rate of network requests. |
| `overview.network_latency` | Array | Network latency by country, in the format of [Network Latency Breakdown Read](o-apm-network-latency-breakdown.md). |
| `overview.slow_networks` | Array | The first five entries of `network_traces`. |
| `overview.slow_screens` | Array | The first five slow-rendering screens. Only for `mobile` apps. |
| `overview.app_start` | Object | App start trace. Only for `mobile` apps. |

### Error Responses

- `400`

```json
{
  "result": "App type not provided"
}
```

## Behavior

- The trace `id` values can be used in the other Performance Monitoring read endpoints.

## Related Endpoints

- [Performance Monitoring - Network Trace Read](o-apm-network.md)
- [Performance Monitoring - Device Trace Read](o-apm-device.md)
- [Performance Monitoring - Issues Read](o-apm-issues.md)
