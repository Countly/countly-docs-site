---
sidebar_label: "Content Blocks - Create"
---

# Create content block

## Endpoint

```
/i/content/save
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a new content block document.

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
| type | String | Yes | Content block type |
| blocks | String | Yes | JSON stringified array of block objects |
| details | String | Yes | JSON stringified object with block metadata |

`details` object keys used by server: `created`, `creatorId`, `favorite`, `title`.
For create flow, server overwrites `details.created` with current timestamp.

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
| contentId | String | Created content block ObjectID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | JSON parsing error or `"Invalid request"` |
| 400 | Validation/processing error message (`e.message`) |
| 500 | `"Error"` |

## Behavior/Processing

1. Parses `blocks` and `details` from JSON strings.
2. Builds document with app/type/blocks/details.
3. Sets `details.updated = Date.now` and `details.created = Date.now` for new record.
4. Inserts into `countly.content_blocks`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_blocks` | Endpoint data source | ** - Content block definitions |

---

## Examples

### Example 1: Minimal Create Request

```text
/i/content/save?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&type=modal&blocks=<JSON_STRING>&details=<JSON_STRING>
```

`blocks` object before stringifying:

```json
[
  {
    "layout": "modal",
    "elements": {
      "title": {
        "text": "Welcome"
      }
    }
  }
]
```

`details` object before stringifying:

```json
{
  "title": "Welcome Modal",
  "creatorId": "5d4472152de8f07336f3b100",
  "favorite": false,
  "created": 0
}
```

### Example 2: Multi-Block Create Request

```text
/i/content/save?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&type=survey&blocks=<JSON_STRING>&details=<JSON_STRING>
```

`blocks` object before stringifying:

```json
[
  {
    "layout": "survey",
    "placement": {
      "small": {
        "position": "center",
        "heightMultiplier": 1,
        "fullScreenOverride": true
      }
    },
    "elements": {
      "steps": {
        "step_1": {
          "elements": {
            "title": {
              "text": "How satisfied are you?",
              "translations": {
                "en": "How satisfied are you?",
                "es": "¿Qué tan satisfecho estás?"
              }
            }
          }
        }
      }
    }
  }
]
```

## Related Endpoints

- [Content Blocks - Read](blocks-read.md): Retrieve content blocks
- [Content Blocks - Update](blocks-update.md): Update a content block
- [Content Blocks - Delete](blocks-delete.md): Delete a content block

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
