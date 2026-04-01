---
sidebar_label: "Content Blocks - Delete"
keywords:
  - "/i/content/delete"
  - "delete"
  - "content"
---

# Delete content block

## Endpoint

```
/i/content/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a content block by ID.

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
| _id | String | Yes | Content block ObjectID |

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

## Behavior/Processing

1. Validates request authentication and permissions.
2. If journey engine is enabled, checks whether content is used in journey definitions.
3. Deletes matching document by `_id` and `app`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_blocks` | Endpoint data source | ** - Content block definitions |
| `countly.journey_definition` | Endpoint data source | ** and related Journey Engine collections - Referenced indirectly when usage checks run |

---

## Examples

### Example 1: Delete Content Block

```text
/i/content/delete?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&_id=5d4472152de8f07336f3b352
```

## Related Endpoints

- [Content Blocks - Read](blocks-read.md): Retrieve content blocks
- [Content Blocks - Create](blocks-create.md): Create content blocks
- [Content Blocks - Update](blocks-update.md): Update content blocks

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
