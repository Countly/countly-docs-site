---
sidebar_label: "Data Type Create"
keywords:
  - "/i/data-manager/data-type"
  - "data-type"
  - "data-manager"
---
# Update property or segment data types

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/data-type
```

## Overview

Runs Data Manager type migration operations for event segments and user properties.

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
| `ops` | JSON String (Object) | Yes | Type migration operations keyed by event key + segment key. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `ops` Object Structure

`ops` is a JSON-stringified object keyed by `event|segment`, where each value describes one type migration operation.

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | String | Yes | Target domain key (`custom`, `up`, or event key). |
| `segment` | String | Yes | Segment/property key to migrate. |
| `newDataType` | String | Yes | New type code (for example `s`, `n`). |
| `prevDataType` | String | Yes | Previous type code. |

Decoded example:

```json
{
  "purchase|price": {
    "event": "purchase",
    "segment": "price",
    "newDataType": "n",
    "prevDataType": "s"
  }
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
| `(root value)` | String | `Success` when migration request is accepted. |

### Error Responses

- `500`

```json
500
```

## Behavior/Processing

- Parses `ops` and forces user-property mode (`ops.isUserProperty = true`).
- Runs `migrateDataType(...)` for each operation.
- Updates type metadata in `countly_drill.drill_meta` and app overrides in `countly.apps`.
- Triggers type migration through drill processing and invalidates Data Manager cache.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-dt-custom` | User custom-property type migration (`event=custom`) | `{ query, id: "custom.segment_key" }` |
| `dm-dt-up` | Built-in user property type migration (`event=up`) | `{ query, id: "up.segment_key" }` |
| `dm-dt-event-sg` | Event segment type migration (`event_key + segment_key`) | `{ query }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Source-of-truth metadata for event segments and user properties | Updates type metadata (`type`, `prev_type`) for `custom`, `up`, and event segment targets. |
| `countly.apps` | App-level type override cache | Updates `ovveridden_types.events.*` / `ovveridden_types.prop.*` entries used by downstream reads. |
| `countly.systemlogs` | Audit trail | Writes migration actions (`dm-dt-custom`, `dm-dt-up`, `dm-dt-event-sg`) with migrated target details. |

---

## Examples

### Update a custom user property type

```text
/i/data-manager/data-type?
  app_id=64f5c0d8f4f7ac0012ab3456&
  ops={"custom|plan":{"event":"custom","segment":"plan","newDataType":"s","prevDataType":"n"}}
```

### Update an event segment type

```text
/i/data-manager/data-type?
  app_id=64f5c0d8f4f7ac0012ab3456&
  ops={"purchase|price":{"event":"purchase","segment":"price","newDataType":"n","prevDataType":"s"}}
```

## Operational Considerations

- Type migration can touch large historical datasets and may run for a long time on high-volume apps.
- Plan migrations during low-traffic windows to reduce contention with write-heavy workloads.

---

## Limitations

- On runtime exceptions, this endpoint can return HTTP `200` with raw JSON body `500`.

---

## Related Endpoints

- [Segment Properties - Update](segment-properties-update.md)
- [User Properties - Read](user-properties-read.md)

---

## Last Updated

2026-02-16
