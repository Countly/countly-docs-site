---
sidebar_label: "Segment Status Update"
keywords:
  - "/i/data-manager/segment/toggle-status"
  - "toggle-status"
  - "data-manager"
  - "segment"
last_update:
  date: "2026-02-16"
---

# Update segment status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/segment/toggle-status
```

## Overview

Sets status for one or more event segments.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `status` | String | Yes | New segment status. |
| `eventSegments` | JSON String (Array) | Yes | Array of `{ "event": "...", "segment": "..." }` objects. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `eventSegments` Array Structure

Each array item defines one event-segment pair to update.

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

## Examples

### Set segments to `live`

```text
/i/data-manager/segment/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  status=live&
  eventSegments=[
    {"event":"purchase","segment":"country"},
    {"event":"purchase","segment":"price"}
  ]
```

### Set segments to `unplanned`

```text
/i/data-manager/segment/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  status=unplanned&
  eventSegments=[
    {"event":"purchase","segment":"country"}
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
| `(root value)` | String | `Success` when status updates are applied. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Updates segment status in `countly_drill.drill_meta` for each event+segment pair.
- Updates parent event `is_visible` in `countly.events` using status visibility rules.
- Writes `dm-segment-edit` system log entries.
- Invalidates cache.

## Operational Considerations

- Each segment update can also change parent event visibility, so one call may affect multiple event-map entries.

## Related Endpoints

- [Segment Properties - Update](segment-properties-update.md)
- [Event Status - Update](event-status-update.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `data-manager.allowUnplannedEvents` | `ALLOW` | Parent event visibility assignment when `status=unplanned` | If set to `ALLOW`, parent events can remain visible for unplanned segment status; if set to `DISALLOW`, parent visibility is forced hidden. |

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-segment-edit` | Per-segment status update | `{ segment, ev, status }` |
| `dm-segment-edit` | Summary log after all selected segments are processed | `{ ev: [eventKeys] }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Segment status storage | Updates `sg.{segment}.status` for each requested event/segment pair. |
| `countly.events` | Parent event visibility map | Updates `map.{event}.is_visible` based on the requested status and unplanned-event config. |
| `countly.systemlogs` | Audit trail | Writes per-segment and summary `dm-segment-edit` log entries. |

</details>
