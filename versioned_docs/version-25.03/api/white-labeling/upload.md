---
sidebar_label: "Upload Assets"
keywords:
  - "/i/whitelabeling/upload"
  - "upload"
  - "whitelabeling"
last_update:
  date: "2026-02-16"
---

# White Labeling - Upload Assets

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/whitelabeling/upload
```

## Overview

Uploads branding images used by White Labeling settings (pre-login logo, sidebar logo, favicon).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Global Plugins: `Update` permission (global-level).

## Request Parameters

Multipart form-data with one file field:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `prelogo` | File | Conditional | Pre-login logo (`png`, `gif`, `jpeg`) |
| `stopleftlogo` | File | Conditional | Sidebar logo (`png`, `gif`, `jpeg`) |
| `favicon` | File | Conditional | Favicon (`png`, `gif`, `x-icon`) |

## Examples

```bash
curl -X POST "https://your-server.com/i/whitelabeling/upload?api_key=YOUR_API_KEY" \
  -F "prelogo=@./brand-login.png"
```

```bash
curl -X POST "https://your-server.com/i/whitelabeling/upload?api_key=YOUR_API_KEY" \
  -F "favicon=@./favicon.ico"
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
| `result` | String | Upload status |

### Error Responses

- **HTTP 400** - Invalid file type:
```json
{
  "result": "white-labeling.imagef-error"
}
```

- **HTTP 400** - Invalid image file:
```json
{
  "result": "white-labeling.imagefico-error"
}
```

- **HTTP 400** - File too large:
```json
{
  "result": "white-labeling.image-error"
}
```

## Behavior

- Accepts only the first matching file in this order: `prelogo`, `stopleftlogo`, `favicon`.
- Enforces max file size of 1.5 MB.
- Converts uploaded file to base64 data URI and stores in GridFS bucket `white-labeling`.

## Limitations

- Max file size: 1.5 MB.
- One image is processed per request.

## Related Endpoints

- [White Labeling - Overview](index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.white-labeling.files` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.white-labeling.chunks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
