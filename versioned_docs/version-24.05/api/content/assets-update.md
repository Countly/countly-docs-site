---
sidebar_label: "Assets - Update"
keywords:
  - "/i/content/asset-update"
  - "asset-update"
  - "content"
last_update:
  date: "2026-02-16"
---

# Update asset metadata

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/content/asset-update
```

## Overview

Updates asset filename and/or tags without re-uploading file content.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Examples

### Example 1: Update Filename

```text
/i/content/asset-update?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011&asset_name=homepage_banner_v2
```

### Example 2: Update Tags

```text
/i/content/asset-update?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&asset_id=507f1f77bcf86cd799439011&asset_tags=["campaign","spring-2026"]
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
| 400 | `"File parameters are missing"` |
| 400 | `"There is an error while updating asset! Please check error logs."` |
| 400 | `"There is an error while updating asset. ..."` |

## Behavior

1. Validates request authentication and permissions.
2. Requires `asset_id`, `app_id`, and at least one of `asset_name` / `asset_tags`.
3. Parses `asset_tags` when provided.
4. Updates the GridFS file metadata document.

## Related Endpoints

- [Assets - Read](assets-read.md): List assets
- [Assets - Upload](assets-upload.md): Upload an asset
- [Assets - Delete](assets-delete.md): Delete an asset

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | Endpoint data source | ** - GridFS file metadata |

</details>
