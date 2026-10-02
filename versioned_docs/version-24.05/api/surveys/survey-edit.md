---
sidebar_label: "Edit Survey"
keywords:
  - "/i/surveys/survey/edit"
  - "edit"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Edit Survey

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/survey/edit
```

## Overview

Updates an existing Survey widget.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Surveys: `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | Yes | Widget ID |
| `questions` | String (JSON Array) | Yes | Survey questions |
| `msg` | String (JSON Object) | No | Message config |
| `appearance` | String (JSON Object) | No | Appearance config |
| `status` | Boolean/String | No | Active status |

## Examples

```text
/i/surveys/survey/edit?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&name=Product Feedback v2&questions=[{"id":"q1","type":"text","question":"How can we improve next?","required":false}]
```

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

## Behavior

- Parses and preprocesses widget properties such as `msg`, `appearance`, `targeting`, and `questions`.
- Survey edits require `questions`; missing questions return `Missing params: 'questions'`.
- Validates question definitions before updating; invalid question structure returns `Error in param 'questions'`.
- Updates `feedback_widgets` by `widget_id`. Appearance fields are stored under `appearance.<field>`.
- If `delete_logo` is set and no new logo file is uploaded, deletes the stored logo and clears `appearance.logo`.
- If `targeting` changes, updates, creates, or deletes the linked cohort and recalculates cohort steps when needed.
- Returns `Success` after widget/cohort updates, or specific cohort/upload error messages when follow-up work fails.
- Emits `surveys_widget_edited` and, when applicable, `cohort_edited` system log actions.

## Related Endpoints

- [Surveys - Create Survey](survey-create.md)
- [Surveys - Update Survey Status](survey-status-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
