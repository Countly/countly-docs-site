---
sidebar_label: "Segment Update"
keywords:
  - "/i/data-manager/segment/edit"
  - "edit"
  - "data-manager"
  - "segment"
last_update:
  date: "2026-02-16"
---

# Update segment metadata

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/segment/edit
```

## Overview

Updates metadata for one segment under a specific event.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `eventKey` | String | Yes | Parent event key. |
| `segment` | JSON String (Object) | Yes | Segment payload. Uses `segment.name` and optional `type`, `status`, `description`, `required`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `segment` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Segment key to update. |
| `type` | String | No | Segment data type code (for example `s`, `n`). |
| `status` | String | No | Segment status value. |
| `description` | String | No | Segment description text. |
| `required` | Boolean/String | No | Segment required flag. |

Decoded example:

```json
{
  "name": "country",
  "type": "s",
  "status": "live",
  "description": "ISO country code",
  "required": true
}
```

## Examples

```text
/i/data-manager/segment/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  eventKey=purchase&
  segment={
    "name":"country",
    "type":"s",
    "status":"approved",
    "description":"ISO country",
    "required":false
  }
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when segment update completes. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Loads current event metadata and detects segment type changes.
- Runs `migrateDataType(...)` for changed type transitions.
- Updates only provided segment fields (`status`, `description`, `required`) in drill meta.
- Writes `dm-segment-edit` system log and invalidates cache.

## Related Endpoints

- [Event Segments - Read](event-segments-read.md)
- [Segment Status - Update](segment-status-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-segment-edit` | After segment metadata update | `{ sg: JSON.stringify(segment), ev: eventKey, segment: segment.name }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Segment metadata storage | Updates target segment metadata fields (`type`, `status`, `description`, `required`) under the event metadata document. |
| `countly.apps` | App-level type override cache (indirect via type migration helper) | Updates override entries when segment type changes require migration bookkeeping. |
| `countly.systemlogs` | Audit trail | Writes `dm-segment-edit` and type-migration actions for changed segment types. |

</details>
