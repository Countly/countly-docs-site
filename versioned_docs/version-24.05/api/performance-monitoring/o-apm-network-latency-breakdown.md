---
sidebar_label: "Network Latency Breakdown"
keywords:
  - "/o/apm/network-latency-breakdown"
  - "network latency"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - Network Latency Breakdown

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/network-latency-breakdown
```

## Overview

Returns the response time of network requests per country, together with how many requests fall into each latency group.

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
| `period` | String | No | Period of the data, for example `30days` or a date range. Defaults to `30days`. |

## Examples

### Example: Read the network latency breakdown

```bash
curl "https://your-server.com/o/apm/network-latency-breakdown?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&period=30days"
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
| `cc` | String | Country code, or `Unknown` when the country is not known. |
| `data.response_time` | Number | Median response time for the country. |
| `breakdown.below` | Number | Number of requests in the fastest latency group (below 2 seconds). |
| `breakdown.between` | Number | Number of requests in the middle group (2 seconds up to 6 seconds). |
| `breakdown.above` | Number | Number of requests in the slowest group (6 seconds or more). |

## Behavior

- Only network traces are included.

## Related Endpoints

- [Performance Monitoring - Overview](o-apm-overview.md)
- [Performance Monitoring - Network Trace](o-apm-network.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apm` | Trace data | Reads the response times stored per country. |

</details>
