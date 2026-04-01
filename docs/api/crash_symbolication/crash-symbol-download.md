---
sidebar_label: "Download"
keywords:
  - "/o"
  - "o"
---

# Download symbol file

## Endpoint

```
/o?method=download_symbol
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Downloads a stored symbol file. For JavaScript multi-file symbol documents, `file_id` is required.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `download_symbol` |
| `app_id` | String | Yes | Application identifier |
| `symbol_id` | String | Yes | Symbol document ID |
| `file_id` | String | Conditional | Required when symbol doc uses `filenames[]` |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Response

### Success Response

Returns raw binary file stream with headers:
- `Content-Type: application/octet-stream`
- `Content-Disposition: attachment;filename=<symbol file>`

### Response Fields

| Field | Type | Description |
|---|---|---|
| Binary stream | File | Downloaded symbol file bytes |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing parameter \"symbol_id\"" }` |
| 400 | `{ "result": "Missing parameter \"file_id\"" }` |
| 400 | `{ "result": "Parameter \"file_id\" is not allowed for single-file symbols" }` |
| 404 | `{ "result": "Symbol file document <id> not found" }` |
| 404 | `{ "result": "Symbol file for given \"file_id\" not found" }` |
| 404 | `{ "result": "Cannot find symbol file" }` |
| 500 | `{ "result": "Error getting symbol file document <id>" }` |
| 500 | `{ "result": "Error outputting stream" }` |

## Behavior/Processing

1. Loads symbol metadata from app symbol collection.
2. Resolves single-file (`filename`) or multi-file (`filenames`) storage key.
3. Streams file from `crash_symbols` bucket.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Download single-file symbol

```text
/o?method=download_symbol&app_id=5f9c8a3b4d1e2a001f3b4567&symbol_id=65c5dc9e2c5f5300121a0001&api_key=YOUR_API_KEY
```

### Example 2: Download one file from JavaScript multi-file symbol

```text
/o?method=download_symbol&app_id=5f9c8a3b4d1e2a001f3b4567&symbol_id=65c5dc9e2c5f5300121a0001&file_id=tmp_1739624449899&api_key=YOUR_API_KEY
```

## Related Endpoints

- [List Symbols](crash-symbols-list.md)
- [Add Symbol](crash-symbols-add.md)

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
