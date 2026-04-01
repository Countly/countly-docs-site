---
sidebar_label: "Upload Logo"
keywords:
  - "/i/feedback/upload"
  - "upload"
  - "feedback"
---

# Surveys - Upload Logo

## Endpoint

```text
/i/feedback/upload
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Uploads survey branding images and stores them in GridFS.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Global Plugins: `Update` permission.

## Request Parameters

Multipart form-data:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `feedback_logo` | File | Conditional | Primary feedback logo key |
| `file` | File | Conditional | Generic upload key when `name` is provided |
| `name` | String | Conditional | Target file key for generic upload |

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

- **HTTP 400** - File too large or invalid:
```json
{
  "result": "feedback.image-error"
}
```

- **HTTP 400** - File read/processing issue:
```json
{
  "result": "feedback.imagee-error"
}
```

## Behavior/Processing

- Maximum file size: 1.5 MB.
- Converts file to base64 data URI and writes to GridFS bucket `feedback`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.feedback.files` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.feedback.chunks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```bash
curl -X POST "https://your-server.com/i/feedback/upload?api_key=YOUR_API_KEY" \
  -F "feedback_logo=@./survey-logo.png"
```

## Limitations

- Only image file inputs are supported.
- One file is processed per request.

## Related Endpoints

- [Surveys - Create Survey](survey-create.md)
- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Create NPS](nps-create.md)
- [Surveys - Edit NPS](nps-edit.md)

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
