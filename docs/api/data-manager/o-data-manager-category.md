---
sidebar_label: "Categories Read"
keywords:
  - "/o/data-manager/category"
  - "category"
  - "data-manager"
last_update:
  date: "2026-02-17"
---

# /o/data-manager/category

## Endpoint

```plaintext
/o/data-manager/category
```

## Overview

Returns all event categories configured for the selected app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: `data_manager` `Read`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | Target app ID. |

## Examples

### Read app categories

```plaintext
/o/data-manager/category?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID
```

## Response

### Success Response

```json
[
  {
    "_id": "65f0b7d9a1b2c3d4e5f60789",
    "app": "6991c75b024cb89cdc04efd2",
    "name": "Revenue"
  },
  {
    "_id": "65f0b7d9a1b2c3d4e5f60790",
    "app": "6991c75b024cb89cdc04efd2",
    "name": "Engagement"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | Raw category document list. |
| `[]._id` | String | Category document ID. |
| `[].app` | String | App ID owning this category. |
| `[].name` | String | Category name. |

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

- Validates read access for `data_manager`.
- Fetches all category documents where `app` matches `app_id`.
- Returns raw category array.

## Related Endpoints

- [Data Manager - Category Create](i-data-manager-category-create.md)
- [Data Manager - Category Edit](i-data-manager-category-edit.md)
- [Data Manager - Category Delete](i-data-manager-category-delete.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission validation | Reads member record by `api_key` or `auth_token` to verify read access. |
| `countly.apps` | App context validation | Reads app record for the requested `app_id` during access validation. |
| `countly.event_categories` | Stores per-app event category definitions | Reads category documents by app. |

</details>
