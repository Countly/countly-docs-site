---
sidebar_label: "Read Network Latency Breakdown"
keywords:
  - "/o/apm/network-latency-breakdown"
  - "network-latency-breakdown"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Network Latency Breakdown

## Endpoint

```text
/o/apm/network-latency-breakdown
```

## Overview

Returns the network response time per country, with a breakdown of requests into `below`, `between` and `above` groups.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the latency breakdown

```text
/o/apm/network-latency-breakdown?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY
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
| `(root array)` | Array | One entry per country. |
| `cc` | String | Country code, or `Unknown`. |
| `data.response_time` | Number | Response time for the country. |
| `breakdown.below` | Number | Requests in the `below` group. |
| `breakdown.between` | Number | Requests in the `between` group. |
| `breakdown.above` | Number | Requests in the `above` group. |

## Related Endpoints

- [Performance Monitoring - Read Overview](o-apm-overview.md)
- [Performance Monitoring - Read Network Trace](o-apm-network.md)
