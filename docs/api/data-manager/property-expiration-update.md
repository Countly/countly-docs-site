---
sidebar_label: "Property Expiration Update"
keywords:
  - "/i/data-manager/property-expire"
  - "property-expire"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Update custom property expiration

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/property-expire
```

## Overview

Sets or removes TTL for a custom user property in Data Manager metadata.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `customProperty` | String | Yes | Custom property key under `custom.{property}`. |
| `ttl` | String or Number | Conditional | TTL value. Must be a number or `SESSION` (case-insensitive input accepted as `session`). |
| `disableExpire` | String | No | If present, removes TTL instead of setting it. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Set property TTL to 30 days

```text
/i/data-manager/property-expire?
  app_id=64f5c0d8f4f7ac0012ab3456&
  customProperty=campaign_code&
  ttl=30
```

### Set session-based expiration

```text
/i/data-manager/property-expire?
  app_id=64f5c0d8f4f7ac0012ab3456&
  customProperty=temp_flag&
  ttl=SESSION
```

### Disable expiration

```text
/i/data-manager/property-expire?
  app_id=64f5c0d8f4f7ac0012ab3456&
  customProperty=temp_flag&
  disableExpire=true
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when TTL update/removal is applied. |

### Error Responses

- `400`

```json
{
  "result": "TTL must be a number or SESSION"
}
```

- `500`

```json
500
```

## Behavior

- Updates `countly_drill.drill_meta` record `_id={app_id}_meta_up`.
- Sets `custom.{customProperty}.ttl` when TTL is valid.
- Removes `custom.{customProperty}.ttl` when `disableExpire` is provided.
- Invalidates Data Manager cache after update.

## Operational Considerations

- TTL changes affect future retention behavior for the property; existing stored values are not rewritten immediately.

## Limitations

- `disableExpire` is treated as a truthy flag; any provided value triggers TTL removal path.
- On runtime exceptions, this endpoint can return HTTP `200` with raw JSON body `500`.

## Related Endpoints

- [User Properties - Read](user-properties-read.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | User-property metadata storage | Updates/removes `custom.{property}.ttl` under the app-level `_meta_up` document. |

</details>
