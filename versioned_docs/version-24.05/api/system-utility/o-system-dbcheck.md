---
sidebar_label: "Database Check"
keywords:
  - "/o/system/dbcheck"
  - "dbcheck"
  - "system"
last_update:
  date: "2026-03-07"
---

# System Utility - Database Check

## Endpoint

```plaintext
/o/system/dbcheck
```

## Overview

Checks MongoDB connectivity by reading a known document from `plugins` collection.

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
/o/system/dbcheck?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Boolean | `true` when database connectivity probe succeeds; `false` otherwise. |

### Error Responses

```json
{
  "result": false
}
```

## Behavior

- Reads `countly.plugins` with `{_id:"plugins"}`.
- Returns boolean DB connectivity result via wrapped `result`.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.plugins` | Connectivity probe | Reads one document for DB reachability check. |

</details>
