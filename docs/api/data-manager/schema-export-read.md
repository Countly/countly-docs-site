---
sidebar_label: "Schema Export"
---
# Export event schema as CSV

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/export-schema
```

## Overview

Exports app event and segment schema as a CSV document.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```text
Event Name,Event Description,Event Category,#of Segments,Segment Name,Segment Description,Segment Type,Segment Status,Segment Required,Segment List Options,Segment Regex
purchase,Purchase event,Revenue,2,country,,String,active,true,,
purchase,Purchase event,Revenue,2,amount,,Number,active,false,,
```

Note: the endpoint returns raw CSV body (`text/csv`) via `common.returnRaw(...)`, not JSON.

### Response Fields

| Field | Type | Description |
|---|---|---|
| CSV rows | Text | Exported event/segment schema table. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

- Builds event map from `countly.events` and `countly_drill.drill_meta`.
- Joins category names from `countly.event_categories`.
- Expands segment rows (including list options when available).
- Returns CSV with `Content-Type: text/csv`.

## Audit & System Logs

- This endpoint does not emit `/systemlogs` actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Base schema source | Reads app event list/map/segment index used to build exported rows. |
| `countly_drill.drill_meta` | Extended event/segment metadata source | Reads status/type/regex/list-value metadata merged into CSV rows. |
| `countly.event_categories` | Category-name lookup | Resolves event category IDs to display names in export output. |

---

## Examples

```text
/i/data-manager/export-schema?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Operational Considerations

- Export performs metadata joins across events, drill meta, and categories, then renders CSV in-memory.
- Large event catalogs with many segments can produce large response bodies.

---

## Related Endpoints

- [Schema Import - Update](schema-import-update.md)

---

## Last Updated

2026-02-16
