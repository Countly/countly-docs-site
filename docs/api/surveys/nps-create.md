---
sidebar_label: "Create NPS"
---

# Surveys - Create NPS

## Endpoint

```text
/i/surveys/nps/create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates an NPS widget.

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
| `msg` | String (JSON Object) | Yes | NPS message object |
| `followUpType` | String | No | Follow-up mode |
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

- **HTTP 400** - DB create failure:
```json
{
  "result": "Failed to create widget(DB error)"
}
```

## Behavior/Processing

- Validates NPS payload.
- Creates `feedback_widgets` record and initializes NPS score fields.
- Creates/updates cohort linkage when targeting is present.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/surveys/nps/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&name=NPS Q1&internalName=nps_q1&status=true&msg={"mainQuestion":"How likely are you to recommend us?"}
```

## Related Endpoints

- [Surveys - Edit NPS](nps-edit.md)
- [Surveys - Delete NPS](nps-delete.md)
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

2026-02-16
