---
sidebar_label: "Data"
keywords:
  - "/o/flows"
  - "flows"
---

# Get flow data

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/flows?method=data
```

## Overview

Returns calculated flow data document for a flow.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `flows` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `data`. |
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Yes | Flow ID. Must start with `<app_id>_`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `flows.*` | Flows feature defaults | Flows analytics query behavior and result shaping. | Changes to flows settings can affect returned paths, aggregation behavior, and limits. |

## Response

### Success Response

```json
{
  "_id": "64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567_data"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | First matching flow data document, or empty object. |

### Error Responses

- `400`

```json
{
  "result": "Flow not found"
}
```

## Behavior/Processing

- Validates `_id` prefix against `app_id`.
- Reads `countly.flow_data` by `_id` regex (`^<flow_id>.*`).
- Returns first matched document or `{}`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_data` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o/flows?
  method=data&
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Flows - Calculate](calculate.md)
- [Flows - Info](info.md)

---

## Last Updated

2026-02-16
