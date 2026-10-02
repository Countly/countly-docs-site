---
sidebar_label: "Database Stats"
keywords:
  - "/o/system/database"
  - "database"
  - "system"
last_update:
  date: "2026-03-07"
---

# System Utility - Database Stats

## Endpoint

```plaintext
/o/system/database
```

## Overview

Returns MongoDB filesystem usage from `dbStats`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires Global Admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```plaintext
/o/system/database?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": {
    "overall": {
      "usage": 75.0
    },
    "details": [
      {
        "id": "db",
        "usage": 75.0,
        "total": 214748364800,
        "used": 161061273600,
        "free": 53687091200,
        "units": "Byte"
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Database-size usage payload. |
| `result.overall.usage` | Number | Used/total percentage based on dbStats and disk total. |
| `result.details[]` | Array | Database usage detail rows. |
| `result.details[].id` | String | Database row identifier (`db`). |
| `result.details[].total/used/free` | Number | Size values in bytes. |

### Error Responses

```json
{
  "result": "...error message..."
}
```

## Behavior

- Reads MongoDB database statistics and formats them for API output.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
