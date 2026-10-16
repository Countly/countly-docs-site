---
sidebar_label: "Mongotop"
keywords:
  - "/o/db/mongotop"
  - "db"
  - "mongotop"
last_update:
  date: "2026-10-16"
---

# DB Viewer - Mongotop

## Endpoint

```plaintext
/o/db/mongotop
```

## Overview

Returns a single `mongotop` sample for the Countly database: how much time MongoDB spent reading and writing each collection.

The server runs the `mongotop` command-line tool once, takes its first output, and returns it as an array of rows. Each row is an array of strings.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires a global administrator.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read one mongotop sample

```plaintext
/o/db/mongotop?api_key=YOUR_API_KEY
```

## Response

### Success Response

The response is a JSON array of rows. Every row is an array of strings.

```json
[
  ["column 1", "column 2", "..."],
  ["value 1", "value 2", "..."]
]
```

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `400`

```json
{
  "result": "Token not valid"
}
```

- `401`

```json
{
  "result": "User does not exist"
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Only global administrators can call this endpoint.
- Requires the `mongotop` tool to be installed on the Countly server.
- Connects to the `countly` database using the server's configured database connection.
- Returns after the first output of the tool; the tool is then stopped.

## Related Endpoints

- [DB Viewer - Databases List](o-db.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read Countly collections directly. It runs the `mongotop` tool against the `countly` database.

</details>
