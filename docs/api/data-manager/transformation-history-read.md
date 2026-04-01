---
sidebar_label: "Transformation Run History"
keywords:
  - "/i/data-manager/transform-history"
  - "transform-history"
  - "data-manager"
---
# Data Transformations - Run on Historical Range

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/transform-history
```

## Overview

Runs a transformation payload against historical data for a selected date range.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_transformations` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `transformation` | JSON String (Object) | Yes | Historical transformation object. Expects historical action values such as `SEGMENT_RENAME`, `EVENT_MERGE`, `PROPERTY_VALUE`. |
| `period` | String | No | Relative period selector for historical range. |
| `date`, `from`, `to` | String | No | Explicit date range inputs for timestamp range query. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `transformation` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `actionType` | String | Yes | Historical transformation action type (for example `SEGMENT_RENAME`, `EVENT_MERGE`, `PROPERTY_VALUE`). |
| `parentEvent` | String | No | Event context or `CUSTOM_PROPERTY` where applicable. |
| `transformTarget` | Array | Yes | Source key(s) or event(s) to transform. |
| `transformResult` | String | Yes | Target key/name/value after transformation. |
| `targetRegex` | String | No | Regex pattern used by value-change operations. |

Decoded example:

```json
{
  "actionType": "SEGMENT_RENAME",
  "parentEvent": "purchase",
  "transformTarget": ["country_code"],
  "transformResult": "country"
}
```

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `transformation.actionType` | Values starting with `SEGMENT`, `EVENT`, or `PROPERTY` | Selects which historical entity domain is transformed (event segment, event, or user property). |
| `period` / `date` / `from` / `to` | Standard Countly date selectors | Defines the historical time window processed by this request. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when historical operation is triggered/executed. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Historical run | Always | Builds historical date range, selects processing branch from `actionType`, and executes historical transformation run. | Raw root string: `"Success"` |

### Impact on Other Data

- Applies transformation logic to historical event/segment/property data stores.

## Audit & System Logs

- This endpoint does not emit a dedicated `/systemlogs` action.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_events` | Historical drill event source/target | Reads and updates historical event rows affected by the requested transformation action. |
| `countly.events_data` | Aggregated historical metrics | Reads and updates aggregate metric rows impacted by rename/merge operations. |
| `countly_drill.drill_meta` | Metadata reference and update target | Reads/writes related metadata needed by persistence branch execution. |

---

## Examples

```text
/i/data-manager/transform-history?
  app_id=64f5c0d8f4f7ac0012ab3456&
  period=30days&
  transformation={
    "actionType":"SEGMENT_RENAME",
    "parentEvent":"purchase",
    "transformTarget":["country_code"],
    "transformResult":"country"
  }
```

## Operational Considerations

- Historical execution runs in request context here (no task manager wrapper in this endpoint).
- Large historical ranges can increase runtime significantly.

## Limitations

- Endpoint currently executes only `rename` and `merge` action branches in this path.
- Malformed `transformation` JSON returns generic `500 Error`.

---

## Related Endpoints

- [Data Transformations - Create Rule](transformations-create.md)
- [Data Transformations - Update Rule](transformation-rules-update.md)

---

## Last Updated

2026-02-16
