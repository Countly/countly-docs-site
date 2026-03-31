---
sidebar_label: "Transformation Toggle Status"
---
# Data Transformations - Toggle Status

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/transformation/toggle-status
```

## Overview

Toggles a transformation status between `ENABLED` and `DISABLED`.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_transformations` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Transformation document ID. |
| `status` | String | Yes | Current status hint. Handler flips this value (`ENABLED` -> `DISABLED`; anything else -> `ENABLED`). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `status` | Any string | Only used as toggle hint. If current is `ENABLED`, next is `DISABLED`; otherwise next is `ENABLED`. |

## Response

### Success Response

```json
{
  "status": "DISABLED"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | String | New status after toggle (`ENABLED` or `DISABLED`). |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Toggle | Always | Computes opposite status, validates it against `TRANSFORM_STATUS`, updates document by `_id` + `app`. | Object with `status` |

### Impact on Other Data

- Updates only `status` field in `countly.datamanager_transforms`.
- Invalidates transformation cache for app.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-toggle-status` | After successful toggle update | `{ status: "new_status", id: "rule_id" }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Transformation rule storage | Updates only the `status` field for the specified rule ID and app. |
| `countly.systemlogs` | Audit trail | Writes `dm-toggle-status` with new status and rule ID. |

---

## Examples

```text
/i/data-manager/transformation/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67b860e39f2d3e0012ab9c44&
  status=ENABLED
```

## Operational Considerations

- This endpoint always toggles state; it does not support idempotent “set exact status” semantics.

## Limitations

- Invalid IDs or DB failures are returned as generic `500 Error`.

---

## Related Endpoints

- [Data Transformations - Read Rules](transformations-read.md)
- [Data Transformations - Update Rule](transformation-rules-update.md)

---

## Last Updated

2026-02-16
