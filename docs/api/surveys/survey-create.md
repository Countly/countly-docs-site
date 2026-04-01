---
sidebar_label: "Create Survey"
keywords:
  - "/i/surveys/survey/create"
  - "create"
  - "surveys"
  - "survey"
---

# Surveys - Create Survey

## Endpoint

```text
/i/surveys/survey/create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a Survey widget.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

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

## Behavior/Processing

- Validates Survey payload and `questions`.
- Creates `feedback_widgets` record and initializes counters.
- Creates/updates cohort linkage when targeting is present.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/surveys/survey/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&name=Product Feedback&internalName=product_feedback_v1&status=true&msg={"thanks":"Thank you"}&questions=[{"id":"q1","type":"text","question":"How can we improve?","required":false}]
```

## Limitations

- Requires valid non-empty `questions` array.

## Related Endpoints

- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Delete Survey](survey-delete.md)
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

2026-02-16
