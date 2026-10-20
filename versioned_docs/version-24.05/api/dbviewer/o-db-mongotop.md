---
sidebar_label: "Mongotop"
keywords:
  - "/o/db/mongotop"
  - "mongotop"
  - "db"
last_update:
  date: "2026-10-17"
---

# DB Viewer - Mongotop

## Endpoint

```plaintext
/o/db/mongotop
```

## Overview

Returns a snapshot of how much time the database server spends reading and writing each collection, taken with the `mongotop` tool.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires a global admin user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read a mongotop snapshot

```plaintext
/o/db/mongotop?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  ["ns", "total", "read", "write", "2026-10-17T10:00:00Z"],
  ["countly.members", "0ms", "0ms", "0ms"]
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | The output of `mongotop`, one array of text values per line. The first array is the header line. |

## Behavior

- Runs `mongotop` against the Countly database once and returns its first output.
- The `mongotop` tool must be installed on the server.

## Related Endpoints

- [DB Viewer - Mongostat](o-db-mongostat.md)
- [DB Viewer - Databases List](o-db.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read a Countly collection; it runs the `mongotop` tool against the database server.

</details>
