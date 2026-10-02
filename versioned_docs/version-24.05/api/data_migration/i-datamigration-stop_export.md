---
sidebar_label: "Export Stop"
keywords:
  - "/i/datamigration/stop_export"
  - "stop_export"
  - "datamigration"
last_update:
  date: "2026-02-17"
---

# Data Migration - Stop Export

## Endpoint

```text
/i/datamigration/stop_export
```

## Overview

Marks an export as stopped when it is still in export pipeline states.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_migration` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `exportid` | String | Yes | Export ID to stop. |
| `args` | JSON String (Object) | No | Optional JSON-stringified helper args. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Stop an active export

```text
/i/datamigration/stop_export?
  exportid=f9b35d90be5f2240eafced7c6bfdf130856cd0a7
```

## Response

### Success Response

```json
{
  "result": "data-migration.export-already-stopped"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Export stop status key. |

### Error Responses

- `404`

```json
{
  "result": "data-migration.export-already-finished"
}
```

- `404`

```json
{
  "result": "data-migration.export-already-failed"
}
```

- `404`

```json
{
  "result": "data-migration.export-already-sent"
}
```

- `404`

```json
{
  "result": "data-migration.data-migration.exportid_not_provided"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Stop accepted | Export exists and is in `packing` or `exporting` step | Sets `stopped=true` in migration record. | Wrapped `data-migration.export-already-stopped` |
| Cannot stop | Export already finished/failed/sent | Returns status-specific error key. | Wrapped error key |

### Impact on Other Data

- Updates `stopped` flag in `countly.data_migrations`.

## Limitations

- The success message key is `data-migration.export-already-stopped`, even in the first successful stop transition.

## Related Endpoints

- [Data Migration - Export](i-datamigration-export.md)
- [Data Migration - Get Status](o-datamigration-getstatus.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.data_migrations` | Export status lookup and update | Reads export status/step and sets `stopped=true` when eligible. |

</details>
