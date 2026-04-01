---
sidebar_label: "Add"
keywords:
  - "/i/crash_symbols/add_symbol"
  - "add_symbol"
  - "crash_symbols"
---

# Add symbol

## Endpoint

```
/i/crash_symbols/add_symbol
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Uploads a symbol/mapping file for dashboard-managed symbolication.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application identifier |
| `platform` | String | Yes | Platform (`android`, `ios`, `javascript`, `android_native`, etc.) |
| `build` | String | Yes | Build identifier; supports comma-separated list or JSON array string |
| `symbols` | File | Yes for single-file uploads | Uploaded file |
| `symbols[]` | File Array | Yes for JavaScript multi-file uploads | Multiple source map files |
| `note` | String | No | Note saved in symbol document |
| `sym_tool_ver` | String | No | Symbol tool version |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Response

### Success Response

```json
{
  "message": "Success",
  "_id": "65c5e0732c5f5300121a0020"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `message` | String | Success message |
| `_id` | String | Created symbol document ID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing platform" }` |
| 400 | `{ "result": "Missing build information" }` |
| 400 | `{ "result": "Missing symbols/mapping file" }` |
| 400 | `{ "result": "Multiple symbol files are only allowed for javascript platform" }` |
| 400 | `{ "result": "The number of files uploaded exceeds the maximum allowed" }` |
| 400 | `{ "result": "These file extensions are not allowed: ..." }` |
| 400 | `{ "result": "This file extension is not allowed: ..." }` |
| 400 | `{ "result": "Could not save symbol file data" }` |
| 500 | `{ "result": "Error creating symbol file directory" }` |
| 500 | `{ "result": "Error saving symbol files" }` |

## Behavior/Processing

1. Validates platform/build and uploaded file(s).
2. Allows multiple files only for JavaScript platform.
3. Enforces max file count via `crashes.max_symbol_file` (default `10`).
4. Saves files into `crash_symbols` storage and metadata into app symbol collection.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Upload single Android mapping file

```bash
curl -X POST "https://your-server.com/i/crash_symbols/add_symbol" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=5f9c8a3b4d1e2a001f3b4567" \
  -F "platform=android" \
  -F "build=1.4.2" \
  -F "symbols=@mapping.txt" \
  -F "note=Android production mapping"
```

### Example 2: Upload JavaScript source maps

```bash
curl -X POST "https://your-server.com/i/crash_symbols/add_symbol" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=5f9c8a3b4d1e2a001f3b4567" \
  -F "platform=javascript" \
  -F "build=web-2026.02.15" \
  -F "symbols[]=@bundle.js.map" \
  -F "symbols[]=@vendor.js.map"
```

## Limitations

- Allowed extensions: `.gz`, `.map`, `.txt`, `.zip`.
- Multiple file upload is JavaScript-only.
- Max file count for JavaScript is config-driven (`crashes.max_symbol_file`, default `10`).

## Related Endpoints

- [List Symbols](crash-symbols-list.md)
- [Edit Symbol](crash-symbols-edit.md)
- [Upload Symbol (SDK)](crash-symbols-upload.md)

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
