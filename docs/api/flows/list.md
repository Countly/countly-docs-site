---
sidebar_label: "List"
---

# List flows

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/flows?method=list
```

## Overview

Returns paginated flow schemas for the app in DataTables-compatible format.

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
| `method` | String | Yes | Must be `list`. |
| `app_id` | String | Yes | Target app ID. |
| `iDisplayStart` | Number | No | Pagination offset. |
| `iDisplayLength` | Number | No | Pagination size (`-1` means no limit). |
| `iSortCol_0` | Number | No | Sort column index. |
| `sSortDir_0` | String | No | Sort direction `asc`/`desc`. |
| `sSearch` | String | No | Case-insensitive name filter. |
| `sEcho` | String | No | Echo value returned in response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 2,
  "iTotalDisplayRecords": 2,
  "aaData": [
    {
      "_id": "64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567",
      "name": "Signup to Purchase",
      "status": "new",
      "type": "events"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Echo value from request (if provided). |
| `iTotalRecords` | Number | Total flow count for app. |
| `iTotalDisplayRecords` | Number | Display count used by client table. |
| `aaData` | Array | Flow schema list. |

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior/Processing

- Reads `countly.flow_schemas` by app-prefixed `_id`.
- Parses `user_segmentation` JSON string when possible.
- Cleans quoted `period` strings.
- Forces `status="disabled"` when `disabled` flag is set.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o/flows?
  method=list&
  app_id=64f5c0d8f4f7ac0012ab3456&
  iDisplayStart=0&
  iDisplayLength=10&
  sSearch=signup
```

---

## Related Endpoints

- [Flows - Info](info.md)
- [Flows - Create](create.md)

---

## Last Updated

2026-02-16
