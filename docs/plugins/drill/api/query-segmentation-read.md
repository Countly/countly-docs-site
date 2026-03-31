---
sidebar_label: "Query Segmentation - Read"
---
# Run segmentation query

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=segmentation
```

## Overview

Executes Drill segmentation query with filters, period, and bucket options.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `drill` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation`. |
| `app_id` | String | Yes | Target app ID. |
| `event` | String | Yes | Event key to query. |
| `queryObject` | JSON String (Object) | Yes | Mongo-style filter object. |
| `period` | String or Array | Yes | Period value accepted by Countly period parser. |
| `bucket` | String | Yes | Time bucket. |
| `projectionKey` | String or JSON String (Array) | No | Group-by key(s). |
| `db_override` | String | No | `mongodb`, `clickhouse`, or `compare`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |
| `drill.*` | Drill feature defaults | Drill query result shaping and list-size behavior. | Changes to drill settings can affect result size and query output details. |

## Response

### Success Response

```json
{
  "chartDP": {
    "1739145600": {"c": 120}
  },
  "meta": {
    "event": "[CLY]_session"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Drill query result object (shape depends on query configuration). |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: event"
}
```

- `400`

```json
{
  "result": "Missing request parameter: queryObject"
}
```

- `400`

```json
{
  "result": "Bad request parameter: queryObject"
}
```

- `400`

```json
{
  "result": "Missing request parameter: period"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

- `400`

```json
{
  "result": "Invalid request parameter: period"
}
```

- `400`

```json
{
  "result": "Missing request parameter: bucket"
}
```

- `400`

```json
{
  "result": "Bad request parameter: bucket"
}
```

- `500`

```json
{
  "result": "Error in processing: <details>"
}
```

## Behavior/Processing

- Validates required query parameters.
- Parses and normalizes filter and period parameters.
- Runs segmentation query on selected backend.
- With `db_override=compare`, runs both MongoDB and ClickHouse and returns comparison-selected output.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Drill metadata model | Stores event/segment/property metadata dictionaries used by this endpoint. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly_drill.drill_cache` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_drill.drill_snapshots` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Basic session query

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={}&
  period=30days&
  bucket=daily
```

### Query grouped by platform

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={"cc":"US"}&
  projectionKey=sg.p&
  period=30days&
  bucket=daily
```

---

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Bookmarks - Read](bookmarks-read.md)

---

## Last Updated

2026-02-16
