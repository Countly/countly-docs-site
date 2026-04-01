---
sidebar_label: "Export Database"
keywords:
  - "/o/export/db"
  - "db"
  - "export"
---

# /o/export/db

## Endpoint

```plaintext
/o/export/db
```

## Overview

Exports documents from an accessible collection and returns them as a downloadable payload (JSON/CSV/XLS/XLSX).

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires authenticated dashboard user access.
- Collection-level access is validated for the requesting user.
- For non-global users, `drill_events` and `events_data` exports are additionally constrained by app-scope base filters.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `collection` | String | Yes | Target collection name to export. |
| `db` | String | No | Database alias: `countly` (default), `countly_drill`, `countly_out`, `countly_fs`. |
| `filter` | JSON String (Object) | No | Mongo-style filter; parsed into `query` when provided. |
| `query` | JSON String (Object) | No | Filter object alternative to `filter`. |
| `projection` | JSON String (Object) | No | Field projection object. |
| `project` | JSON String (Object) | No | Projection alias (same behavior as `projection`). |
| `sort` | JSON String (Object) | No | Sort object. Example: `{"ts": -1}`. |
| `limit` | Number | No | Max returned document count. Clamped by `api.export_limit`. |
| `skip` | Number | No | Number of matching documents to skip. |
| `type` | String | No | Export file type. Common values: `json`, `csv`, `xls`, `xlsx`. |
| `filename` | String | No | Download file name prefix. |
| `formatFields` | JSON String (Object) | No | Field-format mapping used to transform exported field values. |
| `get_index` | JSON String (Boolean/Object) | No | If truthy and parsable, returns index metadata export instead of collection document export. |

## Parameter Semantics

