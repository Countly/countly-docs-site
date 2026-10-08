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

Removes a star-rating widget, and optionally the feedback it collected.

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
| `widget_id` | String | Yes | Target widget ID. |
| `with_data` | Boolean | No | When set, the feedback submitted for this widget is deleted as well. |

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

- `500`: the database error message, if the removal failed.

Standard authentication/authorization errors from delete validation can also be returned.

## Behavior

- Converts `widget_id` to an ObjectID and looks the widget up within the given app.
- Deletes the widget document.
- If the widget has a targeting cohort and the Cohorts plugin is enabled, deletes that cohort.
- With `with_data`, also deletes the widget's entries from the app's feedback collection and writes a `feedback_widget_removed_with_data` system log entry. Otherwise it writes `feedback_widget_removed`.

### Impact on Other Data

- Removes one widget from `countly.feedback_widgets`.
- With `with_data`, removes the widget's submissions from `countly.feedback{appId}`.
- May delete a related cohort from `countly.cohorts`.

## Related Endpoints

- [Star Rating - Create Widget](i-feedback-widgets-create.md)
- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget storage | Reads and deletes the widget document. |
| `countly.feedback{appId}` | Feedback submissions | Deleted for the widget when `with_data` is set. |
| `countly.cohorts` | Targeting cohorts | May delete the widget's cohort (when cohorts plugin enabled). |
| `countly.systemlogs` | Audit trail | Receives `feedback_widget_removed` or `feedback_widget_removed_with_data`. |

</details>
