---
sidebar_label: "Save"
---

# Save formula

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/calculated_metrics/save
```

## Overview

Creates a new formula or updates an existing one.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `formulas` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `metric` | JSON String (Object) | Yes | Formula object to create or update. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### Metric Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | No | Existing formula ID for update. Omit for create. |
| `title` | String | Yes | Formula title (minimum length 1). |
| `key` | String | Yes | Formula key. Allowed pattern: letters, numbers, `_`, `-`. |
| `format` | String | Yes | Must be one of: `float`, `integer`, `percent`, `time`. |
| `dplaces` | Number | Yes | Decimal places value (required by validation for all formats). |
| `visibility` | String | Yes | `global` or `private`. |
| `formula` | String | Conditional | Required for create. If provided on update, it is parsed and saved. |
| `description` | String | No | Optional description (trimmed). |
| `unit` | String | No | Optional unit label. |
| `shared_email_edit` | Array | No | Shared editor emails for private formulas. |

## Response

### Success Response (Create)

```json
{
  "status": "Success",
  "id": "67bd31c92e7f0b0012ab4567",
  "action": "formula_created"
}
```

### Success Response (Update)

```json
{
  "status": "Success",
  "id": "67bd31c92e7f0b0012ab4567",
  "action": "formula_edited"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `status` | String | `Success` when write operation succeeds. |
| `id` | String | Created/updated formula ID. |
| `action` | String | `formula_created` or `formula_edited`. |

### Error Responses

- `400`

```json
{
  "result": "Not enough args"
}
```

- `400`

```json
{
  "result": "Invalid output format"
}
```

- `400`

```json
{
  "result": "Invalid decimal places"
}
```

- `400`

```json
{
  "result": "Invalid key"
}
```

- `400`

```json
{
  "result": "Invalid visibility"
}
```

- `400`

```json
{
  "result": "Formula cannot be empty"
}
```

- `400`

```json
{
  "result": "Incorrect formula"
}
```

- `422`

```json
{
  "result": "Provided formula name or key is used by another formula of this app. Please ensure that name and key you specified are not in use."
}
```

- `500`

```json
{
  "result": "Failed to create a formula."
}
```

## Behavior/Processing

- Parses `metric` JSON and forces `metric.app = app_id`.
- For create: `metric.formula` is required and parsed; endpoint sets `owner_id` from current member.
- For update: if `metric.formula` is provided, formula payload is re-parsed and hash is updated.
- `description` is trimmed before save.
- Update uses visibility-filtered condition (`global`, owner, shared email) plus `_id` and `app`.
- Dispatches `formula_created` / `formula_edited` to system logs and formula update hooks.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/calculated_metrics/save?
  app_id=64f5c0d8f4f7ac0012ab3456&
  metric={
    "title":"Revenue per Session",
    "key":"revenue_per_session",
    "description":"Revenue divided by sessions",
    "formula":"[...]",
    "format":"float",
    "dplaces":2,
    "unit":"USD",
    "visibility":"global",
    "shared_email_edit":[]
  }
```

```text
/i/calculated_metrics/save?
  app_id=64f5c0d8f4f7ac0012ab3456&
  metric={
    "_id":"67bd31c92e7f0b0012ab4567",
    "title":"Revenue per Session (Updated)",
    "key":"revenue_per_session",
    "format":"float",
    "dplaces":2,
    "visibility":"private",
    "shared_email_edit":["analyst@example.com"]
  }
```

---

## Related Endpoints

- [Formulas - Execute](execute.md)
- [Formulas - Read](get-single.md)
- [Formulas - List](list.md)
- [Formulas - Delete](delete.md)

---

## Last Updated

2026-02-16
