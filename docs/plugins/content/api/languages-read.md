---
sidebar_label: "Languages - Read"
---

# Get eligible languages

## Endpoint

```
/o/content/langs
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns language distribution for app users and optional content-block translation languages.

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
| content_id | String | No | Content block ID; when set, translation languages found in this block are merged into the result |

## Response

### Success Response

```json
{
  "default": "en",
  "eligibleLanguages": [
    {
      "code": "en",
      "name": "English",
      "percentage": 64
    },
    {
      "code": "es",
      "name": "Spanish",
      "percentage": 36
    },
    {
      "code": "de",
      "name": "German",
      "percentage": "~"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| default | String | Default language (member language or `en`) |
| eligibleLanguages | Array | Languages list |
| eligibleLanguages[].code | String | Language code |
| eligibleLanguages[].name | String | Language name |
| eligibleLanguages[].percentage | Number/String | User distribution percentage, or `"~"` when language is added from content translations only |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | Error message from language processing (for example `"appId is required"`) |

## Behavior/Processing

1. Calculates language distribution from app user language values.
2. If `content_id` is provided, extracts translation language codes from the content block structure and merges missing languages into result.
3. Returns `default` plus `eligibleLanguages`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{app_id}` | Endpoint data source | ** - Language distribution source |
| `countly.content_blocks` | Endpoint data source | ** - Read only when `content_id` is provided |

---

## Examples

### Example 1: Get Eligible Languages for App

```text
/o/content/langs?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a
```

### Example 2: Get Eligible Languages for Specific Content Block

```text
/o/content/langs?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&content_id=5d4472152de8f07336f3b352
```

## Related Endpoints

- [Content Blocks - Read](blocks-read.md): Retrieve content blocks
- [SDK Read - Content Delivery](delivery-retrieve.md): Fetch queued content

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
