---
sidebar_label: "Mongostat"
keywords:
  - "/o/db/mongostat"
  - "db"
  - "mongostat"
last_update:
  date: "2026-10-16"
---

# DB Viewer - Mongostat

## Endpoint

```plaintext
/o/db/mongostat
```

## Overview

Returns a single `mongostat` sample for the Countly database server: operation counters, memory, connections and network figures.

The server runs the `mongostat` command-line tool once, takes its first output, and returns it as an array of rows. Each row is an array of strings.

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

### Read one mongostat sample

```plaintext
/o/db/mongostat?api_key=YOUR_API_KEY
```

## Response

### Success Response

The response is a JSON array of rows. Every row is an array of strings. The last value of a row (the time) is joined into one string when the tool prints it as several words.

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
- Requires the `mongostat` tool to be installed on the Countly server.
- Connects to the `countly` database using the server's configured database connection.
- Returns after the first output of the tool; the tool is then stopped.

## Related Endpoints

- [DB Viewer - Databases List](o-db.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read Countly collections directly. It runs the `mongostat` tool against the `countly` database.

</details>
