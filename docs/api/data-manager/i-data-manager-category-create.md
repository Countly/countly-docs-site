---
sidebar_label: "Category Create"
keywords:
  - "/i/data-manager/category/create"
  - "create"
  - "data-manager"
  - "category"
last_update:
  date: "2026-02-17"
---

# /i/data-manager/category/create

## Endpoint

```plaintext
/i/data-manager/category/create
```

## Overview

Creates one or more category documents for the selected app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: `data_manager` `Create`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | Target app ID. |
| `categories` | JSON String (Array) | Yes | JSON-stringified array of category names. |

### `categories` Array Structure

| Element Type | Required | Description |
|---|---|---|
| String | Yes | Category name to create. |

Example:

```json
["Revenue", "Engagement", "System"]
```

## Examples

### Create multiple categories

```plaintext
/i/data-manager/category/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&categories=["Revenue","Engagement"]
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | String | Raw string `Success`. |

### Error Responses

`500 Internal Server Error`

```json
{
  "result": "Error"
}
```

`400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

`401 Unauthorized`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Validates create access for `data_manager`.
- Parses `categories` JSON string.
- Rejects empty category array by throwing and returning `500 {"result":"Error"}`.
- Inserts documents into category collection using `{ app, name }` shape.

### Impact on Other Data

- Inserts new category records in `countly.event_categories`.

## Limitations

- `categories` must be valid JSON and non-empty.
- Duplicate category names are not deduplicated by this handler.

## Related Endpoints

- [Data Manager - Categories Read](o-data-manager-category.md)
- [Data Manager - Category Edit](i-data-manager-category-edit.md)
- [Data Manager - Category Delete](i-data-manager-category-delete.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-category-category` | Categories are accepted for insertion | `{ categories: [ ... ] }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission validation | Reads member record by `api_key` or `auth_token` to verify create access. |
| `countly.apps` | App context validation | Reads app record for the requested `app_id` during access validation. |
| `countly.event_categories` | Stores per-app event category definitions | Inserts one document per submitted category name. |
| `countly.systemlogs` | Stores audit trail for management actions | Receives audit entry dispatched for category creation. |

</details>
