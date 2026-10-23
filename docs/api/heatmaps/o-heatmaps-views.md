---
sidebar_label: "Views Read"
keywords:
  - "/o/heatmaps/views"
  - "heatmaps"
  - "views"
last_update:
  date: "2026-10-23"
---

# Heatmaps - Views Read

## Endpoint

```plaintext
/o/heatmaps/views
```

## Overview

Returns the views of an app that have at least one recorded click, with their click (`t`) and scrolling (`scr`) values for a period. The response is in the table format used by the dashboard.

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
| `iSortCol_0` | Number | No | Index of the column to sort by: `0` for name, `1` for `scr`, `2` for `t`. Used together with `sSortDir_0`. Without both, rows are sorted by `t` in descending order. |
| `sSortDir_0` | String | No | Sort direction, `asc` or `desc`. |
| `iDisplayStart` | Number | No | Number of rows to skip. |
| `iDisplayLength` | Number | No | Number of rows to return. When not set or `-1`, all rows are returned. |
| `sSearch` | String | No | Case-insensitive search text matched against the view name. |
| `sEcho` | String | No | Value returned unchanged as `sEcho` in the response. |

## Examples

### Read the views of an app

```plaintext
/o/heatmaps/views?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days&iDisplayStart=0&iDisplayLength=10
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 1,
  "iTotalDisplayRecords": 1,
  "aaData": [
    {
      "_id": "6991c75b024cb89cdc04efd3",
      "t": 120,
      "scr": 45,
      "view": "/home",
      "url": "https://example.com/home",
      "display": "/home"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value from the request. |
| `iTotalRecords` | Number | Total number of rows. |
| `iTotalDisplayRecords` | Number | Total number of rows. |
| `aaData` | Array | Rows, one per view. |

Each row in `aaData` contains:

| Field | Type | Description |
|---|---|---|
| `_id` | String | View id. |
| `t` | Number | Click value for the period. |
| `scr` | Number | Scrolling value for the period. |
| `view` | String | View name, when known. |
| `url` | String | View URL, when known. |
| `display` | String | Display name of the view, when known. |

## Behavior

- Only views with `t` greater than `0` are returned.
- When there is no data, `aaData` is an empty array.
