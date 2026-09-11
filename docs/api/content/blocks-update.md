---
sidebar_label: "Content Blocks - Update"
keywords:
  - "/i/content/save"
  - "save"
  - "content"
last_update:
  date: "2026-02-16"
---

# Update content block

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/content/save
```

## Overview

Updates an existing content block when `content_id` is provided.

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
| content_id | String | Yes | Content block ObjectID to update |
| type | String | Yes | Content block type |
| blocks | String | Yes | JSON stringified array of block objects |
| details | String | Yes | JSON stringified object with metadata (`created`, `creatorId`, `favorite`, `title`) |

## Examples

### Example 1: Update Request

```text
/i/content/save?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&content_id=5d4472152de8f07336f3b352&type=modal&blocks=<JSON_STRING>&details=<JSON_STRING>
```

`blocks` object before stringifying:

```json
[
  {
    "layout": "modal",
    "elements": {
      "title": {
        "text": "Updated Welcome"
      }
    }
  }
]
```

`details` object before stringifying:

```json
{
  "title": "Updated Welcome Modal",
  "creatorId": "5d4472152de8f07336f3b100",
  "favorite": true,
  "created": 1567474533960
}
```

## Response

### Success Response

```json
{
  "status": "Success",
  "contentId": "507f1f77bcf86cd799439011"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| status | String | Operation status |
| contentId | String | Updated content block ID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | JSON parsing error or `"Invalid request"` |
| 400 | Validation/processing error message (`e.message`) |
| 500 | `"Error"` |

## Behavior

1. Uses  branch when `content_id` is present.
2. Parses `blocks` and `details` from JSON strings.
3. Updates the document by `_id` + `app`.
4. Uses `upsert: true` in update operation.
5. Returns `status` and `contentId`.

## Limitations

- Entire `blocks` payload is replaced by provided value.
- Update path is implemented with upsert behavior.

## Related Endpoints

- [Content Blocks - Read](blocks-read.md): Retrieve content blocks
- [Content Blocks - Create](blocks-create.md): Create a content block
- [Content Blocks - Delete](blocks-delete.md): Delete a content block

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_blocks` | Endpoint data source | ** - Content block definitions |

</details>
