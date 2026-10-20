---
sidebar_label: "Views"
keywords:
  - "/o/heatmaps/views"
  - "views"
  - "heatmaps"
last_update:
  date: "2026-10-17"
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

Returns a table of the views that were visited at least once in the period, with their view count and scroll value.

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
| `iSortCol_0` | Number | No | Column to sort by: `0` view name, `1` scroll value (`scr`), `2` view count (`t`). Sorted by view count, descending, when not set. |
| `sSortDir_0` | String | No | `asc` for ascending; any other value sorts descending. Used together with `iSortCol_0`. |
| `iDisplayStart` | Number | No | Number of rows to skip. |
| `iDisplayLength` | Number | No | Number of rows to return. `-1` or not set returns all rows. |
| `sSearch` | String | No | Only return views whose name matches this text (case-insensitive). |
| `sEcho` | String | No | Value echoed back in the response, for DataTables paging. |

## Examples

### Example: List views

```bash
curl "https://your-server.com/o/heatmaps/views?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&period=30days&iDisplayStart=0&iDisplayLength=10"
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
      "_id": "VIEW_ID",
      "view": "/home",
      "display": "/home",
      "url": "https://example.com/home",
      "t": 120,
      "scr": 55
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value of the request. |
| `iTotalRecords` | Number | Total number of rows. |
| `iTotalDisplayRecords` | Number | Same as `iTotalRecords`. |
| `aaData` | Array | The rows of the requested page. |
| `aaData[]._id` | String | ID of the view. |
| `aaData[].view` | String | Name of the view. |
| `aaData[].display` | String | Display name of the view. |
| `aaData[].url` | String | URL of the view. |
| `aaData[].t` | Number | View count in the period. |
| `aaData[].scr` | Number | Scroll value of the view in the period. |

## Behavior

- Only views with a view count above zero are returned.
- When no view data exists, `aaData` is an empty array.

## Related Endpoints

- [Heatmaps - Domains](o-heatmaps-domains.md)
- [Heatmaps - Metrics](o-heatmaps-metrics.md)
- [Heatmaps - Export](o-heatmaps-export.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_viewdata{sha1(segment+appId)}` | Aggregated view metrics | Reads the view counts and scroll values. |
| `countly.app_viewsmeta{appId}` | View metadata | Reads the view name, display name and URL. |

</details>
