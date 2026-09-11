---
sidebar_label: "Transformation Toggle Status"
keywords:
  - "/i/data-manager/transformation/toggle-status"
  - "toggle-status"
  - "data-manager"
  - "transformation"
last_update:
  date: "2026-02-16"
---

# Data Transformations - Toggle Status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/transformation/toggle-status
```

## Overview

Toggles a transformation status between `ENABLED` and `DISABLED`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Examples

```text
/i/data-manager/transformation/toggle-status?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67b860e39f2d3e0012ab9c44&
  status=ENABLED
```

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

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Toggle | Always | Computes opposite status, validates it against `TRANSFORM_STATUS`, updates document by `_id` + `app`. | Object with `status` |

### Impact on Other Data

- Updates only `status` field in `countly.datamanager_transforms`.
- Invalidates transformation cache for app.

## Operational Considerations

- This endpoint always toggles state; it does not support idempotent “set exact status” semantics.

## Limitations

- Invalid IDs or DB failures are returned as generic `500 Error`.

## Related Endpoints

- [Data Transformations - Read Rules](transformations-read.md)
- [Data Transformations - Update Rule](transformation-rules-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-toggle-status` | After successful toggle update | `{ status: "new_status", id: "rule_id" }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Transformation rule storage | Updates only the `status` field for the specified rule ID and app. |
| `countly.systemlogs` | Audit trail | Writes `dm-toggle-status` with new status and rule ID. |

</details>
