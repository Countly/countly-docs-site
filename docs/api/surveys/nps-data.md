---
sidebar_label: "Data NPS"
keywords:
  - "/o/surveys/nps/data"
  - "data"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - NPS Data

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/nps/data
```

## Overview

Returns NPS response table data and NPS-specific method branches.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Surveys: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | No | Widget ID (required for `meta` and `graph`) |
| `method` | String | No | `graph`, `meta` or omitted for table data |
| `period` | String | Required for `meta`/`graph` | Period filter |
| `periodOffset` | Number | No | Offset in minutes |
| `uid` | String | No | User filter |
| `sSearch` | String | No | Search filter |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

## Examples

```text
/o/surveys/nps/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&method=meta&period=30days
```

```text
/o/surveys/nps/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&method=graph&period=30days
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 120,
  "iTotalDisplayRecords": 20,
  "aaData": [
    {
      "ts": 1739557500,
      "uid": "u_102",
      "rating": 9,
      "comment": "Great product"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value for table requests |
| `iTotalRecords` | Number | Total records count |
| `iTotalDisplayRecords` | Number | Displayed records count |
| `aaData` | Array | Response rows |

### Error Responses

- **HTTP 400** - Missing period for meta:
```json
{
  "result": "Missing request parameter: period"
}
```

- **HTTP 400** - Invalid period:
```json
{
  "result": "Bad request parameter: period"
}
```

## Behavior

- `method=graph` returns NPS graph data from the aggregate collection (`nps{app_id}`) using `widget_id` as the segmentation value.
- `method=meta` requires `period`, validates Countly period syntax, and returns metadata aggregates from `surveyQueries.fetchNpsMeta`.
- Without `method`, returns a DataTables response table from Drill event `[CLY]_nps`.
- Table mode supports filters for `widget_id`, `uid`, `rating`, `platform`, `platform_version`, `version`, `source`, `period`, and `device_id`.
- `source=default` filters responses without `sg.journeyId`; any other `source` value matches `sg.journeyId`.
- Table rows project rating, comment, platform, platform version, app version, widget id, timestamp, uid, did, and user name.

## Related Endpoints

- [Surveys - NPS Overview Metrics](nps-overview.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
