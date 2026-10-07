---
sidebar_label: "Consent Search"
keywords:
  - "/o/consent/search"
  - "search"
  - "consent"
last_update:
  date: "2026-02-17"
---

# Compliance Hub - Consent Search

## Endpoint

```text
/o/consent/search
```

## Overview

Searches consent event history (`countly.consent_history`) with filtering, sorting, and skip/limit pagination.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `compliance_hub` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `sSearch` | String | No | Text search used against device ID. |
| `filter` / `query` | JSON String (Object) | No | JSON-stringified filter object. |
| `project` / `projection` | JSON String (Object) | No | Projection object for returned fields. |
| `sort` | JSON String (Object) | No | Explicit sort object. |
| `iSortCol_0` | Number | No | DataTables sort column index. |
| `sSortDir_0` | String | No | DataTables sort direction (`asc`/`desc`). |
| `limit` / `iDisplayLength` | Number | No | Page size. If omitted or `0`, no limit is applied. |
| `skip` / `iDisplayStart` | Number | No | Offset. |
| `period` | String | No | Optional period filter applied to `ts`. |
| `sEcho` | String or Number | No | Echo value returned in DataTables-style response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Search consents with pagination

```text
/o/consent/search?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  sSearch=device_123&
  limit=20&
  skip=0
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 150,
  "iTotalDisplayRecords": 40,
  "aaData": [
    {
      "device_id": "device_123",
      "uid": "user_1",
      "type": "sessions",
      "change": {
        "sessions": true
      },
      "ts": 1739788800000
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String or Number | Echo value from request. |
| `iTotalRecords` | Number | Total records for the app matching `query`/`filter`. |
| `iTotalDisplayRecords` | Number | Records matching the full search (including `sSearch` and `period`). |
| `aaData` | Array | Consent history documents for the requested page. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `400`

```json
{
  "result": "Missing parameter \"app_id\""
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

- `400`

```json
{
  "result": "Error. Please check logs."
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Results mode | At least one record matches the app and `query`/`filter` | Queries `countly.consent_history` with sort and skip/limit pagination. | Raw DataTables-style object |
| Empty mode | No records match the app and `query`/`filter` | Returns immediately without running the paged query. | Raw DataTables-style object with empty `aaData` |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Compliance Hub - Consent Current](o-consent-current.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission checks | Reads member account and feature access for read validation. |
| `countly.apps` | App validation/context loading | Validates `app_id` and app context for search scope. |
| `countly.consent_history` | Consent-event history source | Counts and reads consent history documents for the app. |

</details>
