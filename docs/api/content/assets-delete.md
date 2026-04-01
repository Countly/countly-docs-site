---
sidebar_label: "Assets - Delete"
keywords:
  - "/i/content/asset-delete"
  - "asset-delete"
  - "content"
---

# Delete asset

## Endpoint

```
/i/content/asset-delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes an uploaded asset from GridFS storage.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Delete` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| asset_id | String | Yes | GridFS ObjectID of the asset to delete |

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
| result | String | Success confirmation |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Missing asset_id or app_id"` |
| 400 | `"There is an error while deleting the asset"` |
| 400 | `"Invalid request"` |

## Behavior/Processing

1. Validates request authentication and permissions.
2. Verifies `asset_id` and `app_id` are present.
3. Deletes the file from GridFS.
4. Returns success.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | Endpoint data source | ** - GridFS file metadata (deleted) |
| `countly_fs.content_assets{app_id}.chunks` | Endpoint data source | ** - GridFS binary chunks (deleted) |

---

## Examples

### Example 1: Delete an Asset

```text
/i/content/asset-delete?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011
```

## Limitations

- Deletion is permanent.
- This endpoint does not validate whether the asset is still referenced by content blocks.

## Related Endpoints

- [Assets - Read](assets-read.md): List assets
- [Assets - Upload](assets-upload.md): Upload an asset
- [Assets - Update](assets-update.md): Update asset metadata

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
