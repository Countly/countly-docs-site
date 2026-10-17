---
sidebar_label: "Export"
keywords:
  - "/o/heatmaps/export"
  - "export"
  - "heatmaps"
last_update:
  date: "2026-10-17"
---

# Heatmaps - Export

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/heatmaps/export
```

## Overview

Returns the database query that produces the heatmap views table, for use with the export endpoints. It returns the query, not the table data.

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
| `iSortCol_0` | Number | No | Column to sort by: `0` view name, `1` scroll value (`scr`). Sorted by view count, descending, when not set. |
| `sSortDir_0` | String | No | `asc` for ascending; any other value sorts descending. Used together with `iSortCol_0`. |

## Examples

### Example: Get the export query

```bash
curl "https://your-server.com/o/heatmaps/export?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&period=30days"
```

## Response

### Success Response

```json
{
  "db": "countly",
  "pipeline": [],
  "collection": "app_viewdata{hash}",
  "projection": {
    "_id": true,
    "view": true,
    "url": true,
    "display": true,
    "u": true,
    "t": true,
    "scr": true
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `db` | String | Database to run the query on, always `countly`. |
| `pipeline` | Array | Aggregation pipeline that builds the table. |
| `collection` | String | Collection to run the pipeline on. |
| `projection` | Object | Fields included in the exported rows. |

## Behavior

- The exported rows contain the view (`view`, `display`, `url`), the unique count (`u`), the view count (`t`) and the scroll value (`scr`).

## Related Endpoints

- [Heatmaps - Views](o-heatmaps-views.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_viewdata{sha1(segment+appId)}` | Aggregated view metrics | Named in the returned query; not read by this endpoint. |

</details>
