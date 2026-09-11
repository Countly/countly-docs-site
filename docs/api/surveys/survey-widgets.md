---
sidebar_label: "Widgets Survey"
keywords:
  - "/o/surveys/survey/widgets"
  - "widgets"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Survey Widgets

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/survey/widgets
```

## Overview

Returns paginated Survey widgets table.

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
/o/surveys/survey/widgets?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&iDisplayStart=0&iDisplayLength=10
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 4,
  "iTotalDisplayRecords": 4,
  "aaData": [
    {
      "_id": "67b9db56f67aab0012cd8899",
      "name": "Product Feedback",
      "type": "survey",
      "status": true,
      "shown": 142,
      "responded": 48,
      "rate": 0.34
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

- Filters `feedback_widgets` by `type=survey`, `app_id`, and optional `status`.
- Applies `sSearch` as a case-insensitive regex against `internalName` and `name`.
- Supports DataTables sorting through `iSortCol_0` / `sSortDir_0`; sortable columns are `status`, `internalName`, `targeting`, `nps`, `responded`, and `rate`.
- Calculates `rate` as `responded / total` when total is greater than zero.
- For Survey widgets, enriches each row with `responsesByDeliveryMethodIds` by checking Drill `[CLY]_survey` answered events and grouping responses by Journey delivery id or `default`.

## Related Endpoints

- [Surveys - Survey Widget](survey-widget.md)
- [Surveys - Survey Overview Metrics](survey-overview.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
