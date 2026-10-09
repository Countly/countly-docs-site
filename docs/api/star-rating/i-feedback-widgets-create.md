---
sidebar_label: "Create Widget"
keywords:
  - "/i/feedback/widgets/create"
  - "create"
  - "feedback"
  - "widgets"
last_update:
  date: "2026-10-09"
---

# Star Rating - Create Widget

## Endpoint

```plaintext
/i/feedback/widgets/create
```

## Overview

Creates a new star-rating widget.

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
| `status` | Boolean/String | Yes | Active flag for the widget. |
| `popup_header_text` | String | No | Header text of the feedback popup. |
| `popup_comment_callout` | String | No | Text of the comment field. |
| `popup_email_callout` | String | No | Text of the "contact me by e-mail" option. |
| `popup_button_callout` | String | No | Text of the popup button. |
| `popup_thanks_message` | String | No | Text of the thank-you message. |
| `trigger_position` | String | No | Position of the feedback trigger button. |
| `trigger_size` | String | No | Size of the feedback trigger button. |
| `trigger_bg_color` | String | No | Background color of the trigger button. |
| `trigger_font_color` | String | No | Font color of the trigger button. |
| `trigger_button_text` | String | No | Text of the trigger button. |
| `hide_sticker` | Boolean/String | No | Hide the trigger button by default. |
| `target_pages` | Array/String | No | JSON array string of pages to show the widget on (fallback `["/"]`). |
| `target_page` | String | No | Target page setting. |
| `targeting` | Object/String | No | JSON object string with targeting conditions. |
| `links` | Array/String | No | JSON array string of consent links. A link whose `linkValue` does not start with `http://` or `https://` is saved with an empty `linkValue`. |
| `consent` | Boolean | No | Consent flag. |
| `finalText` | String | No | Final text of the widget. |
| `contact_enable` | Boolean | No | Enable the contact option. |
| `comment_enable` | Boolean | No | Enable the comment field. |
| `ratings_texts` | Array/String | No | JSON array string of rating labels. Defaults to five labels from "Very dissatisfied" to "Very Satisfied". |
| `rating_symbol` | String | No | Symbol used for ratings. |
| `logo` | String | No | Logo file name. |
| `logoType` | String | No | Logo type. |
| `globalLogo` | Boolean | No | Use the global logo. |
| `internalName` | String | No | Internal widget name. |
| `appearance` | Object | No | Appearance settings. |
| `showPolicy` | String | No | Show policy setting. |

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

HTTP status `201`.

```json
{
  "result": "Successfully created 6256d161e8faa7b449e2dd6b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Successfully created` followed by the ID of the new widget. |

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

- `500`

The database error message is returned in `result`.

Standard authentication/authorization errors from create validation can also be returned.

## Behavior

- Applies the same field preprocessing as [Edit Widget](i-feedback-widgets-edit.md), then validates the payload.
- New widgets start with zero shown count, zero ratings, and the `afterPageLoad` show policy.
- If the Cohorts plugin is enabled and `targeting` is provided, a cohort is created for the widget and linked to it.

### Impact on Other Data

- Inserts one widget into `countly.feedback_widgets`.
- May create a cohort in `countly.cohorts` (when the Cohorts plugin is enabled).
- Writes an audit event to system logs.

## Related Endpoints

- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)
- [Star Rating - Remove Widget](i-feedback-widgets-remove.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)
