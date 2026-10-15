---
sidebar_label: "Remove Widget"
keywords:
  - "/i/feedback/widgets/remove"
  - "remove"
  - "feedback"
  - "widgets"
last_update:
  date: "2026-10-09"
---

# Star Rating - Remove Widget

## Endpoint

```plaintext
/i/feedback/widgets/remove
```

## Overview

Removes a star-rating widget, and optionally the feedback data collected with it.

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
| `widget_id` | String | Yes | Widget ObjectID to remove. |
| `with_data` | Boolean | No | When set, the feedback data collected with the widget is removed as well. |

## Examples

### Remove a widget and its data

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
| `result` | String | `Success` when the widget has been removed. |

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

- `500`

The database error message is returned in `result`.

Standard authentication/authorization errors from delete validation can also be returned.

## Behavior

- Looks up the widget by `widget_id` within the given app, and returns `404` if it does not exist.
- If the widget has a linked cohort (Cohorts plugin enabled), the cohort is deleted too.
- With `with_data`, star-rating events recorded for the widget are also deleted.

### Impact on Other Data

- Removes the widget from `countly.feedback_widgets`.
- May delete the linked cohort from `countly.cohorts`.
- With `with_data`, removes the widget's `[CLY]_star_rating` events from `countly_drill.drill_events`.
- Writes an audit event to system logs.

## Related Endpoints

- [Star Rating - Create Widget](i-feedback-widgets-create.md)
- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)
