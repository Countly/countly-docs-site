---
sidebar_label: "Data Survey"
---

# Surveys - Survey Data

## Endpoint

```text
/o/surveys/survey/data
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns Survey response table data and Survey-specific method branches.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Surveys: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | No | Widget ID (required for some methods) |
| `method` | String | No | `meta`, `results`, `question`, `export`, `exportold` |
| `period` | String | No | Period filter |
| `periodOffset` | Number | No | Offset in minutes |
| `platform` | String | No | Platform filter |
| `version` | String | No | App version filter |
| `sSearch` | String | No | Search filter |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

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

## Behavior/Processing

- `method=meta` returns Survey metadata aggregates.
- `method=results` returns merged question-level results.
- `method=question` returns one question answer table.
- `method=export/exportold` returns export query descriptor payload.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/o/surveys/survey/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&iDisplayStart=0&iDisplayLength=20
```

```text
/o/surveys/survey/data?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&method=results&period=30days
```

## Related Endpoints

- [Surveys - Survey Overview Metrics](survey-overview.md)
- [Surveys - Survey Question Map](question-map.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
