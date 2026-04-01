---
sidebar_label: "List"
keywords:
  - "/o"
  - "o"
---

# List funnels

## Endpoint

```text
/o?method=get_funnels
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns funnel definitions for the app, with optional group filtering and DataTable pagination/search parameters.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `get_funnels`. |
| `app_id` | String | Yes | Target app ID. |
| `group` | String | No | Optional group filter. Use `fav` for current member favorites. |
| `iDisplayStart` | Number | No | Pagination offset (DataTable). |
| `iDisplayLength` | Number | No | Page size (DataTable). |
| `iSortCol_0` | Number | No | Sort column index (DataTable). |
| `sSortDir_0` | String | No | Sort direction (`asc` or `desc`). |
| `sSearch` | String | No | Search value for funnel name. |
| `outputFormat` | String | No | `rows` (default) or `full`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

Default (`outputFormat=rows`) response:

```json
[
  {
    "_id": "67bd31c92e7f0b0012ab4567",
    "name": "Purchase Funnel",
    "description": "Product view to purchase",
    "type": "session-independent",
    "steps": ["Product View", "Add to Cart", "Purchase"],
    "created": 1739558400000
  }
]
```

`outputFormat=full` response:

```json
{
  "sEcho": "0",
  "iTotalRecords": 1,
  "iTotalDisplayRecords": 1,
  "aaData": [
    {
      "_id": "67bd31c92e7f0b0012ab4567",
      "name": "Purchase Funnel",
      "description": "Product view to purchase",
      "type": "session-independent",
      "steps": ["Product View", "Add to Cart", "Purchase"],
      "groups": {
        "fav_64f5c0d8f4f7ac0012ab9999": 1
      },
      "created": 1739558400000
    }
  ],
  "favTotal": [
    {
      "value": 1
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Default rows output (`outputFormat=rows`). |
| `sEcho` | String | DataTable echo value (`outputFormat=full`). |
| `iTotalRecords` | Number | Total rows before filtering (`outputFormat=full`). |
| `iTotalDisplayRecords` | Number | Total rows after filtering (`outputFormat=full`). |
| `aaData` | Array | Paged rows (`outputFormat=full`). |
| `favTotal` | Array | Favorite count facet for current member. |

### Error Responses

- `200`

```json
false
```

## Behavior/Processing

- Uses DataTable pipeline for sorting, searching, and pagination.
- Supports group filtering; for favorites it uses `groups.fav_<member_id>`.
- Removes other users' favorite keys before returning rows (`hideGroupValues`).

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o?
  method=get_funnels&
  app_id=64f5c0d8f4f7ac0012ab3456
```

```text
/o?
  method=get_funnels&
  app_id=64f5c0d8f4f7ac0012ab3456&
  group=fav&
  iDisplayStart=0&
  iDisplayLength=10&
  sSearch=purchase
```

---

## Related Endpoints

- [Funnels - Read](funnel-single-read.md)
- [Funnels - Create](funnel-create.md)
- [Funnels - Update](funnel-update.md)
- [Funnels - Delete](funnel-delete.md)
- [Funnels - Analyze](funnel-query-read.md)

---

## Last Updated

2026-02-16
