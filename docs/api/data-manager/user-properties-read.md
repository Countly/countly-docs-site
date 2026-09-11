---
sidebar_label: "User Properties Read"
keywords:
  - "/o/data-manager/user-properties"
  - "user-properties"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Read user property definitions

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/user-properties
```

## Overview

Returns user-property metadata groups (`custom`, `up`) with optional masking and audit info.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o/data-manager/user-properties?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
{
  "custom": {
    "subscription_tier": {
      "type": "s"
    }
  },
  "up": {
    "name": {
      "type": "-",
      "preventTypeChange": true
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `custom` | Object | Custom user-property definitions from drill meta. |
| `up` | Object | `up` property definitions plus system properties injected by backend. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Loads `_meta_up` from `countly_drill.drill_meta` and ensures `custom`/`up` objects exist.
- Loads relevant system logs and member names for latest audit info.
- Injects system user properties (for example `did`) with `preventTypeChange: true`.
- Adds masking info from `countly.apps.masking.prop` when present.

## Related Endpoints

- [User Properties - Delete](user-properties-delete.md)
- [Property Expiration - Update](property-expiration-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Primary user-property metadata source | Reads `_meta_up` definitions for `custom` and `up` properties. |
| `countly.apps` | Masking enrichment source | Reads app masking configuration for user-property masking annotations. |
| `countly.systemlogs` | Audit enrichment source | Reads latest property-related log records for audit metadata. |
| `countly.members` | User-name enrichment source | Resolves log `user_id` values to member names. |

</details>
