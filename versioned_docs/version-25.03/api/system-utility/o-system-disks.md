---
sidebar_label: "Disk Stats"
keywords:
  - "/o/system/disks"
  - "disks"
  - "system"
last_update:
  date: "2026-03-07"
---

# System Utility - Disk Stats

## Endpoint

```plaintext
/o/system/disks
```

## Overview

Returns filesystem usage from `df -x tmpfs -x devtmpfs`.

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
/o/system/disks?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": {
    "overall": {
      "usage": 70.0
    },
    "details": [
      {
        "id": "/dev/sda1",
        "usage": 70.0,
        "total": 536870912000,
        "used": 375809638400,
        "free": 161061273600,
        "units": "Byte"
      }
    ]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Disk usage payload. |
| `result.overall.usage` | Number | Aggregated disk usage percentage. |
| `result.details[]` | Array | Per-filesystem usage rows. |
| `result.details[].id` | String | Filesystem identifier (for example `/dev/sda1`). |
| `result.details[].total/used/free` | Number | Size values in bytes. |

### Error Responses

```json
{
  "result": "...error message..."
}
```

## Behavior

- Excludes tmpfs/devtmpfs and some loop/boot entries.
- Aggregates overall disk usage and returns per-filesystem details.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
