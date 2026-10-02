---
sidebar_label: "Status Read"
keywords:
  - "/o/datamigration/getstatus"
  - "getstatus"
  - "datamigration"
last_update:
  date: "2026-02-17"
---

# Data Migration - Get Status

## Endpoint

```text
/o/datamigration/getstatus
```

## Overview

Returns one migration status record by export ID.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_migration` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `exportid` | String | Yes | Migration export ID. |
| `args` | JSON String (Object) | No | Optional JSON-stringified helper args. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Get status for one export

```text
/o/datamigration/getstatus?
  exportid=f9b35d90be5f2240eafced7c6bfdf130856cd0a7
```

## Response

### Success Response

```json
{
  "result": {
    "_id": "f9b35d90be5f2240eafced7c6bfdf130856cd0a7",
    "step": "sending",
    "status": "progress",
    "progress": 78,
    "reason": "",
    "apps": ["6991c75b024cb89cdc04efd2"],
    "ts": 1739971200000
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Migration status object. |
| `result.step` | String | Current lifecycle step (for example `exporting`, `packing`, `sending`, `importing`). |
| `result.status` | String | Current status (for example `progress`, `finished`, `failed`). |
| `result.progress` | Number | Progress percentage or progress counter. |
| `result.reason` | String | Failure or status reason text. |

### Error Responses

- `404`

```json
{
  "result": "data-migration.invalid-exportid"
}
```

- `200` (missing exportid branch uses raw output)

```json
"data-migration.exportid-missing"
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Status found | Valid `exportid` with existing record | Returns migration record. | Wrapped status object |
| Missing ID | `exportid` omitted | Returns raw string via raw response body. | Raw root string |
| Invalid ID | Record not found | Returns invalid-export key. | Wrapped string |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Data Migration - Export](i-datamigration-export.md)
- [Data Migration - Send Existing Export](i-datamigration-sendexport.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.data_migrations` | Migration status lookup | Reads migration record by `_id`. |

</details>
