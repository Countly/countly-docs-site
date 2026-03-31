---
sidebar_label: "Assets - Upload"
---

# Upload asset

## Endpoint

```
/i/content/asset-upload
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Uploads an asset file with compression, thumbnail generation, and GridFS storage.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| assets | File | Yes | Multipart file upload (max 5 MB) |
| name | String | No | Custom filename; defaults to uploaded filename |
| thumbnail | String | No | Data URL thumbnail (for example `data:image/png;base64,...`) |
| tags | String | No | JSON stringified array of tags |
| width | Number | No | Stored as `metadata.dimensions.width` (only if `height` is also provided) |
| height | Number | No | Stored as `metadata.dimensions.height` (only if `width` is also provided) |

## Response

### Success Response

```json
{
  "status": "Success",
  "assetId": "507f1f77bcf86cd799439011"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| status | String | Operation status |
| assetId | String | GridFS object ID of uploaded asset |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Missing app_id"` |
| 400 | `"File Size exceeds 5MB"` |
| 400 | `"Missing file thumbnail"` |
| 400 | `"Asset not found"` |
| 400 | `"The file named {name} could not be added because it already exists."` |
| 400 | Processing/validation error message from upload flow |

## Behavior/Processing

1. Validates request authentication and permissions.
2. Parses optional metadata (`tags`, `width`, `height`).
3. Enforces 5 MB max file size.
4. Compresses image data and generates thumbnail (or uses provided `thumbnail`).
5. Saves file and metadata to GridFS.
6. Returns uploaded `assetId`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | Endpoint data source | ** - GridFS file metadata |
| `countly_fs.content_assets{app_id}.chunks` | Endpoint data source | ** - GridFS binary chunks |

---

## Examples

### Example 1: Upload JPEG

```bash
curl -X POST "https://your-server.com/i/content/asset-upload" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=5be987d7b93798516eb5289a" \
  -F "assets=@banner.jpg" \
  -F "name=campaign_banner_v1" \
  -F 'tags=["campaign","banner"]'
```

### Example 2: Upload PNG With Dimensions

```bash
curl -X POST "https://your-server.com/i/content/asset-upload" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=5be987d7b93798516eb5289a" \
  -F "assets=@logo.png" \
  -F "name=company_logo" \
  -F 'tags=["branding","logo"]' \
  -F "width=1024" \
  -F "height=512"
```

## Limitations

- Max file size: **5 MB**.
- Compression handling is implemented for JPEG and PNG inputs.
- Filenames must be unique within the app-specific GridFS bucket.
- Auto thumbnail max size is 400 × 400.

## Related Endpoints

- [Assets - Read](assets-read.md): List assets
- [Assets - Update](assets-update.md): Update metadata
- [Assets - Delete](assets-delete.md): Delete an asset

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
