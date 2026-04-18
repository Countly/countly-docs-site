---
sidebar_label: "Question Map"
keywords:
  - "/o/surveys/survey/question_map"
  - "question_map"
  - "surveys"
  - "survey"
---

# Surveys - Question Map

## Endpoint

```text
/o/surveys/survey/question_map
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns survey question schema map by widget ID(s).

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
| `widget_ids` | String (JSON Array/String) | No | Widget ID list or single ID |

## Response

### Success Response

```json
{
  "67b9db56f67aab0012cd8899": {
    "name": "Product Feedback",
    "q1": {
      "name": "How can we improve?",
      "type": "text"
    },
    "q2": {
      "name": "How satisfied are you?",
      "type": "radio",
      "choices": {
        "1": "Very satisfied",
        "2": "Satisfied"
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `<widgetId>` | Object | Widget question mapping |
| `<widgetId>.name` | String | Widget name |
| `<widgetId>.<questionId>` | Object | Question metadata |

### Error Responses

- **HTTP 500** - Query failure:
```json
{
  "result": "Error finding survey widgets"
}
```

## Behavior/Processing

- Reads Survey widgets (`type=survey`) for the requested `app_id`.
- If `widget_ids` is provided, parses it as JSON. It can be a widget ID string or an array of widget IDs.
- Invalid `widget_ids` JSON is logged; the endpoint continues with the base app/type query.
- Builds a map keyed by widget ID. Each widget entry includes `name` and one entry per question ID.
- Each question entry includes question text as `name`, question `type`, and optional `choices` converted from an array into a key-value object.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o/surveys/survey/question_map?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID
```

```text
/o/surveys/survey/question_map?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_ids=["67b9db56f67aab0012cd8899"]
```

## Related Endpoints

- [Surveys - Survey Data](survey-data.md)

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
