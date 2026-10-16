---
sidebar_label: "Metrics"
keywords:
  - "/o/heatmaps/metrics"
  - "heatmaps"
  - "metrics"
last_update:
  date: "2026-10-16"
---

# Heatmaps - Metrics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/heatmaps/metrics
```

## Overview

Returns the total visits and the total scroll value of all views of an app in the selected period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `heatmaps` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |
| `period` | String | No | Standard Countly period value, for example `30days`. |
| `segment` | String | No | Segment key to read segmented view data. |
| `segmentVal` | String | No | Segment value for `segment`. |

## Examples

### Read totals for 30 days

```text
/o/heatmaps/metrics?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days
```

## Response

### Success Response

```json
{
  "_id": null,
  "t": 15200,
  "scr": 620
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | Null | Always `null`. |
| `t` | Number | Total visits of all views in the period. |
| `scr` | Number | Total scroll value of all views in the period. |

When there is no data, `t` and `scr` are `0`.

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Read-only. Nothing is modified.

## Related Endpoints

- [Heatmaps - Views](o-heatmaps-views.md)
- [Heatmaps - Domains](o-heatmaps-domains.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.app_viewdata{sha1(segment+appId)}` | View metrics | Sums visit and scroll values. |

</details>
