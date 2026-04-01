---
sidebar_label: "Calculate"
keywords:
  - "/i/flows/calculate"
  - "calculate"
  - "flows"
---

# Calculate flow

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/flows/calculate
```

## Overview

Starts asynchronous calculation for a flow schema.

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
| `_id` | String | Yes | Flow ID to calculate. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `flows.nodesCn` | `10` | Maximum nodes per step during calculation. | Higher values can return wider flow branches per level. |
| `flows.maxDepth` | `20` | Maximum step depth during calculation. | Higher values can return longer flow paths. |

Other `flows` settings (`regenerateInterval`, `skipAutoFlows`) do not change manual `/i/flows/calculate` request behavior.

## Response

### Success Response

```json
{
  "result": "Flow calculation started"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Start confirmation. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter(id of the flow):_id"
}
```

- `400`

```json
{
  "result": "Flow not found"
}
```

- `400`

```json
{
  "result": "Flow is already being calculated"
}
```

- `400`

```json
{
  "result": "Flow is disabled, enable it to run calculations."
}
```

- `400`

```json
{
  "result": "Data base error. Pleas check logs"
}
```

## Behavior/Processing

- Loads schema by `_id` and `app_id`.
- Blocks when already calculating or disabled.
- Normalizes period formatting.
- Calls background flow calculation and returns immediately.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.flow_data` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/flows/calculate?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Flows - Data](data.md)
- [Flows - Info](info.md)

---

## Last Updated

2026-02-16
