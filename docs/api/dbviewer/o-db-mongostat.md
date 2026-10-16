---
sidebar_label: "Mongostat Read"
keywords:
  - "/o/db/mongostat"
  - "mongostat"
  - "db"
last_update:
  date: "2026-10-16"
---

# DB Viewer - Mongostat Read

## Endpoint

```plaintext
/o/db/mongostat
```

## Overview

Returns the server statistics reported by the MongoDB `mongostat` tool, connected with the settings of the main Countly database.

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

### Read mongostat output

```plaintext
/o/db/mongostat?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  ["insert", "query", "update", "delete"],
  ["*0", "*0", "*0", "*0"]
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

- Runs `mongostat` on the server and returns its first output.

## Related Endpoints

- [DB Viewer - Mongotop Read](o-db-mongotop.md)
- [DB Viewer - Databases List](o-db.md)
