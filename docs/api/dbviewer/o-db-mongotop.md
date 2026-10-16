---
sidebar_label: "Mongotop Read"
keywords:
  - "/o/db/mongotop"
  - "mongotop"
  - "db"
last_update:
  date: "2026-10-16"
---

# DB Viewer - Mongotop Read

## Endpoint

```plaintext
/o/db/mongotop
```

## Overview

Returns the read and write time spent per collection, as reported by the MongoDB `mongotop` tool, connected with the settings of the main Countly database.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires global admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read mongotop output

```plaintext
/o/db/mongotop?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  ["ns", "total", "read", "write"],
  ["countly.events_data", "10ms", "8ms", "2ms"]
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | One row per line of tool output. Each row is an array of strings, split on whitespace. |

### Error Responses

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Runs `mongotop` on the server and returns its first output.

## Related Endpoints

- [DB Viewer - Mongostat Read](o-db-mongostat.md)
- [DB Viewer - Databases List](o-db.md)
