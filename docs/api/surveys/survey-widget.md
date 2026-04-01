---
sidebar_label: "Widget Survey"
keywords:
  - "/o/surveys/survey/widget"
  - "widget"
  - "surveys"
  - "survey"
---

# Surveys - Survey Widget

## Endpoint

```text
/o/surveys/survey/widget
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns one Survey widget (`widget_id`) or multiple Survey widgets (`widget_ids`).

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
| `widget_id` | String | Conditional | Single widget ID |
| `widget_ids` | String | Conditional | Comma-separated widget IDs |
| `shown` | Boolean/String | No | Record display/impression metadata |
| `platform` | String | No | Shown context |
| `app_version` | String | No | Shown context |
| `journeyId` | String | No | Optional source tagging |

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

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

```text
/o/surveys/survey/widget?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Related Endpoints

- [Surveys - Survey Widgets](survey-widgets.md)
- [Surveys - Survey Overview Metrics](survey-overview.md)

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
