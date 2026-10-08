---
sidebar_label: "Remove Widget"
keywords:
  - "/i/feedback/widgets/remove"
  - "remove"
  - "feedback"
  - "widgets"
last_update:
  date: "2026-10-08"
---

# Star Rating - Remove Widget

## Endpoint

```plaintext
/i/feedback/widgets/remove
```

## Overview

Removes a star-rating widget, and optionally the feedback collected through it.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID the widget belongs to. |
| `widget_id` | String | Yes | ID of the widget to remove. |
| `with_data` | Boolean String | No | When set to any non-empty value, the feedback submissions stored for the widget are removed too. |

## Examples

### Remove a widget and its feedback

```plaintext
/i/feedback/widgets/remove?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  widget_id=67a3d2f5c1a23b0f4d6c0201&
  with_data=true
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
| `result` | String | `Success` when the widget was removed. |

### Error Responses

- `400`

```json
{
  "result": "Invalid widget id."
}
```

- `404`

```json
{
  "result": "Widget not found"
}
```

- `500`: the widget or its data could not be removed. The `result` holds the database error message.

Standard authentication/authorization errors from delete validation can also be returned.

## Behavior

- Looks up the widget by `widget_id` within the app. If it is not found, returns `404`.
- Removes the widget from `feedback_widgets`.
- If the Cohorts plugin is enabled and the widget has a targeting cohort, the cohort is deleted too.
- With `with_data`, removes the widget's submissions from the app's feedback collection (`feedback{app_id}`) and writes a `feedback_widget_removed_with_data` system log entry. Without it, only the widget is removed and a `feedback_widget_removed` entry is written.

### Impact on Other Data

- Removes one widget from `countly.feedback_widgets`.
- May remove a cohort from `countly.cohorts`.
- With `with_data`, removes the widget's feedback from `countly.feedback{app_id}`.

## Related Endpoints

- [Star Rating - Create Widget](i-feedback-widgets-create.md)
- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget storage | Reads and removes the widget. |
| `countly.feedback{app_id}` | Feedback submissions | Removes the widget's submissions when `with_data` is set. |
| `countly.cohorts` | Targeting cohorts | May delete the widget's cohort (when the Cohorts plugin is enabled). |
| `countly.systemlogs` | Audit trail | Receives `feedback_widget_removed` or `feedback_widget_removed_with_data`. |

</details>
