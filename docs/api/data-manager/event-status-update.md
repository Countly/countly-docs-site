---
sidebar_label: "Event Status Update"
keywords:
  - "/i/data-manager/event/toggle-status"
  - "toggle-status"
  - "data-manager"
  - "event"
---
# Update event status

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/event/toggle-status
```

## Overview

Sets status for selected events and updates visibility in event map.

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
| `events` | JSON String (Array) | Yes | Array of event keys to update. |
| `status` | String | Yes | New status value (for example `created`, `approved`, `live`, `blocked`, `unplanned`). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `events` Array Structure

`events` is a JSON-stringified array of event keys.

Decoded example:

```json
["purchase", "signup"]
```

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `data-manager.allowUnplannedEvents` | `ALLOW` | Visibility assignment when `status=unplanned` | If set to `ALLOW`, unplanned events can remain visible; if set to `DISALLOW`, they are forced hidden. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when status updates are applied. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

- Updates `status` in `countly_drill.drill_meta` for selected events.
- Computes `is_visible` from status and `data-manager.allowUnplannedEvents` config.
- Updates `countly.events.map.{event}.is_visible`.
- Writes `dm-event-edit` system log and invalidates cache.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-event-edit` | After status update for selected events | `{ action: "UPDATE_STATUS", status, ev: [eventKeys] }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Event status storage | Updates `status` for each selected event metadata document. |
| `countly.events` | Event visibility map | Updates `map.{event}.is_visible` based on status and unplanned-event config. |
| `countly.systemlogs` | Audit trail | Writes `dm-event-edit` with `UPDATE_STATUS` context. |

---

## Examples

### Set events to `live`

```text
/i/data-manager/event/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  events=["purchase","signup"]&
  status=live
```

### Set events to `unplanned`

```text
/i/data-manager/event/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  events=["purchase"]&
  status=unplanned
```

## Operational Considerations

- This endpoint updates both drill metadata and event-map visibility in one request.
- Large `events` arrays can trigger many map updates; prefer batching for very large metadata changes.

---

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Events Visibility - Update](events-visibility-update.md)

---

## Last Updated

2026-02-16
