---
sidebar_label: "Metrics Read"
keywords:
  - "/o/heatmaps/metrics"
  - "heatmaps"
  - "metrics"
last_update:
  date: "2026-10-23"
---

# Heatmaps - Metrics Read

## Endpoint

```plaintext
/o/heatmaps/metrics
```

## Overview

Returns the total number of clicks (`t`) and the total scrolling value (`scr`) recorded by heatmaps in an app for a period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `heatmaps` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |
| `period` | String | No | Period to read, for example `30days`, `7days` or a JSON array of two timestamps. Defaults to `30days`. |
| `segment` | String | No | View segment name. Defaults to no segment. |
| `segmentVal` | String | No | Value of the view segment. |

## Examples

### Read the metrics of an app

```plaintext
/o/heatmaps/metrics?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days
```

## Response

### Success Response

```json
{
  "_id": null,
  "t": 120,
  "scr": 45
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | Null | Always `null`. |
| `t` | Number | Sum of the `t` values for the period. |
| `scr` | Number | Sum of the `scr` values for the period. |

## Behavior

- When there is no data for the period, `t` and `scr` are `0`.
