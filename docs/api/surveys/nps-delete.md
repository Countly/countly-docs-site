---
sidebar_label: "Delete NPS"
keywords:
  - "/i/surveys/nps/delete"
  - "delete"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - Delete NPS

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/surveys/nps/delete
```

## Overview

Deletes an NPS widget. Optionally removes linked response data.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Surveys: `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | Yes | Widget ID |
| `with_data` | Boolean/String | No | Also remove widget response data |

## Examples

```text
/i/surveys/nps/delete?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
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
| `result` | String | Delete status |

### Error Responses

- **HTTP 404** - Widget not found:
```json
{
  "result": "Widget not found"
}
```

## Behavior

- Loads the widget from `feedback_widgets` by `widget_id`; missing widgets return `Widget not found`.
- Deletes the widget logo file when `appearance.logo` is set.
- Removes the widget document from `feedback_widgets`.
- Deletes the linked cohort when `cohortID` exists.
- If `with_data` is set, also removes related widget response/aggregate data; success emits `surveys_removed_with_data`.
- Without `with_data`, only the widget record is removed; success emits `surveys_widget_removed`.

## Related Endpoints

- [Surveys - Create NPS](nps-create.md)
- [Surveys - Update NPS Status](nps-status-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |

</details>
