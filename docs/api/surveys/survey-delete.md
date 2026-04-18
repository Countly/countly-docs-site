---
sidebar_label: "Delete Survey"
keywords:
  - "/i/surveys/survey/delete"
  - "delete"
  - "surveys"
  - "survey"
---

# Surveys - Delete Survey

## Endpoint

```text
/i/surveys/survey/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a Survey widget. Optionally removes linked response data.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Surveys: `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | Yes | Widget ID |
| `with_data` | Boolean/String | No | Also remove widget response data |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Delete status |

### Error Responses

- **HTTP 404** - Widget not found:
```json
{
  "result": "Widget not found"
}
```

## Behavior/Processing

- Loads the widget from `feedback_widgets` by `widget_id`; missing widgets return `Widget not found`.
- Deletes the widget logo file when `appearance.logo` is set.
- Removes the widget document from `feedback_widgets`.
- Deletes the linked cohort when `cohortID` exists.
- If `with_data` is set, also removes related widget response/aggregate data; success emits `surveys_removed_with_data`.
- Without `with_data`, only the widget record is removed; success emits `surveys_widget_removed`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

---

## Examples

```text
/i/surveys/survey/delete?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Related Endpoints

- [Surveys - Create Survey](survey-create.md)
- [Surveys - Update Survey Status](survey-status-update.md)

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
