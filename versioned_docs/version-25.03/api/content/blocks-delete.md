---
sidebar_label: "Content Blocks - Delete"
keywords:
  - "/i/content/delete"
  - "delete"
  - "content"
last_update:
  date: "2026-02-16"
---

# Delete content block

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/content/delete
```

## Overview

Deletes a content block by ID.

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
| _id | String | Yes | Content block ObjectID |

## Examples

### Example 1: Delete Content Block

```text
/i/content/delete?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&_id=5d4472152de8f07336f3b352
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | Success confirmation (`"Success"`). |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{"result":"content-is-used-in-a-journey"}` |
| 400 | `{"result":"Invalid request"}` |
| 500 | `{"result":"Error"}` |

## Behavior

1. Validates request authentication and permissions.
2. If journey engine is enabled, checks whether content is used in journey definitions.
3. Deletes matching document by `_id` and `app`.

## Related Endpoints

- [Content Blocks - Read](blocks-read.md): Retrieve content blocks
- [Content Blocks - Create](blocks-create.md): Create content blocks
- [Content Blocks - Update](blocks-update.md): Update content blocks

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_blocks` | Endpoint data source | ** - Content block definitions |
| `countly.journey_definition` | Endpoint data source | ** and related Journey Engine collections - Referenced indirectly when usage checks run |

</details>
