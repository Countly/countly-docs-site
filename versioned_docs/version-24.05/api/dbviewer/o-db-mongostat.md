---
sidebar_label: "Mongostat"
keywords:
  - "/o/db/mongostat"
  - "mongostat"
  - "db"
last_update:
  date: "2026-10-17"
---

# DB Viewer - Mongostat

## Endpoint

```plaintext
/o/db/mongostat
```

## Overview

Returns a snapshot of the database server status (operations, memory, connections and so on), taken with the `mongostat` tool.

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

### Read a mongostat snapshot

```plaintext
/o/db/mongostat?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  ["insert", "query", "update", "delete", "getmore", "command", "dirty", "used", "flushes", "vsize", "res", "qrw", "arw", "net_in", "net_out", "conn", "time"],
  ["*0", "*0", "*0", "*0", "0", "1|0", "0.0%", "0.1%", "0", "2.5G", "150M", "0|0", "1|0", "200b", "60.3k", "10", "Oct 17 10:00:00.000"]
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | The output of `mongostat`, one array of text values per line. The first array is the header line. |

## Behavior

- Runs `mongostat` against the Countly database once and returns its first output.
- The `mongostat` tool must be installed on the server.

## Related Endpoints

- [DB Viewer - Mongotop](o-db-mongotop.md)
- [DB Viewer - Databases List](o-db.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read a Countly collection; it runs the `mongostat` tool against the database server.

</details>
