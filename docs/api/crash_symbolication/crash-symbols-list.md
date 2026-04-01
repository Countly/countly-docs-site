---
sidebar_label: "List Symbols"
keywords:
  - "/o"
  - "o"
---

# List symbols

## Endpoint

```
/o?method=crash_symbols
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns all uploaded symbol documents for the selected app.

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
| `method` | String | Yes | Must be `crash_symbols` |
| `app_id` | String | Yes | Application identifier |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes.*` | Crashes feature defaults | Crash-symbol data retrieval and filtering behavior. | Changes to crash settings can alter which crash-symbol records are returned. |

## Response

### Success Response

```json
[
  {
    "_id": "65c5dc9e2c5f5300121a0001",
    "platform": "android",
    "build": "1.4.2",
    "note": "Production mapping file",
    "ts": 1739624452,
    "filename": "mapping.txt"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Symbol document ID |
| `platform` | String | Platform (`android`, `ios`, `javascript`, `android_native`, etc.) |
| `build` | String/Array | Build identifier(s) matched during symbolication |
| `note` | String | Optional note |
| `ts` | Number | Upload timestamp (unix seconds) |
| `filename` | String | Single-file symbol name |
| `filenames` | Array | Multi-file symbols metadata (`name`, `id`, `size`) for JavaScript |
| `sym_tool_ver` | String | Symbol tool version when uploaded via SDK flow |

### Error Responses

| HTTP Status | Response |
|---|---|
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: List symbols

```text
/o?method=crash_symbols&app_id=5f9c8a3b4d1e2a001f3b4567&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Add Symbol](crash-symbols-add.md)
- [Edit Symbol](crash-symbols-edit.md)
- [Remove Symbol](crash-symbols-remove.md)

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
