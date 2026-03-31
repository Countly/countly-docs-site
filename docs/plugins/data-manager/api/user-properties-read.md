---
sidebar_label: "User Properties Read"
---
# Read user property definitions

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/user-properties
```

## Overview

Returns user-property metadata groups (`custom`, `up`) with optional masking and audit info.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

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

## Behavior/Processing

- Loads `_meta_up` from `countly_drill.drill_meta` and ensures `custom`/`up` objects exist.
- Loads relevant system logs and member names for latest audit info.
- Injects system user properties (for example `did`) with `preventTypeChange: true`.
- Adds masking info from `countly.apps.masking.prop` when present.

## Audit & System Logs

- This endpoint does not emit `/systemlogs` actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Primary user-property metadata source | Reads `_meta_up` definitions for `custom` and `up` properties. |
| `countly.apps` | Masking enrichment source | Reads app masking configuration for user-property masking annotations. |
| `countly.systemlogs` | Audit enrichment source | Reads latest property-related log records for audit metadata. |
| `countly.members` | User-name enrichment source | Resolves log `user_id` values to member names. |

---

## Examples

```text
/o/data-manager/user-properties?
  app_id=64f5c0d8f4f7ac0012ab3456
```

---

## Related Endpoints

- [User Properties - Delete](user-properties-delete.md)
- [Property Expiration - Update](property-expiration-update.md)

---

## Last Updated

2026-02-16
