---
sidebar_label: "Collection Query"
keywords:
  - "/o/db"
  - "db"
last_update:
  date: "2026-03-07"
---

# DB Viewer - Collection Query

## Endpoint

```plaintext
/o/db?db=countly&collection=members
```

## Overview

Queries documents from a MongoDB collection, with filtering, projection, sorting, and pagination.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires DB Viewer access (`dbviewer` read right for app-scoped users).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `db` / `dbs` | String | Yes | Database name (`countly`, `countly_drill`, `countly_out`, or `countly_fs`). |
| `collection` | String | Yes | Collection name. |
| `limit` | Number | No | Page size. Default `20`, capped at `10000`. |
| `skip` | Number | No | Offset. Default `0`. |
| `filter` / `query` | JSON String | No | Query filter object. |
| `projection` / `project` | JSON String | No | Field projection object. |
| `sort` | JSON String | No | Sort object. |
| `sSearch` | String | No | `_id` regex shortcut. |

## Examples

### Query collection

```plaintext
/o/db?api_key=YOUR_API_KEY&db=countly&collection=members&limit=20&skip=0&sort={"_id":-1}
```

## Response

### Success Response

```json
{
  "limit": 20,
  "start": 1,
  "end": 20,
  "total": 138,
  "pages": 7,
  "curPage": 1,
  "collections": [
    {
      "_id": "ObjectId(507f1f77bcf86cd799439011)",
      "name": "Test User",
      "email": "user@example.com"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `limit` | Number | Page size. |
| `start` | Number | Start row index (1-based in this response contract). |
| `end` | Number | End row index. |
| `total` | Number | Total matching rows. |
| `pages` | Number | Total pages. |
| `curPage` | Number | Current page number. |
| `collections` | Array | Collection documents. |

### Error Responses

- `400`

```json
{
  "result": "Failed to parse query. ..."
}
```

- `400`

```json
{
  "result": "Invalid collection name: Collection names can not contain '$' or other invalid characters"
}
```

- `401`

```json
{
  "result": "User does not have right to view this collection"
}
```

- `404`

```json
{
  "result": "Database not found."
}
```


## Behavior

- Parses `filter/query`, `projection/project`, and `sort` as EJSON.
- Invalid `filter/query` JSON returns `400`; invalid `projection`/`sort` falls back to `{}`.
- For non-admin users, app-level base filters are merged into the query.
- For `members` collection, `password` and `api_key` are removed.
- For `auth_tokens` collection, `_id` is redacted to `***redacted***`.

## Related Endpoints

- [DB Viewer - Databases List](o-db.md)
- [DB Viewer - Document Read](o-db-document.md)
- [DB Viewer - Indexes Read](o-db-indexes.md)
- [DB Viewer - Aggregation Query](o-db-aggregation.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `security.api_additional_headers` | Empty | HTTP response headers | Additional configured headers are appended to streamed MongoDB collection responses. |

**Database Collections**

This endpoint reads from the collection specified by `db` and `collection`.

</details>
