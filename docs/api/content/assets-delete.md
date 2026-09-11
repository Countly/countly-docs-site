---
sidebar_label: "Assets - Delete"
keywords:
  - "/i/content/asset-delete"
  - "asset-delete"
  - "content"
last_update:
  date: "2026-02-16"
---

# Delete asset

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/content/asset-delete
```

## Overview

Deletes an uploaded asset from GridFS storage.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Delete` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| asset_id | String | Yes | GridFS ObjectID of the asset to delete |

## Examples

### Example 1: Delete an Asset

```text
/i/content/asset-delete?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011
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
| result | String | Success confirmation |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Missing asset_id or app_id"` |
| 400 | `"There is an error while deleting the asset"` |
| 400 | `"Invalid request"` |

## Behavior

1. Validates request authentication and permissions.
2. Verifies `asset_id` and `app_id` are present.
3. Deletes the file from GridFS.
4. Returns success.

## Limitations

- Deletion is permanent.
- This endpoint does not validate whether the asset is still referenced by content blocks.

## Related Endpoints

- [Assets - Read](assets-read.md): List assets
- [Assets - Upload](assets-upload.md): Upload an asset
- [Assets - Update](assets-update.md): Update asset metadata

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | Endpoint data source | ** - GridFS file metadata (deleted) |
| `countly_fs.content_assets{app_id}.chunks` | Endpoint data source | ** - GridFS binary chunks (deleted) |

</details>
