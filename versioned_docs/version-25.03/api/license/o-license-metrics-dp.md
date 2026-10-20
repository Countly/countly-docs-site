---
sidebar_label: "Data Point Metrics"
keywords:
  - "/o/license-metrics/dp"
  - "license"
  - "data points"
  - "metrics"
last_update:
  date: "2026-10-16"
---

# License - Data Point Metrics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/license-metrics/dp
```

## Overview

Returns the number of data points (DP) received, summed over all apps, for each month of the selected period. This is the usage measure used by data-point-based licenses.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `drill` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Conditional | Required for users who are not global admins. |
| `period` | String | No | Period to report, for example `30days` or a JSON range `[start,end]` in milliseconds. Defaults to the last 12 months. |

## Examples

### Read data points for the last 12 months

```text
/o/license-metrics/dp?api_key=YOUR_API_KEY
```

### Read data points for a date range

```text
/o/license-metrics/dp?api_key=YOUR_API_KEY&period=[1735689600000,1767225600000]
```

## Response

### Success Response

```json
{
  "2025:1": 4800000,
  "2025:2": 5100000,
  "2025:3": 0
}
```

### Response Fields

The response is an object with one key for each month of the period, in the form `YEAR:MONTH`. The value is the number of data points in that month, summed over all apps. Months with no data are `0`.

### Error Responses

- `500`

```json
{
  "result": "Error in reading license"
}
```

## Behavior

- Read-only for the metric itself.
- Returns an empty object `{}` when the server is a Countly Flex deployment.
- Returns `0` for every month when server statistics are not available.

## Related Endpoints

- [License - MAU Metrics](o-license-metrics-mau.md)
- [License - History](o-license-history.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.plugins` | License | Reads the installed license. |
| `countly.server_stats_data_points` | Data point counts | Reads monthly data point totals. |

</details>
