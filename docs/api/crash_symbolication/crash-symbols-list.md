---
sidebar_label: "List Symbols"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-04-18"
---

# List symbols

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=crash_symbols
```

## Overview

Returns all uploaded symbol documents for the selected app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `crash_symbols` |
| `app_id` | String | Yes | Application identifier |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: List symbols

```text
/o?method=crash_symbols&app_id=5f9c8a3b4d1e2a001f3b4567&api_key=YOUR_API_KEY
```

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

## Behavior

- Requires `Read` permission on the `crashes` feature.
- Reads all documents from `app_crashsymbols{app_id}`.
- Sorts symbols by `_id` ascending before returning them.
- Does not apply pagination, search, or platform/build filters in this handler.
- If the collection read fails or returns no rows, the handler returns an empty array.
- Returned documents are not projected; any stored metadata fields on the symbol document can be present.

## Related Endpoints

- [Add Symbol](crash-symbols-add.md)
- [Edit Symbol](crash-symbols-edit.md)
- [Remove Symbol](crash-symbols-remove.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes.*` | Crashes feature defaults | Crash-symbol data retrieval and filtering behavior. | Changes to crash settings can alter which crash-symbol records are returned. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
