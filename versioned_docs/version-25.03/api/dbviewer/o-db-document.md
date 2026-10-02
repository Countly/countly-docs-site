---
sidebar_label: "Document Read"
keywords:
  - "/o/db"
  - "db"
last_update:
  date: "2026-03-07"
---

# DB Viewer - Document Read

## Endpoint

```plaintext
/o/db?db=countly&collection=members&document=507f1f77bcf86cd799439011
```

## Overview

Reads a single document by `_id` from the selected collection.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires DB Viewer access (`dbviewer` read right for app-scoped users).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `db` / `dbs` | String | Yes | Database name. |
| `collection` | String | Yes | Collection name. |
| `document` | String | Yes | `_id` value. If it is a valid ObjectId string, backend converts it to ObjectId automatically. |

## Examples

### Read one member document

```plaintext
/o/db?api_key=YOUR_API_KEY&db=countly&collection=members&document=507f1f77bcf86cd799439011
```

## Response

### Success Response

```json
{
  "_id": "ObjectId(507f1f77bcf86cd799439011)",
  "name": "Test User",
  "email": "user@example.com"
}
```

If not found:

```json
{}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Full document object if found, otherwise empty object. |

### Error Responses

- `401`

```json
{
  "result": "User does not have right to view this document"
}
```

- `404`

```json
{
  "result": "Database not found."
}
```

## Behavior

- If `document` is ObjectId-like, backend converts it to ObjectId before lookup.
- For `members` collection, `password` and `api_key` are removed.
- For `auth_tokens` collection, `_id` is redacted to `***redacted***`.
- ObjectId-like values in response are rendered as `ObjectId(...)` strings.

## Related Endpoints

- [DB Viewer - Collection Query](o-db-collection.md)
- [DB Viewer - Indexes Read](o-db-indexes.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint reads from the selected `db.collection`.

</details>
