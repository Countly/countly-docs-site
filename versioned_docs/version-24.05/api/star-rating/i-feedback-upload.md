---
sidebar_label: "Upload Logo"
keywords:
  - "/i/feedback/upload"
  - "upload"
  - "feedback"
last_update:
  date: "2026-03-07"
---

# Star Rating - Upload Logo

## Endpoint

```plaintext
/i/feedback/upload
```

## Overview

Uploads a star-rating image asset into plugin storage.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `global_plugins` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `feedback_logo` | File | Conditional | Preferred upload field for feedback logo file. |
| `file` | File | Conditional | Generic fallback upload field (used with `name`). |
| `name` | String | Conditional | Required with `file`; used as output file identifier. |

## Examples

### Upload logo as `feedback_logo`

```plaintext
/i/feedback/upload?
  api_key=YOUR_API_KEY
```

Multipart form body:

```text
feedback_logo=@/path/to/logo.png
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
| `result` | String | `Success` when file upload completes. |

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

Standard authentication/authorization errors from update validation can also be returned.

## Behavior

- Endpoint is disabled when Surveys plugin is enabled (`surveysEnabled` branch returns `false`).
- Accepts either `feedback_logo` or fallback `file` + `name` combination.
- Validates MIME (`image/png`, `image/gif`, `image/jpeg`) and extension (`gif|jpeg|jpg|png`).
- Stores image through Countly FS with overwrite mode.

## Limitations

- Only image formats/extensions listed above are accepted.
- Endpoint is unavailable when Surveys plugin is active.

## Related Endpoints

- [Star Rating - Set Widget Logo](i-feedback-logo.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write MongoDB collections directly.

</details>
