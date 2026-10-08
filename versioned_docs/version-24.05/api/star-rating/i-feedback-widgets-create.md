---
sidebar_label: "Create Widget"
keywords:
  - "/i/feedback/widgets/create"
  - "create"
  - "feedback"
  - "widgets"
last_update:
  date: "2026-10-08"
---

# Star Rating - Create Widget

## Endpoint

```plaintext
/i/feedback/widgets/create
```

## Overview

Creates a new star-rating widget for an app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID the widget belongs to. |
| `status` | Boolean/String | Yes | Whether the widget is active. |
| `internalName` | String | No | Internal widget name. |
| `popup_header_text` | String | No | Header text of the feedback popup. |
| `popup_comment_callout` | String | No | Text of the comment field callout. |
| `popup_email_callout` | String | No | Text of the contact-by-email callout. |
| `popup_button_callout` | String | No | Text of the submit button. |
| `popup_thanks_message` | String | No | Message shown after submission. |
| `finalText` | String | No | Final text of the popup. |
| `trigger_position` | String | No | Position of the trigger button, for example `mleft`, `mright`, `bleft` or `bright`. |
| `trigger_size` | String | No | Size of the trigger button. |
| `trigger_bg_color` | String | No | Background color of the trigger button. |
| `trigger_font_color` | String | No | Font color of the trigger button. |
| `trigger_button_text` | String | No | Text of the trigger button. |
| `hide_sticker` | Boolean/String | No | Whether the trigger button is hidden by default. |
| `contact_enable` | Boolean | No | Whether the contact-by-email field is shown. |
| `comment_enable` | Boolean | No | Whether the comment field is shown. |
| `rating_symbol` | String | No | Symbol used for ratings. |
| `ratings_texts` | Array/String | No | JSON array of rating labels. When missing or not valid JSON, five default labels are used. |
| `consent` | Boolean | No | Whether a consent line is shown. |
| `links` | Array/String | No | JSON array of consent links. A link whose `linkValue` does not start with `http://` or `https://` has its `linkValue` emptied. |
| `target_page` | String | No | Target page mode, for example `all` or `selected`. |
| `target_pages` | Array/String | No | JSON array of page paths. When missing or not valid JSON, `["/"]` is used. |
| `targeting` | Object/String | No | JSON object with targeting conditions. Used to create a cohort when the Cohorts plugin is enabled. |
| `logo` | String | No | File name of a previously uploaded logo. |
| `logoType` | String | No | Logo type. |
| `globalLogo` | Boolean | No | Whether the global logo is used. |

The widget is always created as a `rating` widget, shown after page load, on desktop, phone and tablet. Any `showPolicy` or `appearance` value in the request is replaced.

## Examples

### Create a widget

```plaintext
/i/feedback/widgets/create?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  status=true&
  popup_header_text=How was your experience?&
  target_pages=["/","/pricing"]
```

## Response

### Success Response

`201 Created`

```json
{
  "result": "Successfully created 6256d161e8faa7b449e2dd6b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Successfully created` followed by the new widget ID. |

### Error Responses

- `400`

```json
{
  "result": "Invalid params: ..."
}
```

- `400` when the Cohorts plugin is enabled and the targeting cohort could not be created. The widget has already been saved.

```json
{
  "result": {
    "error": "Failed to set cohort",
    "widgetId": "6256d161e8faa7b449e2dd6b"
  }
}
```

- `500`: the widget could not be saved. The `result` holds the database error message.

Standard authentication/authorization errors from create validation can also be returned.

## Behavior

- Runs the widget field preprocessors, then validates the payload. `app_id` and `status` are required.
- Stores the widget in `feedback_widgets` with `type` `rating`, `is_active` set from `status`, a creation timestamp and zeroed counters (`timesShown`, `ratingsCount`, `ratingsSum`).
- If the Cohorts plugin is enabled and `targeting` is given, creates a cohort from it and stores its ID on the widget as `cohortID`.
- Writes a `feedback_widget_created` system log entry.

### Impact on Other Data

- Adds one widget to `countly.feedback_widgets`.
- May add a cohort to `countly.cohorts`.

## Related Endpoints

- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - Remove Widget](i-feedback-widgets-remove.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget storage | Inserts the widget and sets its `cohortID`. |
| `countly.cohorts` | Targeting cohorts | May create a cohort (when the Cohorts plugin is enabled). |
| `countly.systemlogs` | Audit trail | Receives `feedback_widget_created`. |

</details>
