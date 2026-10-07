---
sidebar_label: "Remove"
keywords:
  - "/i/crash_symbols/remove_symbol"
  - "remove_symbol"
  - "crash_symbols"
last_update:
  date: "2026-02-16"
---

# Remove symbol

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crash_symbols/remove_symbol
```

## Overview

Deletes a symbol document and its stored file(s).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Delete` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application identifier |
| `id` | String | Yes | Symbol document ID |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Remove symbol

```text
/i/crash_symbols/remove_symbol?api_key=YOUR_API_KEY&app_id=5f9c8a3b4d1e2a001f3b4567&id=65c5e0732c5f5300121a0020
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Operation result |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing id" }` |
| 404 | `{ "result": "Symbol file data <id> not found" }` |
| 500 | `{ "result": "Error when fetching symbol file data with id <id>" }` |
| 500 | `{ "result": "Error removing symbol file data" }` |

## Behavior

1. Loads symbol doc to resolve single-file vs multi-file storage keys.
2. Deletes all related files from symbol storage.
3. Removes metadata document from app symbol collection.

## Related Endpoints

- [List Symbols](crash-symbols-list.md)
- [Add Symbol](crash-symbols-add.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
