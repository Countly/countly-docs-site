---
sidebar_label: "Property Values Read"
keywords:
  - "/o/data-manager/list-values"
  - "list-values"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Read property value list

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/list-values
```

## Overview

Returns paginated property values from drill metadata for an event segment or user property.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `group` | String | Yes | Property group path (for example `sg`, `custom`, `up`). |
| `property` | String | Yes | Property key name. |
| `event` | String | Conditional | Required for event segments (`user_property=false`). |
| `user_property` | String | No | Set to `true` for user properties. |
| `iDisplayStart` | Number | No | Pagination start offset. |
| `iDisplayLength` | Number | No | Page length (`-1` means all). |
| `sSearch` | String | No | Case-insensitive search filter. |
| `sEcho` | String | No | Echo value returned in response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Event segment values

```text
/o/data-manager/list-values?
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  group=sg&
  property=country&
  iDisplayStart=0&
  iDisplayLength=25
```

### User property values

```text
/o/data-manager/list-values?
  app_id=64f5c0d8f4f7ac0012ab3456&
  user_property=true&
  group=custom&
  property=subscription_tier
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 12,
  "iTotalDisplayRecords": 4,
  "aaData": [
    { "name": "US" },
    { "name": "CA" }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value from request (if provided). |
| `iTotalRecords` | Number | Total value count. |
| `iTotalDisplayRecords` | Number | Count after filter. |
| `aaData` | Array | Value rows. Each row contains `name`. |

### Error Responses

This endpoint does not define a dedicated structured error payload for aggregation failures; errors are logged and may return generic error responses.

## Behavior

- Builds metadata `_id` from app, event hash/group/property, or `_meta_up` path.
- Reads values from `countly_drill.drill_meta.values` via aggregation pipeline.
- Applies search and pagination when provided.
- Decodes stored value names before returning.

## Related Endpoints

- [Event Segments - Read](event-segments-read.md)
- [User Properties - Read](user-properties-read.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Property value dictionary source | Reads `values` keys for event segment or user-property metadata documents and returns paginated value names. |

</details>
