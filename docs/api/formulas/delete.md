---
sidebar_label: "Delete"
keywords:
  - "/i/calculated_metrics/delete"
  - "delete"
  - "calculated_metrics"
last_update:
  date: "2026-02-16"
---

# Delete formula

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/calculated_metrics/delete
```

## Overview

Deletes a formula by ID.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `formulas` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Formula ID to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/i/calculated_metrics/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67bd31c92e7f0b0012ab4567
```

## Response

### Success Response

```json
{
  "result": "Deleted a formula"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Deletion outcome message. |

### Error Responses

- `200`

```json
{
  "result": "Don't have permission to delete formula"
}
```

- `500`

```json
{
  "result": "Failed to delete the formula"
}
```

## Behavior

- Applies visibility-based condition (`global`, owner, shared email) together with `_id` and `app`.
- If a matching formula is found, endpoint removes it and returns `Deleted a formula`.
- If no matching formula is found, endpoint returns `Don't have permission to delete formula` with status `200`.
- Dispatches deletion events for system logs and formula cleanup hooks.
- Triggers dashboard cleanup for widgets that reference the deleted formula.

## Related Endpoints

- [Formulas - Read](get-single.md)
- [Formulas - List](list.md)
- [Formulas - Save](save.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |
| `countly.widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
