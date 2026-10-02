---
sidebar_label: "Edit NPS"
keywords:
  - "/i/surveys/nps/edit"
  - "edit"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - Edit NPS

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/nps/edit
```

## Overview

Updates an existing NPS widget.

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
| `msg` | String (JSON Object) | No | NPS message config |
| `appearance` | String (JSON Object) | No | Appearance config |
| `status` | Boolean/String | No | Active status |
| `followUpType` | String | No | Follow-up mode |

## Examples

```text
/i/surveys/nps/edit?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899&name=NPS Q2
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

- Parses and preprocesses widget properties such as `msg`, `appearance`, and `targeting`.
- Updates `feedback_widgets` by `widget_id`. Appearance fields are stored under `appearance.<field>`.
- If `delete_logo` is set and no new logo file is uploaded, deletes the stored logo and clears `appearance.logo`.
- If `targeting` changes, updates, creates, or deletes the linked cohort and recalculates cohort steps when needed.
- Returns `Success` after widget/cohort updates, or specific cohort/upload error messages when follow-up work fails.
- Emits `surveys_widget_edited` and, when applicable, `cohort_edited` system log actions.

## Related Endpoints

- [Surveys - Create NPS](nps-create.md)
- [Surveys - Update NPS Status](nps-status-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
