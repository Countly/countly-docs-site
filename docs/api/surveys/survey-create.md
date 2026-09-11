---
sidebar_label: "Create Survey"
keywords:
  - "/i/surveys/survey/create"
  - "create"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Create Survey

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/survey/create
```

## Overview

Creates a Survey widget.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Surveys: `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `name` | String | Yes | Widget display name |
| `internalName` | String | Yes | Internal widget name |
| `status` | Boolean/String | Yes | Initial active status |
| `msg` | String (JSON Object) | Yes | Message text object |
| `questions` | String (JSON Array) | Yes | Survey questions |
| `appearance` | String (JSON Object) | No | Appearance configuration |
| `targeting` | String (JSON Object) | No | Targeting rules/cohort source |

## Examples

```text
/i/surveys/survey/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&name=Product Feedback&internalName=product_feedback_v1&status=true&msg={"thanks":"Thank you"}&questions=[{"id":"q1","type":"text","question":"How can we improve?","required":false}]
```

## Response

### Success Response

```json
{
  "result": {
    "_id": "67b9db56f67aab0012cd8899",
    "text": "Successfully created 67b9db56f67aab0012cd8899"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Create result wrapper |
| `result._id` | String | Created widget ID |
| `result.text` | String | Success message |

### Error Responses

- **HTTP 400** - Invalid params:
```json
{
  "result": "Invalid params: ..."
}
```

- **HTTP 400** - Missing questions:
```json
{
  "result": "Missing params: 'questions'"
}
```

- **HTTP 400** - DB create failure:
```json
{
  "result": "Failed to create widget(DB error)"
}
```

## Behavior

- Parses and preprocesses widget properties such as `msg`, `appearance`, `targeting`, and `questions`.
- Validates Survey payload with Survey form property rules.
- Requires non-empty `questions` and validates each question definition before insert.
- Creates a `feedback_widgets` record with `type=survey`, `creator`, `created`, `responded=0`, `shown=0`, and `wv=1`.
- Uploads `logo` when provided and records it in `appearance.logo`; if upload fails, the widget can still be created and the response includes the new `widgetId` with an error.
- Creates a linked cohort when `targeting` is provided, stores its ID as `cohortID`, and emits `surveys_widget_created`.

## Limitations

- Requires valid non-empty `questions` array.

## Related Endpoints

- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Delete Survey](survey-delete.md)
- [Surveys - Update Survey Status](survey-status-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
