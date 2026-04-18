---
sidebar_label: "Edit NPS"
keywords:
  - "/i/surveys/nps/edit"
  - "edit"
  - "surveys"
  - "nps"
---

# Surveys - Edit NPS

## Endpoint

```text
/i/surveys/nps/edit
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates an existing NPS widget.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Surveys: `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | Yes | Widget ID |
| `msg` | String (JSON Object) | No | NPS message config |
| `appearance` | String (JSON Object) | No | Appearance config |
| `status` | Boolean/String | No | Active status |
| `followUpType` | String | No | Follow-up mode |

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
| `result` | String | Update status |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid params: ..."
}
```

- **HTTP 404** - Unknown widget:
```json
{
  "result": "Widget not found"
}
```

## Behavior/Processing

- Parses and preprocesses widget properties such as `msg`, `appearance`, and `targeting`.
- Updates `feedback_widgets` by `widget_id`. Appearance fields are stored under `appearance.<field>`.
- If `delete_logo` is set and no new logo file is uploaded, deletes the stored logo and clears `appearance.logo`.
- If `targeting` changes, updates, creates, or deletes the linked cohort and recalculates cohort steps when needed.
- Returns `Success` after widget/cohort updates, or specific cohort/upload error messages when follow-up work fails.
- Emits `surveys_widget_edited` and, when applicable, `cohort_edited` system log actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/surveys/nps/edit?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&name=NPS Q2
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
