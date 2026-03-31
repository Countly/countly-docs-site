---
sidebar_label: "Upload"
---

# Upload symbol (SDK)

## Endpoint

```
/i/crash_symbols/upload_symbol
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Uploads symbol files using `app_key` instead of dashboard member authentication.

## Authentication

- **Authentication method**: `app_key`
- `app_key` is resolved to app, then upload flow reuses the same validations as add-symbol.

## Permissions

- No dashboard feature permission check is applied.
- Access is controlled by valid `app_key`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key |
| `platform` | String | Yes | Platform (`android`, `ios`, `javascript`, etc.) |
| `build` | String | Yes | Build identifier (string, comma-list, or JSON array string) |
| `symbols` | File | Yes for single-file uploads | Uploaded file |
| `symbols[]` | File Array | Yes for JavaScript multi-file uploads | Multiple source map files |
| `sym_tool_ver` | String | No | Symbol tool version (defaults to `unknown` if omitted) |
| `timestamp` | Number | No | Optional upload timestamp input for time init |
| `note` | String | No | Optional note |

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
| 401 | `{ "result": "App does not exist" }` |
| 400 | Same upload validation errors as [Add Symbol](crash-symbols-add.md) |
| 500 | `{ "result": "Error creating symbol file directory" }` |
| 500 | `{ "result": "Error saving symbol files" }` |

## Behavior/Processing

1. Resolves app by `app_key`.
2. Sets default `sym_tool_ver=unknown` when missing.
3. Executes shared upload flow (`handleSymbolFileUpload`).

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: SDK tool upload

```bash
curl -X POST "https://your-server.com/i/crash_symbols/upload_symbol" \
  -F "app_key=YOUR_APP_KEY" \
  -F "platform=ios" \
  -F "build=A1B2C3D4-1234-5678-ABCD-1234567890EF" \
  -F "symbols=@symbols.zip" \
  -F "sym_tool_ver=2.3.0"
```

## Related Endpoints

- [Add Symbol](crash-symbols-add.md)
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
