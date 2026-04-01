---
sidebar_label: "Views"
keywords:
  - "/o/flows"
  - "flows"
---

# Get flow views catalog

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/flows?method=views
```

## Overview

Returns view options (`name`, `value`) for view-based flow definitions.

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
| `method` | String | Yes | Must be `views`. |
| `app_id` | String | Yes | Target app ID. |
| `query` | String | No | Optional case-insensitive name search. |
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
  "result": [
    {
      "value": "67aa9c0a6d1f0b00123a4567",
      "name": "Checkout"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | View option list. |
| `result[].value` | String | View ID (`_id`). |
| `result[].name` | String | `display` if set, otherwise `view`. |

### Error Responses

- `400`

```json
{
  "result": "DB error. Please check logs"
}
```

## Behavior/Processing

- Reads `countly.app_viewsmeta` for app (`a = app_id`).
- Optional regex filter on projected name.
- Sorts by name descending and limits to 100.
- Uses `returnMessage(200, res)` for success.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_viewsmeta` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o/flows?
  method=views&
  app_id=64f5c0d8f4f7ac0012ab3456&
  query=checkout
```

---

## Related Endpoints

- [Flows - Events](events.md)
- [Flows - Create](create.md)

---

## Last Updated

2026-02-16
