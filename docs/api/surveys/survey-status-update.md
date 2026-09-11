---
sidebar_label: "Status Survey"
keywords:
  - "/i/surveys/survey/status"
  - "status"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Update Survey Status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/survey/status
```

## Overview

Bulk-updates Survey widget active status.

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
| `data` | String (JSON Object) | Yes | Widget ID to status map |

## Examples

```text
/i/surveys/survey/status?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&data={"67b9db56f67aab0012cd8899":false}
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

## Behavior

- Parses `data` as a JSON object mapping widget IDs to desired status values.
- Values `true` and `"true"` set `status=true`; all other values set `status=false`.
- Executes updates as an unordered bulk operation against `feedback_widgets`.
- Returns `Nothing to update` when the parsed object has no keys.
- Emits `surveys_widget_status` system log action on success.

## Related Endpoints

- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Delete Survey](survey-delete.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
