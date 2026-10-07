---
sidebar_label: "Widget Survey"
keywords:
  - "/o/surveys/survey/widget"
  - "widget"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Survey Widget

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/survey/widget
```

## Overview

Returns one Survey widget (`widget_id`) or multiple Survey widgets (`widget_ids`).

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
| `widget_id` | String | Conditional | Single widget ID |
| `widget_ids` | String | Conditional | Comma-separated widget IDs |
| `shown` | Boolean/String | No | Record display/impression metadata |
| `platform` | String | No | Shown context |
| `app_version` | String | No | Shown context |
| `journeyId` | String | No | Optional source tagging |

## Examples

```text
/o/surveys/survey/widget?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Response

### Success Response

```json
{
  "_id": "67b9db56f67aab0012cd8899",
  "type": "survey",
  "name": "Product Feedback",
  "questions": [
    {
      "id": "q1",
      "type": "text",
      "question": "How can we improve?"
    }
  ],
  "appearance": {
    "position": "bLeft",
    "show": "uSubmit",
    "color": "#0166D6"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Widget ID |
| `type` | String | `survey` |
| `name` | String | Widget name |
| `questions` | Array | Survey question definitions |
| `appearance` | Object | Widget appearance settings |

### Error Responses

- **HTTP 400** - Missing/invalid widget identifier:
```json
{
  "result": "Missing parameter \"widget_id\" or \"widget_ids\""
}
```

- **HTTP 404** - Not found:
```json
{
  "result": "Widget not found."
}
```

## Behavior

- Requires either `widget_id` or comma-separated `widget_ids`.
- Reads only active widgets (`status=true`) from `feedback_widgets`.
- For `widget_id`, returns a single object; for `widget_ids`, returns an array.
- Returned fields are limited to app/type/name/message/question/appearance/link/final text/version/consent fields used by SDK clients.
- If a single widget has `appearance=null`, the endpoint applies the default Survey appearance object in the response.
- If `shown` is present with a single widget, increments widget `shown`, records a custom metric in the Survey/NPS aggregate collection, and stores metric metadata for the widget/platform/app version/source key.

## Related Endpoints

- [Surveys - Survey Widgets](survey-widgets.md)
- [Surveys - Survey Overview Metrics](survey-overview.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

</details>
