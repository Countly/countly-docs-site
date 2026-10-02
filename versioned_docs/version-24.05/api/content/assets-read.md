---
sidebar_label: "Assets - Read"
keywords:
  - "/o/content/assets"
  - "assets"
  - "content"
last_update:
  date: "2026-04-18"
---

# Retrieve all assets

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/content/assets
```

## Overview

Lists uploaded assets and their metadata for the selected app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |

## Examples

### Example 1: List Assets

```text
/o/content/assets?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a
```

## Response

### Success Response

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "filename": "banner_image.jpg",
    "app_id": "5be987d7b93798516eb5289a",
    "uploadDate": 1567474533960,
    "length": 1024000,
    "metadata": {
      "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
      "mimeType": "image/jpeg",
      "dimensions": {
        "width": 1920,
        "height": 1080
      },
      "tags": ["campaign", "banner"]
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| _id | String | Asset ObjectID |
| filename | String | Asset filename |
| app_id | String | Application identifier |
| uploadDate | Number | Upload timestamp in milliseconds |
| length | Number | File size in bytes |
| metadata | Object | File metadata |
| metadata.thumbnail | String | Base64 thumbnail |
| metadata.mimeType | String | MIME type |
| metadata.dimensions | Object | Source dimensions (`width`, `height`) |
| metadata.tags | Array | Tags list |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `"Error"` |

## Behavior

- Requires `Read` permission on the `content` feature.
- Dispatches from `/o/content/assets` based on the `assets` path segment.
- Lists all GridFS files from bucket `content_assets{app_id}`.
- Adds `app_id` from the request to every returned asset object before responding.
- Does not apply pagination, search, tag filtering, or sorting in this handler.
- GridFS list failures return HTTP 500 with `"Error"`.

## Related Endpoints

- [Assets - Upload](assets-upload.md): Upload an asset
- [Assets - Update](assets-update.md): Update asset metadata
- [Assets - Delete](assets-delete.md): Delete an asset

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_fs.content_assets{app_id}.files` | GridFS metadata | Stores file metadata returned by this endpoint. |
| `countly_fs.content_assets{app_id}.chunks` | GridFS chunks | Stores binary asset chunks referenced by the metadata. |

</details>
