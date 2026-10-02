---
sidebar_label: "List All Widgets"
keywords:
  - "/o/feedback/widgets"
  - "widgets"
  - "feedback"
last_update:
  date: "2026-03-07"
---

# Star Rating - List All Widgets

## Endpoint

```plaintext
/o/feedback/widgets
```

## Overview

Lists rating widgets, optionally filtered by app and active flag.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | No | Filters widgets by app ID. |
| `is_active` | String | No | Filters by string flag in storage (for example `true`/`false`). |

## Examples

### List widgets for one app

```plaintext
/o/feedback/widgets?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
[
  {
    "_id": "67a3d2f5c1a23b0f4d6c0201",
    "app_id": "6991c75b024cb89cdc04efd2",
    "type": "rating",
    "is_active": "true"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | List of widget documents. |
| `[]` | Object | One widget record. |
| `[].is_active` | String | String status field (`"true"`/`"false"`). |

### Error Responses

- `500`

```json
{
  "result": "database error message"
}
```

Standard authentication/authorization errors from read validation can also be returned.

## Behavior

- Always filters by `type="rating"`.
- Adds optional filters for `is_active` and `app_id` when supplied.
- Returns raw array via raw response body.

## Related Endpoints

- [Star Rating - Get Widget Details](o-feedback-widget.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Widget source | Reads rating widgets for list output. |

</details>
