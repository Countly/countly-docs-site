---
sidebar_label: "Widget NPS"
keywords:
  - "/o/surveys/nps/widget"
  - "widget"
  - "surveys"
  - "nps"
---

# Surveys - NPS Widget

## Endpoint

```text
/o/surveys/nps/widget
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns one NPS widget (`widget_id`) or multiple NPS widgets (`widget_ids`).

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
  "type": "nps",
  "name": "NPS Q1",
  "msg": {
    "mainQuestion": "How likely are you to recommend us?"
  },
  "followUpType": "score"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Widget ID |
| `type` | String | `nps` |
| `name` | String | Widget name |
| `msg` | Object | NPS message texts |
| `followUpType` | String | NPS follow-up mode |

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

- Requires either `widget_id` or comma-separated `widget_ids`.
- Reads only active widgets (`status=true`) from `feedback_widgets`.
- For `widget_id`, returns a single object; for `widget_ids`, returns an array.
- Returned fields are limited to app/type/name/message/score/appearance/link/final text/version/consent fields used by SDK clients.
- If `shown` is present with a single widget, increments widget `shown`, records a custom metric in the Survey/NPS aggregate collection, and stores metric metadata for the widget/platform/app version/source key.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

```text
/o/surveys/nps/widget?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Related Endpoints

- [Surveys - NPS Widgets](nps-widgets.md)
- [Surveys - NPS Overview Metrics](nps-overview.md)

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
