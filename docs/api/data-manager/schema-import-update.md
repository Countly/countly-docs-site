---
sidebar_label: "Schema Import"
keywords:
  - "/i/data-manager/import-schema"
  - "import-schema"
  - "data-manager"
---
# Import event schema from CSV

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/import-schema
```

## Overview

Imports event/segment schema definitions from a CSV file and upserts metadata.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `import_file` | File | Yes | CSV schema file uploaded as multipart form-data. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when import completes. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

- Parses CSV with `csvtojson` from uploaded `import_file`.
- Upserts event metadata into `countly_drill.drill_meta`.
- Updates `countly.events` map/list/segments.
- Inserts missing categories into `countly.event_categories`.
- Supports list segment options by writing `biglist` metadata records.

## Audit & System Logs

- This endpoint does not emit `/systemlogs` actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Imported event/segment metadata storage | Bulk-upserts event metadata documents and segment option metadata (`biglist` records). |
| `countly.events` | Event list/map/segment index | Updates app-level event `list`, `segments`, and `map` objects to match imported schema. |
| `countly.event_categories` | Category dictionary | Reads existing categories and inserts new category documents discovered in CSV. |

---

## Examples

### Endpoint formation

```text
/i/data-manager/import-schema?
  app_id=64f5c0d8f4f7ac0012ab3456
```

### Multipart fields

```text
import_file=schema.csv (binary)
app_id=64f5c0d8f4f7ac0012ab3456
api_key=YOUR_API_KEY
```

## Operational Considerations

- Large schema files can trigger many upserts and category writes in one request.
- Import updates event metadata and segment definitions together; run during controlled maintenance windows for large schema changes.

---

## Related Endpoints

- [Schema Export - Read](schema-export-read.md)

---

## Last Updated

2026-02-16
