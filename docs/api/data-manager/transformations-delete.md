---
sidebar_label: "Transformation Delete"
keywords:
  - "/i/data-manager/transformation/delete"
  - "delete"
  - "data-manager"
  - "transformation"
last_update:
  date: "2026-02-16"
---

# Data Transformations - Delete Rule

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/transformation/delete
```

## Overview

Deletes a transformation rule by ID.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager_transformations` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Transformation document ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `id` | Valid transformation document ID | The endpoint deletes only the matching rule for the current `app_id`. |

## Examples

```text
/i/data-manager/transformation/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67b860e39f2d3e0012ab9c44
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when deletion completes. |

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
| Delete | Always | Removes transformation by `_id` + `app`, invalidates cache. | Raw root string: `"Success"` |

### Impact on Other Data

- Deletes from `countly.datamanager_transforms`.
- Invalidates transformation cache for app.

## Operational Considerations

- Deletion removes only rule definition; already transformed historical data is not rolled back by this endpoint.

## Limitations

- Invalid IDs or DB failures are returned as generic `500 Error`.

## Related Endpoints

- [Data Transformations - Read Rules](transformations-read.md)
- [Data Transformations - Create Rule](transformations-create.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

| Action | Trigger | Payload |
|---|---|---|
| `dm-transformation-delete` | After successful delete | `{ id: "rule_id" }` |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Transformation rule storage | Removes one rule document matching `_id` and `app`. |
| `countly.systemlogs` | Audit trail | Writes `dm-transformation-delete` with deleted rule ID. |

</details>
