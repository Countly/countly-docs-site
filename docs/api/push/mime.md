---
sidebar_label: "MIME Type Validation"
keywords:
  - "/o/push/mime"
  - "mime"
  - "push"
  - "message"
last_update:
  date: "2026-04-09"
---

# Push - MIME Type Validation

## Endpoint

```plaintext
/o/push/mime
```

## Overview

Validates a media URL for push attachments and returns resolved URL, MIME type, and media size.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `push` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID used by permission validation. |
| `url` | String | Yes | HTTP/HTTPS media URL to validate. |

## Examples

### Validate attachment URL

```plaintext
/o/push/mime?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  url=https://cdn.example.com/assets/promo.png
```

## Response

### Success Response

```json
{
  "media": "https://cdn.example.com/assets/promo.png",
  "mediaMime": "image/png",
  "mediaSize": 2458624
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `media` | String | Final resolved URL used after redirects. |
| `mediaMime` | String | MIME type from response headers. |
| `mediaSize` | Number | Content length in bytes. |

### Error Responses

- `400`

```json
{
  "errors": [
    "url is required"
  ]
}
```

- `400`

```json
{
  "errors": [
    "Invalid status 404"
  ]
}
```

- `400`

```json
{
  "errors": [
    "No content-type while HEADing the url"
  ]
}
```

- `400`

```json
{
  "errors": [
    "No content-length while HEADing the url"
  ]
}
```

- `400`

```json
{
  "errors": [
    "Media mime type \"video/avi\" is not supported"
  ]
}
```

- `400`

```json
{
  "errors": [
    "Media size (73400320) is too large"
  ]
}
```

## Behavior

- Sends HEAD request first.
- Follows single redirect hop explicitly when status is `301` or `302` and `location` exists.
- Fails when final status is not `200`.
- Requires both `content-type` and `content-length` headers.
- If HEAD has no content-length, retries with GET and checks length again.
- Validates MIME type against allowed push media MIME list.
- Validates size against push media max size limit (`DEFAULTS.max_media_size`).

## Related Endpoints

- [Push - Message Create](message-create.md)
- [Push - Message Update](message-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
