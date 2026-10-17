---
sidebar_label: "Metrics"
keywords:
  - "/o/heatmaps/metrics"
  - "metrics"
  - "heatmaps"
last_update:
  date: "2026-10-17"
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

Returns the totals of the view count and scroll value over all views of an app in the period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Heatmaps feature (`heatmaps`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app. |
| `period` | String | No | Period of the data, for example `30days` or a date range. |
| `segment` | String | No | View segment to read the data for. |
| `segmentVal` | String | No | Value of `segment`. |

## Examples

### Example: Read the totals

```bash
curl "https://your-server.com/o/heatmaps/metrics?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&period=30days"
```

## Response

### Success Response

```json
{
  "_id": null,
  "t": 1200,
  "scr": 550
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | Null | Always `null`. |
| `t` | Number | Total view count. |
| `scr` | Number | Total scroll value. |

## Behavior

- When there is no data in the period, `t` and `scr` are `0`.

## Related Endpoints

- [Heatmaps - Views](o-heatmaps-views.md)
- [Heatmaps - Domains](o-heatmaps-domains.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_viewdata{sha1(segment+appId)}` | Aggregated view metrics | Sums the view counts and scroll values. |

</details>
