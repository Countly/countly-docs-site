---
sidebar_label: "Widgets NPS"
keywords:
  - "/o/surveys/nps/widgets"
  - "widgets"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - NPS Widgets

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/nps/widgets
```

## Overview

Returns paginated NPS widgets table.

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
| `status` | Boolean/String | No | Filter by active status |
| `sSearch` | String | No | Text search |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

## Examples

```text
/o/surveys/nps/widgets?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&status=true&sSearch=Q1
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
      "_id": "67b9db56f67aab0012cd8899",
      "name": "NPS Q1",
      "type": "nps",
      "status": true,
      "shown": 340,
      "responded": 120,
      "nps": 40
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
| `aaData` | Array | Widget rows |

### Error Responses

- **HTTP 500** - Aggregation failure:
```json
{
  "result": "<error message>"
}
```

## Behavior

- Filters `feedback_widgets` by `type=nps`, `app_id`, and optional `status`.
- Applies `sSearch` as a case-insensitive regex against `internalName` and `name`.
- Supports DataTables sorting through `iSortCol_0` / `sSortDir_0`; sortable columns are `status`, `internalName`, `targeting`, `nps`, `responded`, and `rate`.
- Calculates `rate` as `responded / total` when total is greater than zero.
- For NPS rows with responses, converts `scores.promoter` and `scores.detractor` from counts to percentages, calculates `nps` as promoter percentage minus detractor percentage, and calculates `scores.passive` as the remaining percentage.

## Related Endpoints

- [Surveys - NPS Widget](nps-widget.md)
- [Surveys - NPS Overview Metrics](nps-overview.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
