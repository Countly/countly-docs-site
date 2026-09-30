---
sidebar_label: "Get Widget Details"
keywords:
  - "/o/feedback/widget"
  - "widget"
  - "feedback"
last_update:
  date: "2026-09-30"
---

# Star Rating - Get Widget Details

## Endpoint

```plaintext
/o/feedback/widget
```

## Overview

Returns one widget document by `widget_id`.

## Authentication

This endpoint accepts requests without API authentication parameters.

If you do send `api_key` or `auth_token`, also send `app_id`. The server then checks the user's rights for that app, and without `app_id` it answers `401` with `No app_id provided`.

## Permissions

This endpoint does not enforce role-based feature permission checks.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `widget_id` | String | Yes | Widget ObjectID. |
| `app_id` | String | Only with `api_key` or `auth_token` | ID of the app the widget belongs to. |
| `nfd` | Boolean/String | No | If truthy, increments widget show counter. |

## Examples

### Read widget details

```plaintext
/o/feedback/widget?
  widget_id=67a3d2f5c1a23b0f4d6c0201
```

## Response

### Success Response

```json
{
  "_id": "67a3d2f5c1a23b0f4d6c0201",
  "app_id": "6991c75b024cb89cdc04efd2",
  "type": "rating",
  "status": true,
  "popup_header_text": "Rate this page"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Full widget document. |
| `_id` | String | Widget ID. |
| `status` | Boolean | Active/inactive status flag. |

### Error Responses

- `401`: `api_key` or `auth_token` was sent without `app_id`.

```json
{
  "result": "No app_id provided"
}
```

- `404`: no widget has this `widget_id`, or `widget_id` is missing.

```json
{
  "result": "Widget not found."
}
```

- `500`

```json
{
  "result": "database error message"
}
```

## Behavior

- Converts `widget_id` to ObjectID and loads widget from `feedback_widgets`.
- When `nfd` is set, increments `timesShown` counter asynchronously.

## Related Endpoints

- [Star Rating - List All Widgets](o-feedback-widgets.md)
- [Star Rating - Get Multiple Widgets](o-feedback-multiple-widgets-by-id.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget source | Reads widget by ID and optionally increments `timesShown`. |

</details>
