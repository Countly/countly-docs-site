---
sidebar_label: "Upload Logo"
keywords:
  - "/i/feedback/upload"
  - "upload"
  - "feedback"
last_update:
  date: "2026-04-18"
---

# Surveys - Upload Logo

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/feedback/upload
```

## Overview

Uploads survey branding images and stores them in GridFS.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Examples

```bash
curl -X POST "https://your-server.com/i/feedback/upload?api_key=YOUR_API_KEY" \
  -F "feedback_logo=@./survey-logo.png"
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

## Behavior

- Requires `global_plugins` update permission.
- Accepts `feedback_logo` to overwrite the global feedback logo.
- Alternatively accepts generic `file` plus required `name` to write a named file into the feedback GridFS bucket.
- Returns `Missing file: feedback_logo or file` when no usable upload field is present.
- Returns `Missing parameter: name` when `file` is used without `name`.
- Maximum file size is 1.5 MB.
- Converts the file to a base64 data URI and writes it to GridFS bucket `feedback` with `writeMode=overwrite`.

## Limitations

- Only image file inputs are supported.
- One file is processed per request.

## Related Endpoints

- [Surveys - Create Survey](survey-create.md)
- [Surveys - Edit Survey](survey-edit.md)
- [Surveys - Create NPS](nps-create.md)
- [Surveys - Edit NPS](nps-edit.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.feedback.files` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.feedback.chunks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
