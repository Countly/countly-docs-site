---
sidebar_label: "Delete"
keywords:
  - "/i/calculated_metrics/delete"
  - "delete"
  - "calculated_metrics"
---

# Delete formula

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/calculated_metrics/delete
```

## Overview

Deletes a formula by ID.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `formulas` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Formula ID to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

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

## Behavior/Processing

- Applies visibility-based condition (`global`, owner, shared email) together with `_id` and `app`.
- If a matching formula is found, endpoint removes it and returns `Deleted a formula`.
- If no matching formula is found, endpoint returns `Don't have permission to delete formula` with status `200`.
- Dispatches deletion events for system logs and formula cleanup hooks.
- Triggers dashboard cleanup for widgets that reference the deleted formula.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |
| `countly.widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/calculated_metrics/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Formulas - Read](get-single.md)
- [Formulas - List](list.md)
- [Formulas - Save](save.md)

---

## Last Updated

2026-02-16
