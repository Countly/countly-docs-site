---
sidebar_label: "Masking Update"
keywords:
  - "/i/data-manager/mask-data"
  - "mask-data"
  - "data-manager"
---
# Update data masking rules

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/mask-data
```

## Overview

Adds, updates, or removes masking rules for event segments and user properties.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_redaction` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `ops` | JSON String (Array) | Yes | Mask operations. Each item includes target group/event, segment, and `mask` value. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `ops` Array Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `isUserProperty` | Boolean | Yes | `true` for user-property masking, `false` for event-segment masking. |
| `event` | String | Yes | Event key for event masking, or `custom`/`up` for user properties. |
| `segment` | String | Yes | Segment/property key to mask or unmask. |
| `mask` | Boolean | Yes | `true` adds masking rule, `false` removes masking rule. |

Decoded example:

```json
[
  {
    "isUserProperty": false,
    "event": "purchase",
    "segment": "email",
    "mask": true
  }
]
```

## Configuration Impact
| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `data-manager.enableDataMasking` | `false` | Global masking mode after rule updates | This endpoint recalculates whether any masking rules remain and updates this setting automatically. If no rules remain, masking is disabled; if any rule remains, masking is enabled. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when masking updates are applied. |

### Error Responses

- `500`

```json
500
```

## Behavior/Processing

- Applies rules to `countly.apps.masking` (`masking.events` or `masking.prop`).
- Removes rules when `mask: false` is provided.
- Refreshes masking config and may toggle `data-manager.enableDataMasking` globally.
- Logs changes with `dm-dt-mask` and config-change system log entries.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-dt-mask` | Each masking rule add/remove operation | `{ query }` |
| `change_configs` | When resulting masking state toggles `data-manager.enableDataMasking` | `{ "data-manager": { "enableDataMasking": boolean } }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | Stores app-level masking configuration | Reads the target app and updates `masking.events.*` / `masking.prop.*` paths for each operation. |
| `countly.systemlogs` | Audit trail | Writes `dm-dt-mask` for each operation and `change_configs` when effective masking state changes. |

---

## Examples

### Mask one event segment

```text
/i/data-manager/mask-data?
  app_id=64f5c0d8f4f7ac0012ab3456&
  ops=[{"isUserProperty":false,"event":"purchase","segment":"email","mask":true}]
```

### Remove a user-property mask rule

```text
/i/data-manager/mask-data?
  app_id=64f5c0d8f4f7ac0012ab3456&
  ops=[{"isUserProperty":true,"event":"custom","segment":"phone","mask":false}]
```

## Operational Considerations

- Each request can update multiple masking rules in one call (`ops` array).
- When effective masking state changes, the endpoint also updates global config (`data-manager.enableDataMasking`) and reloads configs.

---

## Limitations

- On runtime exceptions, this endpoint can return HTTP `200` with raw JSON body `500`.

---

## Related Endpoints

- [User Properties - Read](user-properties-read.md)
- [Event Segments - Read](event-segments-read.md)

---

## Last Updated

2026-02-16
