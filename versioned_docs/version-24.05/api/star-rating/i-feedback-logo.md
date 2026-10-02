---
sidebar_label: "Set Widget Logo"
keywords:
  - "/i/feedback/logo"
  - "logo"
  - "feedback"
last_update:
  date: "2026-03-07"
---

# Star Rating - Set Widget Logo

## Endpoint

```plaintext
/i/feedback/logo
```

## Overview

Uploads a logo file and returns generated logo filename for widget configuration.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `identifier` | String | Yes | File identifier used as output filename prefix. |
| `logo` | File | No | Image file; if omitted, upload helper still returns success branch. |

## Examples

### Upload widget logo

```plaintext
/i/feedback/logo?
  api_key=YOUR_API_KEY&
  identifier=widget_logo_1
```

Multipart form body:

```text
logo=@/path/to/logo.png
```

## Response

### Success Response

```json
{
  "result": "widget_logo_1.png"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Stored filename (`identifier.ext`) when upload succeeds. |

### Error Responses

- `400`

```json
{
  "result": "Invalid image format. Must be png or jpeg"
}
```

- `400`

```json
{
  "result": "Invalid file extension. Must be .png, .jpg, .gif or .jpeg"
}
```

- `400`

```json
{
  "result": "Failed to upload image"
}
```

Standard authentication/authorization errors from create validation can also be returned.

## Behavior

- Uses shared file-upload helper with same validation rules as upload endpoint.
- Returns `result` as plain filename string through wrapped `result` response.

## Related Endpoints

- [Star Rating - Upload Logo](i-feedback-upload.md)
- [Star Rating - Edit Widget](i-feedback-widgets-edit.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write MongoDB collections directly.

</details>
