---
sidebar_label: "Delete"
keywords:
  - "/i/flows/delete"
  - "delete"
  - "flows"
---

# Delete flow

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/flows/delete
```

## Overview

Deletes a flow schema and all related flow data.

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
| `_id` | String | Yes | Flow ID to delete. |
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
| `result` | String | `Success` when schema and data are deleted. |

### Error Responses

- `400`

```json
{
  "result": "Flow not found"
}
```

- `400`

```json
{
  "result": "Data base error. Pleas check logs"
}
```

## Behavior/Processing

- Verifies schema exists by `_id` + `app_id`.
- Deletes `flow_data` rows with `_id` prefix `<flow_id>_`.
- Deletes schema row by `_id`.
- Logs `flows_deleted` on success.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.flow_data` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/flows/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Flows - List](list.md)
- [Flows - Create](create.md)

---

## Last Updated

2026-02-16
