---
sidebar_label: "Upload Assets"
keywords:
  - "/i/whitelabeling/upload"
  - "upload"
  - "whitelabeling"
---

# White Labeling - Upload Assets

## Endpoint

```text
/i/whitelabeling/upload
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Uploads branding images used by White Labeling settings (pre-login logo, sidebar logo, favicon).

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

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

## Behavior/Processing

- Accepts only the first matching file in this order: `prelogo`, `stopleftlogo`, `favicon`.
- Enforces max file size of 1.5 MB.
- Converts uploaded file to base64 data URI and stores in GridFS bucket `white-labeling`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.white-labeling.files` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.white-labeling.chunks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```bash
curl -X POST "https://your-server.com/i/whitelabeling/upload?api_key=YOUR_API_KEY" \
  -F "prelogo=@./brand-login.png"
```

```bash
curl -X POST "https://your-server.com/i/whitelabeling/upload?api_key=YOUR_API_KEY" \
  -F "favicon=@./favicon.ico"
```

## Limitations

- Max file size: 1.5 MB.
- One image is processed per request.

## Related Endpoints

- [White Labeling - Overview](index.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
