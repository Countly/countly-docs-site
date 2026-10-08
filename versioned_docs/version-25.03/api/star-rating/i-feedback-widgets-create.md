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
| `popup_header_text` | String | No | Header text of the rating popup. |
| `popup_comment_callout` | String | No | Text of the comment field. |
| `popup_email_callout` | String | No | Text of the contact-by-email option. |
| `popup_button_callout` | String | No | Text of the submit button. |
| `popup_thanks_message` | String | No | Message shown after submitting. |
| `finalText` | String | No | Final text shown at the end of the flow. |
| `trigger_position` | String | No | Position of the feedback trigger button. |
| `trigger_bg_color` | String | No | Background color of the trigger button. |
| `trigger_font_color` | String | No | Font color of the trigger button. |
| `trigger_button_text` | String | No | Text of the trigger button. |
| `trigger_size` | String | No | Size of the trigger button. |
| `hide_sticker` | Boolean/String | No | Hide the trigger button by default. |
| `contact_enable` | Boolean | No | Allow users to leave contact details. |
| `comment_enable` | Boolean | No | Allow users to leave a comment. |
| `consent` | Boolean | No | Show a consent option. |
| `links` | Array/String | No | JSON array string of consent links. |
| `ratings_texts` | Array/String | No | JSON array string of rating labels. Defaults to five labels from "Very dissatisfied" to "Very Satisfied". |
| `rating_symbol` | String | No | Symbol type used for ratings. |
| `target_page` | String | No | Target page mode. |
| `target_pages` | Array/String | No | JSON array string of pages. Defaults to `["/"]`. |
| `targeting` | Object/String | No | JSON object string with cohort targeting conditions. Used only when the Cohorts plugin is enabled. |
| `logo` | String | No | File name of an uploaded logo. |
| `logoType` | String | No | Logo type. |
| `globalLogo` | Boolean | No | Use the global logo. |
| `internalName` | String | No | Internal name of the widget. |
| `appearance` | Object | No | Appearance settings. |
| `showPolicy` | String | No | Display policy. |

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

HTTP status `201`:

```json
{
  "result": "Successfully created 6256d161e8faa7b449e2dd6b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Confirmation that includes the new widget ID. |

### Error Responses

- `400`

```json
{
  "result": "Invalid params: ..."
}
```

- `400`

```json
{
  "result": {
    "error": "Failed to set cohort",
    "widgetId": "6256d161e8faa7b449e2dd6b"
  }
}
```

- `500`: the database error message, if the widget could not be stored.

Targeting conditions that are not accepted are also returned as `400`. Standard authentication/authorization errors from create validation can also be returned.

## Behavior

- Applies the widget field preprocessors (`target_pages`, `targeting`, `links`, `ratings_texts`, `hide_sticker`, `status`) and validates the payload.
- Stores the widget with type `rating`, a `wv` value of `1`, counters set to `0`, display policy `afterPageLoad`, and all device types (desktop, phone, tablet) enabled.
- If the Cohorts plugin is enabled and `targeting` is given, creates a cohort for the widget and stores its ID on the widget.
- Writes a `feedback_widget_created` system log entry.

### Impact on Other Data

- Adds one widget to `countly.feedback_widgets`.
- May create a cohort in `countly.cohorts`.

## Related Endpoints

- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - Remove Widget](i-feedback-widgets-remove.md)
- [Star Rating - Toggle Widget Status](i-feedback-widgets-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget storage | Inserts the widget document. |
| `countly.cohorts` | Targeting cohorts | May create a cohort (when cohorts plugin enabled). |
| `countly.systemlogs` | Audit trail | Receives `feedback_widget_created`. |

</details>
