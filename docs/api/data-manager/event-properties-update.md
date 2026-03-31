---
sidebar_label: "Event Update"
---
# Update event metadata

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/event/edit
```

## Overview

Updates event metadata and segment definitions for an existing event.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `event` | JSON String (Object) | Yes | Event payload including `key`, optional `status`, and `segments` array. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `event` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Event key to update. |
| `name` | String | No | Human-readable event name. |
| `description` | String | No | Event description text. |
| `status` | String | No | Event status value. |
| `segments` | Array | No | Segment definitions used to refresh segment metadata. |

Decoded example:

```json
{
  "key": "purchase",
  "name": "Purchase",
  "description": "Completed purchases",
  "status": "live",
  "segments": [
    {
      "name": "country",
      "type": "s"
    }
  ]
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
| `(root value)` | String | `Success` when event metadata update completes. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

- Validates and normalizes event key.
- Rebuilds segment map (`sg`) and default segment statuses.
- Updates event record in `countly_drill.drill_meta`.
- Updates segment list in `countly.events`.
- Runs data-type migration when segment types change.
- Writes `dm-event-edit` system log and invalidates cache.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-event-edit` | After event metadata update | `{ event: JSON.stringify(event), ev: shortEventKey }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Event metadata storage | Updates event metadata (`status`, segment definitions under `sg`) for the target event hash document. |
| `countly.events` | Event list/map metadata | Updates `segments.{event}` list for UI/schema consumers. |
| `countly.apps` | App-level type override cache (indirect via type migration helper) | Updates override keys when changed segment types are migrated. |
| `countly.systemlogs` | Audit trail | Writes `dm-event-edit` and type-migration log actions when data types change. |

---

## Examples

```text
/i/data-manager/event/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  event={
    "key":"purchase",
    "status":"approved",
    "segments":[
      {"name":"country","type":"s","required":false},
      {"name":"price","type":"n","required":true}
    ]
  }
```

---

## Related Endpoints

- [Events - Create](events-create.md)
- [Event Status - Update](event-status-update.md)

---

## Last Updated

2026-02-16
