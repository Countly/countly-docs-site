---
sidebar_label: "Events Visibility Update"
keywords:
  - "/i/data-manager/events/change_visibility"
  - "change_visibility"
  - "data-manager"
  - "events"
last_update:
  date: "2026-02-16"
---

# Update event visibility

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/events/change_visibility
```

## Overview

Set event visibility in the Events map for selected events.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `set_visibility` | String | Yes | Visibility mode. `hide` sets `is_visible=false`; any other value sets `is_visible=true`. |
| `events` | JSON String (Array) | Yes | Array of event keys to update. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `events` Array Structure

`events` is a JSON-stringified array of event keys.

Decoded example:

```json
["purchase", "checkout"]
```

## Examples

### Hide selected events

```text
/i/data-manager/events/change_visibility?
  app_id=64f5c0d8f4f7ac0012ab3456&
  set_visibility=hide&
  events=["purchase","checkout"]
```

### Show selected events

```text
/i/data-manager/events/change_visibility?
  app_id=64f5c0d8f4f7ac0012ab3456&
  set_visibility=show&
  events=["purchase","signup"]
```

## Response

### Success Response

```json
"Success"
```

Alternative success result when at least one selected event is unplanned or has no status:

```json
"EVENT_STATUS_UNPLANNED"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` or `EVENT_STATUS_UNPLANNED`. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Loads selected events from `countly_drill.drill_meta`.
- Updates visibility in `countly.events.map.{event}.is_visible`.
- Skips visibility updates for events that are `unplanned` or missing status.
- Returns `EVENT_STATUS_UNPLANNED` when such events are present.

## Operational Considerations

- If selected events include `unplanned` or status-missing entries, the endpoint returns `EVENT_STATUS_UNPLANNED` and skips visibility change for those entries.

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Event Status - Update](event-status-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Status validation source | Reads selected events to detect `unplanned` or status-missing entries before visibility update. |
| `countly.events` | Event visibility map | Updates `map.{event}.is_visible` for eligible selected events. |

</details>
