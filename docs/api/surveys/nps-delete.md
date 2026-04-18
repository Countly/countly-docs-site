---
sidebar_label: "Delete NPS"
keywords:
  - "/i/surveys/nps/delete"
  - "delete"
  - "surveys"
  - "nps"
---

# Surveys - Delete NPS

## Endpoint

```text
/i/surveys/nps/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes an NPS widget. Optionally removes linked response data.

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
/i/surveys/nps/delete?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Related Endpoints

- [Surveys - Create NPS](nps-create.md)
- [Surveys - Update NPS Status](nps-status-update.md)

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
