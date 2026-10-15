---
sidebar_label: "Network Latency Breakdown Read"
keywords:
  - "/o/apm/network-latency-breakdown"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Network Latency Breakdown Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/network-latency-breakdown
```

## Overview

Returns the response time of network requests by country, with the number of requests that were fast, medium and slow.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `period` | String or Array | No | Period of the data. Defaults to `30days`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the latency breakdown of the last 30 days

```text
/o/apm/network-latency-breakdown?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  period=30days
```

## Response

### Success Response

```json
[
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
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `cc` | String | Country code, or `Unknown`. |
| `data.response_time` | Number | Median response time, in milliseconds. |
| `breakdown.below` | Number | Number of requests faster than 2 seconds. |
| `breakdown.between` | Number | Number of requests between 2 and 6 seconds. |
| `breakdown.above` | Number | Number of requests of 6 seconds or more. |

## Related Endpoints

- [Performance Monitoring - Overview Read](o-apm-overview.md)
