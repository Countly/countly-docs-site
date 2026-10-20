---
sidebar_label: "Views"
keywords:
  - "/o/heatmaps/views"
  - "heatmaps"
  - "views"
last_update:
  date: "2026-10-16"
---

# Heatmaps - Views

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/heatmaps/views
```

## Overview

Returns the views of an app that were visited at least once in the selected period, with their visit count and scroll value. The output is a table: it can be paged, sorted and searched.

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
| `iDisplayStart` | Number | No | Index of the first row to return. |
| `iDisplayLength` | Number | No | Number of rows to return. `-1` or missing returns all rows. |
| `iSortCol_0` | Number | No | Column to sort by: `0` name, `1` scroll (`scr`), `2` visits (`t`). Without it, rows are sorted by visits, highest first. |
| `sSortDir_0` | String | No | Sort direction, `asc` or `desc`. Used together with `iSortCol_0`. |
| `sSearch` | String | No | Case-insensitive text filter on the view name. |
| `sEcho` | String | No | Value returned unchanged as `sEcho`. |

## Examples

### Read the most visited views

```text
/o/heatmaps/views?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days&iDisplayStart=0&iDisplayLength=10
```

### Search views by name

```text
/o/heatmaps/views?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days&sSearch=home
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 2,
  "iTotalDisplayRecords": 2,
  "aaData": [
    {
      "_id": "65f0cbf8bca6b8e8fbf7f901",
      "view": "/home",
      "url": "https://example.com/home",
      "display": "Home",
      "t": 1520,
      "scr": 62
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value from the request. |
| `iTotalRecords` | Number | Total number of matching views. |
| `iTotalDisplayRecords` | Number | Same as `iTotalRecords`. |
| `aaData` | Array | One entry per view. |
| `aaData[].view` | String | View name. |
| `aaData[].url` | String | View URL, when known. |
| `aaData[].display` | String | Display name, when set. |
| `aaData[].t` | Number | Total visits in the period. |
| `aaData[].scr` | Number | Scroll value for the period. |

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

- Only views with at least one visit in the period are returned.
- Read-only. Nothing is modified.

## Related Endpoints

- [Heatmaps - Domains](o-heatmaps-domains.md)
- [Heatmaps - Metrics](o-heatmaps-metrics.md)
- [Views - Actions/Heatmap Read](../views/o-actions.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.app_viewdata{sha1(segment+appId)}` | View metrics | Reads aggregated visit and scroll values. |
| `countly.app_viewsmeta{appId}` | View names | Reads view names, display names and URLs. |

</details>
