---
sidebar_label: "Create NPS"
keywords:
  - "/i/surveys/nps/create"
  - "create"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - Create NPS

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/nps/create
```

## Overview

Creates an NPS widget.

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
| `msg` | String (JSON Object) | Yes | NPS message object |
| `followUpType` | String | No | Follow-up mode |
| `appearance` | String (JSON Object) | No | Appearance configuration |
| `targeting` | String (JSON Object) | No | Targeting rules/cohort source |

## Examples

```text
/i/surveys/nps/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&name=NPS Q1&internalName=nps_q1&status=true&msg={"mainQuestion":"How likely are you to recommend us?"}
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

- **HTTP 400** - DB create failure:
```json
{
  "result": "Failed to create widget(DB error)"
}
```

## Behavior

- Parses and preprocesses widget properties such as `msg`, `appearance`, and `targeting`.
- Validates NPS payload with NPS form property rules.
- Creates a `feedback_widgets` record with `type=nps`, `creator`, `created`, `responded=0`, `shown=0`, `wv=1`, and `scores={total,promoter,detractor,passive}` initialized to zero.
- Uploads `logo` when provided and records it in `appearance.logo`; if upload fails, the widget can still be created and the response includes the new `widgetId` with an error.
- Creates a linked cohort when `targeting` is provided, stores its ID as `cohortID`, and emits `surveys_widget_created`.

## Related Endpoints

- [Surveys - Edit NPS](nps-edit.md)
- [Surveys - Delete NPS](nps-delete.md)
- [Surveys - Update NPS Status](nps-status-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
