---
sidebar_label: "Read"
keywords:
  - "/o/calculated_metrics/metric"
  - "metric"
  - "calculated_metrics"
---

# Read formula

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/calculated_metrics/metric
```

## Overview

Returns a single formula document. Also supports `mode=has_reports` to return report usage count.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

- Standard read mode requires `formulas` `Read` permission.
- `mode=has_reports` does not apply formula visibility filtering and returns report count for `metric_id` within the app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Conditional | Required for standard read mode. Formula ID to fetch. |
| `mode` | String | No | Set `has_reports` to return report count instead of formula details. |
| `metric_id` | String | Conditional | Required when `mode=has_reports`. |
| `for_widgets` | Boolean/String | No | If provided, standard mode returns only `_id` and `title`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response (Standard Read)

```json
{
  "result": {
    "_id": "67bd31c92e7f0b0012ab4567",
    "title": "Revenue per Session",
    "description": "Revenue divided by sessions",
    "key": "revenue_per_session",
    "visibility": "global",
    "format": "float",
    "dplaces": 2,
    "unit": "USD",
    "formula": "[...]",
    "shared_email_edit": [],
    "app": "64f5c0d8f4f7ac0012ab3456",
    "formula_hash": "8e49d217047eafee994c3c8a4a1efcbb",
    "owner_id": "64f5c0d8f4f7ac0012ab9999"
  }
}
```

### Success Response (`mode=has_reports`)

```json
{
  "result": {
    "count": 3
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Formula document in standard mode; object with `count` in `has_reports` mode. |
| `result.count` | Number | Number of formula-related report tasks (`has_reports` mode only). |

### Error Responses

No explicit error response is returned by this handler for standard read; missing/unauthorized formula returns an empty object (`{}`).

## Behavior/Processing

- Standard read mode applies visibility rules (`global`, owner, or shared email).
- Standard response excludes the `expression` field.
- `for_widgets` returns minimized fields (`_id`, `title`) in standard mode.
- `mode=has_reports` counts related entries in `long_tasks` using `metric_id`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.long_tasks` | Background task tracking | Stores long-task lifecycle records for asynchronous endpoint processing. |

---

## Examples

```text
/o/calculated_metrics/metric?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=67bd31c92e7f0b0012ab4567
```

```text
/o/calculated_metrics/metric?
  app_id=64f5c0d8f4f7ac0012ab3456&
  mode=has_reports&
  metric_id=67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Formulas - Execute](execute.md)
- [Formulas - List](list.md)

---

## Last Updated

2026-02-16
