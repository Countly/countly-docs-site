---
sidebar_label: "Widgets NPS"
keywords:
  - "/o/surveys/nps/widgets"
  - "widgets"
  - "surveys"
  - "nps"
---

# Surveys - NPS Widgets

## Endpoint

```text
/o/surveys/nps/widgets
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns paginated NPS widgets table.

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
| `status` | Boolean/String | No | Filter by active status |
| `sSearch` | String | No | Text search |
| `iDisplayStart` | Number | No | Offset |
| `iDisplayLength` | Number | No | Page size |

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

## Behavior/Processing

- Filters `feedback_widgets` by `type=nps`, `app_id`, and optional `status`.
- Applies `sSearch` as a case-insensitive regex against `internalName` and `name`.
- Supports DataTables sorting through `iSortCol_0` / `sSortDir_0`; sortable columns are `status`, `internalName`, `targeting`, `nps`, `responded`, and `rate`.
- Calculates `rate` as `responded / total` when total is greater than zero.
- For NPS rows with responses, converts `scores.promoter` and `scores.detractor` from counts to percentages, calculates `nps` as promoter percentage minus detractor percentage, and calculates `scores.passive` as the remaining percentage.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/o/surveys/nps/widgets?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&status=true&sSearch=Q1
```

## Related Endpoints

- [Surveys - NPS Widget](nps-widget.md)
- [Surveys - NPS Overview Metrics](nps-overview.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-04-18
