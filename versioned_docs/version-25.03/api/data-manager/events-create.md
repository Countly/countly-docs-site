---
sidebar_label: "Event Create"
keywords:
  - "/i/data-manager/event"
  - "event"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Create event metadata

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/event
```

## Overview

Creates a new event definition in Data Manager metadata, including segment definitions.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `event` | JSON String (Object) | Yes | Event object with `key`, `name`, optional `description`, and `segments` array. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `event` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Event key to create. |
| `name` | String | Yes | Display name for the event. |
| `description` | String | No | Event description text. |
| `segments` | Array | No | Segment definitions for the new event. |

Decoded example:

```json
{
  "key": "purchase",
  "name": "Purchase",
  "description": "Completed purchases",
  "segments": [
    {
      "name": "country",
      "type": "s"
    },
    {
      "name": "price",
      "type": "n"
    }
  ]
}
```

## Examples

```text
/i/data-manager/event?
  app_id=64f5c0d8f4f7ac0012ab3456&
  event={
    "key":"purchase",
    "name":"Purchase",
    "description":"Purchase event",
    "segments":[
      {"name":"country","type":"s"},
      {"name":"price","type":"n"}
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
| `(root value)` | String | `Success` when event metadata is created. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Parses `event` payload and normalizes `event.key` format before storing.
- Prevents duplicate events by checking existing drill meta record.
- Writes new event metadata to `countly_drill.drill_meta` with default status `created`.
- Updates `countly.events` (`list`, `segments`, and `map`).
- Sets `is_visible=false` on creation and writes `dm-event-create` system log.

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Event Properties - Update](event-properties-update.md)
- [Event Status - Update](event-status-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-event-create` | After new event metadata is created | `{ event: JSON.stringify(event), ev: shortEventKey }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Event metadata storage | Inserts/updates event metadata document with key, status, and segment definitions (`sg`). |
| `countly.events` | Event list and map metadata | Adds the event to `list`, writes `segments.{event}`, and initializes `map.{event}` with visibility/name/description fields. |
| `countly.systemlogs` | Audit trail | Writes `dm-event-create` with created event details. |

</details>
