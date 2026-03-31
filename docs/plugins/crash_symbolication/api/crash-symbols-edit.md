---
sidebar_label: "Edit"
---

# Edit symbol

## Endpoint

```
/i/crash_symbols/edit_symbol
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates symbol metadata and optionally replaces symbol files.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application identifier |
| `symbol_id` | String | Yes | Symbol document ID |
| `platform` | String | No | Updated platform |
| `build` | String | No | Updated build (string, comma-list, or JSON array string) |
| `note` | String | No | Updated note |
| `symbols` | File | No | Replace with one file |
| `symbols[]` | File Array | No | Replace/update JavaScript multi-file set |
| `keepSymbols[]` | String Array | No | JSON strings of files to keep for JavaScript multi-file symbols |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

When nothing changes:

```json
{
  "result": "Nothing to update"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Operation result |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing Symbol ID" }` |
| 400 | `{ "result": "This file extension is not allowed: ..." }` |
| 400 | `{ "result": "Multiple symbol files are only allowed for javascript platform" }` |
| 400 | `{ "result": "The number of files uploaded exceeds the maximum allowed" }` |
| 400 | `{ "result": "These file extensions are not allowed: ..." }` |
| 400 | `{ "result": "Could not save symbol file data" }` |
| 404 | `{ "result": "Symbol file document <id> not found" }` |
| 500 | `{ "result": "Error when getting symbol file document" }` |
| 500 | `{ "result": "Error when creating symbol file directory" }` |
| 500 | `{ "result": "Error saving symbol files" }` |

## Behavior/Processing

- Supports both single-file and JavaScript multi-file replacement.
- `keepSymbols[]` preserves selected existing JS files while adding new ones.
- Deletes removed files from symbol storage after successful update.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Update metadata only

```text
/i/crash_symbols/edit_symbol?api_key=YOUR_API_KEY&app_id=5f9c8a3b4d1e2a001f3b4567&symbol_id=65c5e0732c5f5300121a0020&note=Updated production symbols&build=1.4.3
```

### Example 2: Replace JavaScript files and keep one existing file

```bash
curl -X POST "https://your-server.com/i/crash_symbols/edit_symbol" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=5f9c8a3b4d1e2a001f3b4567" \
  -F "symbol_id=65c5e0732c5f5300121a0020" \
  -F "platform=javascript" \
  -F 'keepSymbols[]={"name":"bundle.js.map","id":"tmp_123","size":1048576}' \
  -F "symbols[]=@vendor.js.map"
```

## Related Endpoints

- [Add Symbol](crash-symbols-add.md)
- [Remove Symbol](crash-symbols-remove.md)
- [List Symbols](crash-symbols-list.md)

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
