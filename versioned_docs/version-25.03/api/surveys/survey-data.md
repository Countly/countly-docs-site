---
sidebar_label: "Data Survey"
keywords:
  - "/o/surveys/survey/data"
  - "data"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Survey Data

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/survey/data
```

## Overview

Returns Survey response table data and Survey-specific method branches.

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
| `widget_id` | String | No | Widget ID (required for some methods) |
| `method` | String | No | `meta`, `results`, `question`, `export` |
| `period` | String | No | Period filter |
| `periodOffset` | Number | No | Offset in minutes |
| `platform` | String | No | Platform filter |
| `version` | String | No | App version filter |
| `sSearch` | String | No | Search filter |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

## Examples

```text
/o/surveys/survey/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&iDisplayStart=0&iDisplayLength=20
```

```text
/o/surveys/survey/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&method=results&period=30days
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 250,
  "iTotalDisplayRecords": 20,
  "aaData": [
    {
      "ts": 1739557500,
      "uid": "u_102",
      "platform": "iOS",
      "app_version": "2.3.1"
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

- **HTTP 400** - Missing required params in selected method:
```json
{
  "result": "Missing param 'widget_id'"
}
```

- **HTTP 404** - Widget not found:
```json
{
  "result": "Widget not found."
}
```

## Behavior

- Uses Drill data for `[CLY]_survey`; returns `Drill disabled` or `Drill missing` if Drill is unavailable for table-backed modes.
- Applies common filters from query parameters: `widget_id`, `uid`, `platform`, `platform_version`, `version`, `source`, `period`, and `device_id`.
- `source=default` filters responses without `sg.journeyId`; any other `source` value matches `sg.journeyId`.
- `method=meta` returns Survey metadata aggregates from `surveyQueries.fetchSurveyMeta`.
- `method=results` requires `widget_id`, loads the widget, and returns merged per-question totals and answer buckets.
- `method=question` requires `widget_id` and `question_id`, validates the question exists on the widget, and returns a DataTables answer table for that question.
- `method=export` returns an export query descriptor (MongoDB Drill collection and aggregation pipeline) instead of response rows.
- Without a special `method`, returns DataTables rows from Drill. With `widget_id`, answers are translated using widget question choices; without `widget_id`, it returns all answered survey rows.
- `filter_questions` can be a JSON object mapping question IDs to exact values or `null`; `null` means answer exists.

## Related Endpoints

- [Surveys - Survey Overview Metrics](survey-overview.md)
- [Surveys - Survey Question Map](question-map.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
