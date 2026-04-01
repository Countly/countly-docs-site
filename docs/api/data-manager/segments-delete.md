---
sidebar_label: "Segments Delete"
keywords:
  - "/i/data-manager/segment/delete"
  - "delete"
  - "data-manager"
  - "segment"
---
# Delete event segments

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/segment/delete
```

## Overview

Deletes one or more segments from event metadata and related drill/event data structures.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `eventSegments` | JSON String (Array) | Yes | Array of `{ "event": "...", "segment": "..." }` objects to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `eventSegments` Array Structure

Each array item defines one event-segment pair to delete.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | String | Yes | Event key. |
| `segment` | String | Yes | Segment key under the event. |

Decoded example:

```json
[
  { "event": "purchase", "segment": "country" },
  { "event": "purchase", "segment": "price" }
]
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when deletion pipeline completes. |

### Error Responses

Common parse/runtime failure path (for example invalid `eventSegments` JSON):

- `500`

```json
{
  "result": "Server error"
}
```

## Behavior/Processing

- Removes segment metadata from `countly_drill.drill_meta`.
- Pulls segment names from `countly.events.segments.{event}`.
- Unsets segment values from `countly_drill.drill_events`.
- Deletes related `events_data` rows for that segment key pattern.
- Writes `dm-segment-delete` logs and invalidates cache.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-segment-delete` | Per deleted event+segment pair | `{ segment, ev }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Segment metadata storage | Removes segment definitions from `sg.{segment}` in event metadata documents. |
| `countly.events` | Event segment index | Pulls deleted segment keys from `segments.{event}` arrays. |
| `countly_drill.drill_events` | Raw drill event records | Unsets deleted segment fields from stored event records for matching app/event pairs. |
| `countly.events_data` | Aggregated event data | Deletes and unsets segment-related aggregate rows/metadata for deleted segment keys. |
| `countly.systemlogs` | Audit trail | Writes `dm-segment-delete` entries per deleted event/segment pair. |

---

## Examples

```text
/i/data-manager/segment/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  eventSegments=[
    {"event":"purchase","segment":"country"},
    {"event":"purchase","segment":"price"}
  ]
```

---

## Limitations

- Error responses can surface as generic HTTP `500` with `{"result":"Server error"}` for parse/runtime failures.

---

## Related Endpoints

- [Event Segments - Read](event-segments-read.md)
- [Segment Status - Update](segment-status-update.md)

---

## Last Updated

2026-02-16
