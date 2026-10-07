---
sidebar_label: "Overall Stats"
keywords:
  - "/o/system/overall"
  - "overall"
  - "system"
last_update:
  date: "2026-03-07"
---

# System Utility - Overall Stats

## Endpoint

```plaintext
/o/system/overall
```

## Overview

Returns combined system summary: host id, platform, cpu, memory, disks, and database stats.

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
/o/system/overall?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": {
    "id": "SYSTEM-ID",
    "platform": "linux",
    "cpu": {"overall": {"usage": 45.2}, "details": []},
    "memory": {"overall": {"usage": 72.9}, "details": []},
    "disks": {"overall": {"usage": 70.0}, "details": []},
    "database": {"overall": {"usage": 75.0}, "details": []}
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Consolidated system snapshot. |
| `result.id` | String | Host identifier. |
| `result.platform` | String | Host platform (`linux`, `darwin`, etc.). |
| `result.cpu/memory/disks/database` | Object | Nested payloads from individual system utility collectors. |

### Error Responses

```json
{
  "result": "...error message..."
}
```

## Behavior

- Aggregates `id`, `cpu`, `memory`, `disks`, `database` via parallel async calls.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