- `filter` is parsed first; if omitted, `query` is used.
- `query` and `filter` are Mongo-style JSON objects serialized into the request URL. Use operators such as `$gte`, `$lte`, `$in`, and `$regex` inside that JSON.
- `type` controls the downloaded file format, while `formatFields` controls how field values are rendered inside that file.
- `projection` follows Mongo projection rules, but this export path force-adds `_id` whenever a non-empty projection is provided.
- `sort` is a Mongo-style sort object where `1` means ascending and `-1` means descending.
- `get_index` switches the endpoint from document export mode to index metadata export mode.
- Invalid `projection`, `project`, `sort`, `formatFields`, or `get_index` values are ignored (set to `null`) rather than returning parse errors.
- Non-global users are restricted to accessible collections; additional base filtering is applied for event-heavy collections.
- If request `query` already includes a base-filtered key, both constraints are merged with `$and` to prevent scope bypass.

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.export_limit` | Server config | `limit` handling | Requested `limit` is capped to this value. |

## Response

### Success Response

CSV export example (file content):

```csv
_id,name,value
65a16f6b8e43c117c38d8f02,Playback Started,124
65a16f6b8e43c117c38d8f03,Playback Resumed,91
```

JSON export example (file content):

```json
[
  {
    "_id": "65a16f6b8e43c117c38d8f02",
    "name": "Playback Started",
    "value": 124
  },
  {
    "_id": "65a16f6b8e43c117c38d8f03",
    "name": "Playback Resumed",
    "value": 91
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(download body)` | String or Binary | Exported file content in requested `type`. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"collection\""
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Failed to parse query. Unexpected token ..."
}
```

**Status Code**: `401 Unauthorized`
```json
{
  "result": "User does not have access right for this collection"
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Index export mode | `get_index` is provided and parses truthy | Reads collection index metadata and exports it through data-conversion flow. | Download stream/body (format depends on `type`) |
| Document export mode | Default branch | Applies query/projection/sort/skip/limit and exports collection documents. | Download stream/body (format depends on `type`) |
| Scoped document mode | Caller is non-global and collection is `drill_events` or `events_data` | Merges caller app-scope base filters into query before export cursor is built. | Download stream/body (format depends on `type`) |

### Impact on Other Data

- Read-only endpoint. Does not modify collection documents.

## Audit & System Logs

- No `/systemlogs` action is emitted by this endpoint itself.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and collection access validation | Reads caller identity for management-read checks and collection-level access rules. |
| `countly.[collection]` | Export source when `db=countly` (default) | Reads documents or indexes from requested collection. |
| `countly_drill.[collection]` | Export source when `db=countly_drill` | Reads documents or indexes from requested drill collection. |
| `countly_out.[collection]` | Export source when `db=countly_out` | Reads documents or indexes from requested out database collection. |
| `countly_fs.[collection]` | Export source when `db=countly_fs` | Reads documents/index-like metadata via GridFS handler-backed collection access. |

---

## Examples

### Example 1: Export events as CSV

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=events_data&
  db=countly&
  query={"_id":{"$regex":"6991c75b024cb89cdc04efd2_"}}&
  sort={"_id":1}&
  limit=100&
  type=csv&
  filename=events-export
```

### Example 2: Export drill events as JSON

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=drill_events&
  db=countly_drill&
  query={"a":"6991c75b024cb89cdc04efd2"}&
  limit=50&
  type=json&
  filename=drill-events
```

### Example 3: Filter by date range and status

`query` is a JSON object, not a SQL fragment. This example exports users created on or after a Unix-millisecond timestamp and with one of two statuses:

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=app_users6991c75b024cb89cdc04efd2&
  query={"created_at":{"$gte":1711929600000},"status":{"$in":["active","trial"]}}&
  type=json&
  filename=filtered-users
```

### Example 4: Return only selected fields

Use `projection` to limit exported columns. A value of `1` includes the field.

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=app_users6991c75b024cb89cdc04efd2&
  query={"email":{"$regex":"@example.com$"}}&
  projection={"email":1,"name":1,"lac":1}&
  type=csv&
  filename=user-emails
```

This produces a CSV with only the projected fields plus `_id`.

### Example 5: Sort and paginate the export

Use `sort`, `skip`, and `limit` together to export a specific slice of a larger result set.

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=events&
  sort={"c":-1}&
  skip=100&
  limit=50&
  type=xlsx&
  filename=top-events-page-3
```

This example sorts by `c` descending, skips the first 100 matching documents, and exports the next 50.

### Example 6: Format timestamp and numeric fields

`formatFields` does not filter data. It transforms field values in the exported file. This example converts Unix timestamps into formatted dates, formats a number field, and formats a duration field expressed in seconds.

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=app_users6991c75b024cb89cdc04efd2&
  projection={"uid":1,"lac":1,"tsd":1,"sc":1}&
  formatFields={
    "tz":"Europe/Riga",
    "fields":{
      "lac":{"to":"time","format":"YYYY-MM-DD HH:mm:ss"},
      "tsd":{"type":"second"},
      "sc":{"type":"number"}
    }
  }&
  type=csv&
  filename=formatted-users
```

Supported transformations in `formatFields.fields.FIELD_NAME` include:

- `{"to":"time"}` to render timestamps as dates in the provided `tz`
- `{"type":"number"}` to format a numeric value
- `{"type":"second"}` to format a duration stored in seconds
- `{"formula":{"$eq":"other_field"}}` to copy another field into a calculated export column

### Example 7: Export index metadata instead of documents

Set `get_index` to a truthy JSON value to export collection indexes.

```plaintext
/o/export/db?
  api_key=YOUR_API_KEY&
  collection=events_data&
  get_index=true&
  type=json&
  filename=events-data-indexes
```

This returns index definitions for the collection instead of matching documents.

## Operational Considerations

- Large exports can be expensive on large collections.
- Non-stream export paths may materialize data before conversion.
- Use narrow filters and explicit projections for large datasets.

## Limitations

- Access to arbitrary collections is restricted by collection permission checks.
- Invalid JSON in `filter`/`query` returns parse error and no export file.
- Non-global exports of `drill_events` and `events_data` cannot exceed caller app scope because base filtering is enforced server-side.

---

## Related Endpoints

- [Data Export - Export Request](./o-export-request.md)
- [Data Export - Export Request Query](./o-export-requestquery.md)
- [Data Export - Download Export](./o-export-download.md)

## Last Updated

2026-04-01
