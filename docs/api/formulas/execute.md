---
sidebar_label: "Execute"
keywords:
  - "/o"
  - "o"
---

# Execute formula

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=calculated_metrics
```

## Overview

Executes a formula and returns calculated values by requested buckets. Supports saved formulas and ad-hoc formulas.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `formulas` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `calculated_metrics`. |
| `app_id` | String | Yes | Target app ID. |
| `mode` | String | Yes | `saved`, `unsaved`, or `snapshot`. |
| `metric_id` | String | Conditional | Required when `mode=saved`. |
| `formula` | JSON String (Array) | Conditional | Required when `mode=unsaved` or `mode=snapshot`. |
| `bucket` | String or JSON String (Array) | Yes | Bucket or bucket list (for example `daily` or `["daily","weekly","single"]`). |
| `period` | String | Yes | Countly period format (for example `7days`, `30days`, `month`). |
| `previous` | Boolean/String | No | Include previous-period calculation when true. |
| `metric_details` | Boolean/String | No | Include formula metadata (`title`, `description`, `unit`, `format`, `dplaces`). |
| `allow_longtask` | Boolean/String | No | Enables long-task/report execution flow. |
| `db_override` | String | No | Data adapter override (`compare` and `config` are ignored for adapter selection). |
| `comparison` | Boolean/String | No | Enables comparison mode in query parameters. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

```json
{
  "app_id": "64f5c0d8f4f7ac0012ab3456",
  "buckets": ["daily", "weekly", "single"],
  "lu": "2026-02-15T11:20:48.173Z",
  "title": "Revenue per Session",
  "description": "Revenue divided by sessions",
  "unit": "USD",
  "format": "float",
  "dplaces": 2,
  "data": {
    "daily": {
      "current": {
        "value": [21.11, 20.44, 22.03],
        "buckets": ["2026:2:10", "2026:2:11", "2026:2:12"]
      },
      "previous": {
        "value": [19.88, 20.01, 20.93],
        "buckets": ["2026:2:7", "2026:2:8", "2026:2:9"]
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `app_id` | String | App ID used for calculation. |
| `buckets` | Array | Requested bucket list. |
| `lu` | Date String | Response timestamp. |
| `title` | String | Formula title (present when `metric_details` is enabled or long-task metadata is used). |
| `description` | String | Formula description (when available). |
| `unit` | String | Unit metadata (when available). |
| `format` | String | Output format metadata (when available). |
| `dplaces` | Number | Decimal place metadata (when available). |
| `data` | Object | Bucket-keyed calculation results. |

### Error Responses

- `400`

```json
{
  "result": "Incorrect formula"
}
```

- `404`

```json
{
  "result": "Formula not found."
}
```

- `500`

```json
{
  "result": "Formula fetch error"
}
```

- `500`

```json
{
  "result": "Formula range evaluation error"
}
```

## Behavior/Processing

- `mode=unsaved` and `mode=snapshot` parse formula content directly from `formula`.
- `mode=saved` loads formula by `metric_id` and enforces visibility (`global`, owner, or shared email).
- `previous=true` adds a previous-period result for each bucket.
- `bucket` can be a single value or JSON array; response `data` is keyed by each bucket value.
- If `mode` is missing/unsupported, the endpoint returns an empty object payload.
- When `allow_longtask` is enabled, processing can be dispatched through long-task/report flow.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.long_tasks` | Background task tracking | Stores long-task lifecycle records for asynchronous endpoint processing. |

---

## Examples

```text
/o?
  method=calculated_metrics&
  app_id=64f5c0d8f4f7ac0012ab3456&
  mode=saved&
  metric_id=67bd31c92e7f0b0012ab4567&
  bucket=["daily","weekly","single"]&
  period=30days&
  previous=true&
  metric_details=true
```

```text
/o?
  method=calculated_metrics&
  app_id=64f5c0d8f4f7ac0012ab3456&
  mode=unsaved&
  formula=[{"variables":[{"ex":{"type":"source","name":"e","params":{"event":"purchase"}}}]}]&
  bucket=["daily"]&
  period=7days
```

---

## Related Endpoints

- [Formulas - Read](get-single.md)
- [Formulas - List](list.md)
- [Formulas - Save](save.md)

---

## Last Updated

2026-02-16
