---
sidebar_label: "Content Blocks - Read"
keywords:
  - "/o/content"
  - "content"
---

# Retrieve content blocks

## Endpoint

```
/o/content
/o/content/by-id
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves content blocks. Use `/o/content` to list blocks for an app, and `/o/content/by-id` to fetch one block.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| _id | String | Yes for `/o/content/by-id` | Content block ObjectID |

## Response

### Success Response

List response (`/o/content`):

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "app": "5be987d7b93798516eb5289a",
    "type": "modal",
    "blocks": [],
    "details": {
      "title": "Welcome Modal",
      "created": 1567474533960,
      "updated": 1567474533960,
      "creatorId": "5d4472152de8f07336f3b100",
      "favorite": false,
      "creator": "Jane Doe"
    }
  }
]
```

Single-item response (`/o/content/by-id`):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "app": "5be987d7b93798516eb5289a",
  "type": "modal",
  "blocks": [],
  "details": {
    "title": "Welcome Modal",
    "created": 1567474533960,
    "updated": 1567474533960,
    "creatorId": "5d4472152de8f07336f3b100",
    "favorite": false
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| _id | String | Content block ObjectID |
| app | String | Application identifier |
| type | String | Content type |
| blocks | Array | Block definitions as stored |
| details | Object | Metadata |
| details.title | String | Block title |
| details.created | Number | Creation timestamp |
| details.updated | Number | Update timestamp |
| details.creatorId | String | Creator member ID |
| details.favorite | Boolean | Favorite flag |
| details.creator | String | Creator full name (added in `/o/content` list response) |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Missing _id parameter"` (`/o/content/by-id`) |
| 400 | `"Invalid _id format"` (`/o/content/by-id`) |
| 404 | `"Content not found"` (`/o/content/by-id`) |
| 500 | `"Error"` |

## Behavior/Processing

1. `/o/content` lists blocks, sorted by `details.created` descending.
2. `/o/content` enriches each block with creator full name from `countly.members`.
3. `/o/content/by-id` returns a single block by `_id` and `app`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_blocks` | Endpoint data source | ** - Content block definitions |
| `countly.members` | Endpoint data source | ** - Creator profile lookup for list endpoint |

---

## Examples

### Example 1: List Content Blocks

```text
/o/content?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a
```

### Example 2: Get Content Block by ID

```text
/o/content/by-id?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&_id=5d4472152de8f07336f3b352
```

## Related Endpoints

- [Content Blocks - Create](blocks-create.md): Create content blocks
- [Content Blocks - Update](blocks-update.md): Update content blocks
- [Content Blocks - Delete](blocks-delete.md): Delete content blocks

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
