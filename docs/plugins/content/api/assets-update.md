---
sidebar_label: "Assets - Update"
---

# Update asset metadata

## Endpoint

```
/i/content/asset-update
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates asset filename and/or tags without re-uploading file content.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| asset_id | String | Yes | GridFS ObjectID of asset to update |
| asset_name | String | No (or asset_tags) | New filename |
| asset_tags | String | No (or asset_name) | JSON stringified array of tags |

At least one of `asset_name` or `asset_tags` must be provided.

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
| 400 | `"File parameters are missing"` |
| 400 | `"There is an error while updating asset! Please check error logs."` |
| 400 | `"There is an error while updating asset. ..."` |

## Behavior/Processing

1. Validates request authentication and permissions.
2. Requires `asset_id`, `app_id`, and at least one of `asset_name` / `asset_tags`.
3. Parses `asset_tags` when provided.
4. Updates the GridFS file metadata document.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | Endpoint data source | ** - GridFS file metadata |

---

## Examples

### Example 1: Update Filename

```text
/i/content/asset-update?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011&asset_name=homepage_banner_v2
```

### Example 2: Update Tags

```text
/i/content/asset-update?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011&asset_tags=["campaign","spring-2026"]
```

## Related Endpoints

- [Assets - Read](assets-read.md): List assets
- [Assets - Upload](assets-upload.md): Upload an asset
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
