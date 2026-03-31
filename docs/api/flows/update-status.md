---
sidebar_label: "Update Status"
---

# Update flow disabled status

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/flows/updateDisabled
```

## Overview

Bulk-updates the `disabled` flag for multiple flows.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `flows` `Create` permission for this endpoint.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `data` | JSON String (Object) | Yes | Object mapping `flow_id -> true/false`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when bulk update executes. |

### Error Responses

- `400`

```json
{
  "result": "Nothing to update"
}
```

- `400`

```json
{
  "result": "<bulk update error object or message>"
}
```

- `500`

```json
{
  "result": "Invalid paramerer 'data'"
}
```

## Behavior/Processing

- Parses `data` JSON object.
- Builds bulk update operations in `flow_schemas` by `_id` and `app_id`.
- Sets `disabled=true` only when value is literal `true` or string `"true"`; otherwise sets `false`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Disable two flows

```text
/i/flows/updateDisabled?
  app_id=64f5c0d8f4f7ac0012ab3456&
  data={
    "64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567": true,
    "64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4568": true
  }
```

### Re-enable one flow

```text
/i/flows/updateDisabled?
  app_id=64f5c0d8f4f7ac0012ab3456&
  data={
    "64f5c0d8f4f7ac0012ab4567": false
  }
```

---

## Related Endpoints

- [Flows - List](list.md)
- [Flows - Calculate](calculate.md)

---

## Last Updated

2026-02-16
