---
sidebar_label: "Status Survey"
keywords:
  - "/i/surveys/survey/status"
  - "status"
  - "surveys"
  - "survey"
---

# Surveys - Update Survey Status

## Endpoint

```text
/i/surveys/survey/status
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Bulk-updates Survey widget active status.

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
| `data` | String (JSON Object) | Yes | Widget ID to status map |

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
| `result` | String | Status update result |

### Error Responses

- **HTTP 500** - Invalid `data` payload:
```json
{
  "result": "Invalid paramerer 'data'"
}
```

- **HTTP 400** - Nothing to update:
```json
{
  "result": "Nothing to update"
}
```

## Behavior/Processing

- Parses `data` as a JSON object mapping widget IDs to desired status values.
- Values `true` and `"true"` set `status=true`; all other values set `status=false`.
- Executes updates as an unordered bulk operation against `feedback_widgets`.
- Returns `Nothing to update` when the parsed object has no keys.
- Emits `surveys_widget_status` system log action on success.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/surveys/survey/status?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&data={"67b9db56f67aab0012cd8899":false}
```

## Related Endpoints

- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Delete Survey](survey-delete.md)

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
