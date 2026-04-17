---
sidebar_label: "Query Segmentation - Read"
keywords:
  - "/o"
  - "o"
---
# Run segmentation query

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=segmentation
```

## Overview

Executes a Drill segmentation query with filters, period, bucket, and optional breakdown fields.

The response is not a single fixed schema. Drill returns different payload shapes depending on whether `projectionKey` is omitted, present, or combined with `list=true`.

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
| `queryObject` | JSON String (Object) | Yes | Mongo-style Drill filter object. Use `{}` for no additional filters. Drill adds app, event, and time filters internally from `app_id`, `event`, and `period`. |
| `period` | String or Array | Yes | Period value accepted by Countly period parser, for example `30days`, `day`, `month`, or a date range array. |
| `bucket` | String or JSON String (Array) | Yes | Time bucket or buckets. Supported values are `hourly`, `daily`, `weekly`, and `monthly`. |
| `projectionKey` | String or JSON String (Array) | No | Group-by field or fields. Examples: `up.p`, `up.cc`, `sg.plan`, `["up.p","sg.plan"]`. |
| `list` | Boolean/String | No | When truthy and `projectionKey` is provided, returns table/list-style segment rows with pagination metadata instead of graph-style time-series buckets. |
| `limit` | Number | No | Maximum segment rows returned for projected graph/table modes. Defaults to the Drill projection limit. |
| `skip` | Number | No | Offset for `list=true` table results. |
| `sort` | JSON String (Object) | No | Sort object for `list=true` table results, for example `{"u":-1}` or `{"s0":1}`. |
| `sortGraphBy` | String | No | Graph mode segment ordering. Use `u` to sort by users; default ordering is by total count `t`. |
| `db_override` | String | No | `mongodb`, `clickhouse`, or `compare`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |
| `drill.*` | Drill feature defaults | Drill query result shaping and list-size behavior. | Changes to drill settings can affect result size and query output details. |

## Response

### Success Response Shapes

#### Without `projectionKey`

Returns totals and bucketed time-series data. Each bucket contains period keys such as daily dates, weekly keys, or monthly keys.

```json title="Example shape"
{
  "totals": {
    "u": 42,
    "t": 128,
    "s": 312.5,
    "dur": 980
  },
  "data": {
    "daily": {
      "2026.4.16": {
        "u": 12,
        "t": 30,
        "s": 75,
        "dur": 240
      }
    }
  },
  "buckets": ["daily"],
  "app_id": "64f5c0d8f4f7ac0012ab3456",
  "lu": "2026-04-17T09:10:11.000Z",
  "query_time": 37
}
```

#### With `projectionKey`

Returns totals, segment metadata, and bucketed data grouped by segment value. Segment labels are built from the projected values. Multiple projection keys are joined with ` | `.

```json title="Example shape"
{
  "totals": {
    "u": 42,
    "t": 128,
    "s": 312.5,
    "dur": 980
  },
  "segments": {
    "iOS": {
      "u": 22,
      "t": 70,
      "s": 180,
      "dur": 500,
      "s0": "iOS",
      "keys": {
        "up.p": "iOS"
      },
      "segment": "iOS"
    }
  },
  "data": {
    "daily": {
      "2026.4.16": {
        "iOS": {
          "u": 10,
          "t": 28,
          "s": 70,
          "dur": 210,
          "keys": {
            "up.p": "iOS"
          }
        }
      }
    }
  },
  "buckets": ["daily"],
  "page_data": {
    "total": 3,
    "limit": 10,
    "start": 1,
    "end": 3,
    "pages": 1,
    "curPage": 1
  }
}
```

#### With `projectionKey` and `list=true`

Returns table/list-style segment rows. This mode is used for segment tables and pagination. Time-series `data` can be empty or contain only initialized bucket objects, depending on backend and data availability.

```json title="Example shape"
{
  "totals": {
    "u": 42,
    "t": 128,
    "s": 312.5,
    "dur": 980
  },
  "segments": {
    "iOS": {
      "u": 22,
      "t": 70,
      "s": 180,
      "dur": 500,
      "keys": {
        "up.p": "iOS"
      },
      "segment": "iOS"
    }
  },
  "page_data": {
    "total": 3,
    "limit": 10,
    "start": 1,
    "end": 3,
    "pages": 1,
    "curPage": 1
  },
  "data": {
    "daily": {}
  },
  "buckets": ["daily"]
}
```

#### Long-running query

If the same long-running query is already running, or if the request is pushed into the long-task path, the endpoint can return a task reference instead of final data.

```json
{
  "task_id": "65f1f7b2ad5b9b001f12ab34"
}
```

#### Cached query

When a cached result is reused, the payload has the same result shape as the original query and includes:

```json
{
  "cached": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `totals` | Object | Overall totals for the query. Common metric keys are `u` (unique users), `t` (total count), `s` (sum), and `dur` (duration). |
| `data` | Object | Bucketed graph data. Keys are requested bucket names such as `daily`, `weekly`, or `monthly`. |
| `data.<bucket>.<period>` | Object | Unprojected bucket totals for one period, or an object keyed by segment label when `projectionKey` is used. |
| `segments` | Object | Segment totals keyed by segment label. Present when `projectionKey` is used. |
| `segments.<segment>.keys` | Object | Maps each requested `projectionKey` to the segment value represented by that row. |
| `page_data` | Object | Pagination metadata for projected segment rows. Commonly present for projected/list results. |
| `buckets` | Array | Bucket values used by the query after parsing. |
| `app_id` | String | App id copied into newly computed responses. |
| `lu` | String/Date | Last update timestamp for newly computed or cached responses. |
| `query_time` | Number | Query execution time in milliseconds for newly computed responses. |
| `cached` | Boolean | Present and `true` when returning cached data. |
| `task_id` | String | Present instead of result data when the query is represented by a long task. |

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
- Parses `queryObject` from JSON string into an object.
- Adds `ts` period bounds internally.
- Adds app/event constraints internally before the backend query runs:
  - `a` is set from `app_id`
  - `e` is set from `event`
  - custom events are queried as `e="[CLY]_custom"` with `n=<event>`
- Runs segmentation query on selected backend.
- If `projectionKey` is provided, fetches segmentation field types and returns grouped segment results.
- If `list=true` is provided with `projectionKey`, uses table/list aggregation and pagination.
- With `db_override=compare`, runs both MongoDB and ClickHouse and returns comparison-selected output.

## Query Object

`queryObject` is a Drill filter object encoded as JSON. The object uses stored Drill field names:

| Prefix/field | Meaning | Examples |
|---|---|---|
| `up.*` | User profile fields stored with the event row. | `up.p` platform, `up.cc` country code, `up.av` app version |
| `sg.*` | Event segmentation fields. | `sg.plan`, `sg.campaign`, `sg.ItemID` |
| `uid` | Countly user/device identifier. | `{"uid":{"$in":["device-1","device-2"]}}` |
| `c` | Event count. | `{"c":{"$gte":1}}` |
| `s` | Event sum. | `{"s":{"$gt":20}}` |
| `dur` | Event duration. | `{"dur":{"$gte":60}}` |
| `chr` | Cohort filter, preprocessed by the Cohorts plugin when available. | `{"chr":"65f1f7b2ad5b9b001f12ab34"}` |

Supported operators are Mongo-style operators accepted by the Drill backend, such as `$in`, `$nin`, `$gt`, `$gte`, `$lt`, `$lte`, `$ne`, `$exists`, `$and`, `$or`, and `$nor`.

Do not normally include `a`, `e`, `n`, or `ts` in `queryObject`; the endpoint derives those from `app_id`, `event`, and `period`.

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

### Filter by user profile fields

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={"up.cc":{"$in":["US","CA"]},"up.p":{"$in":["iOS"]}}&
  period=30days&
  bucket=daily
```

### Filter by event segmentation

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={"sg.plan":{"$in":["pro","enterprise"]},"s":{"$gte":20}}&
  period=30days&
  bucket=daily
```

### Use logical operators in `queryObject`

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={"$or":[{"up.cc":{"$in":["US"]}},{"sg.campaign":{"$in":["spring-sale"]}}]}&
  period=30days&
  bucket=daily
```

### Query grouped by platform

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={"up.cc":"US"}&
  projectionKey=up.p&
  period=30days&
  bucket=daily
```

### Query grouped by multiple fields

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={"sg.plan":{"$exists":true}}&
  projectionKey=["up.p","sg.plan"]&
  period=30days&
  bucket=daily&
  limit=20
```

### Table/list mode for projected segments

```text
/o?method=segmentation&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={"sg.plan":{"$exists":true}}&
  projectionKey=sg.plan&
  list=true&
  period=30days&
  bucket=daily&
  limit=10&
  skip=0&
  sort={"u":-1}
```

---

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Bookmarks - Read](bookmarks-read.md)

---

## Last Updated

2026-04-17
