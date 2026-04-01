---
sidebar_label: "List Jobs"
keywords:
  - "/o"
  - "o"
---

# List symbolication jobs

## Endpoint

```
/o?method=crash_jobs
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Lists symbolication jobs with optional platform/status filtering and DataTable pagination.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `crash_jobs` |
| `app_id` | String | Yes | Application identifier |
| `platform` | String | No | Filter by job platform |
| `status` | String | No | Filter by status (`started`, `in process`, `success`, `errored`) |
| `iDisplayStart` | Number | No | Pagination offset (DataTable) |
| `iDisplayLength` | Number | No | Page size (DataTable) |
| `sSearch` | String | No | Search term |
| `outputFormat` | String | No | `full` (default) or `rows` |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes.*` | Crashes feature defaults | Crash-job query behavior and filtering options used by this endpoint. | Changes to crashes settings can alter which job rows are returned or how they are grouped/filtered. |

## Response

### Success Response

Default (`outputFormat=rows`):

```json
[
  {
    "_id": "65c5de2a2c5f5300121a0011",
    "ts": 1739624770000,
    "platform": "JavaScript",
    "build": "1.4.2",
    "status": "success",
    "log": ["Started", "Stack trace updated"]
  }
]
```

`outputFormat=full`:

```json
{
  "sEcho": "1",
  "iTotalRecords": 2,
  "iTotalDisplayRecords": 2,
  "aaData": [
    {
      "_id": "65c5de2a2c5f5300121a0011",
      "ts": 1739624770000,
      "platform": "JavaScript",
      "build": "1.4.2",
      "status": "success",
      "log": ["Started", "Stack trace updated"]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array or Object | Array by default (`outputFormat=rows`), or DataTable object for `outputFormat=full`. |
| `[].platform` | String | Symbolication path/platform label (rows output). |
| `[].build` | String | Build value used for the job (rows output). |
| `[].status` | String | Job status (rows output). |
| `[].log` | Array | Job log entries (rows output). |
| `sEcho` | String | DataTable echo value (`outputFormat=full`). |
| `iTotalRecords` | Number | Total matching records before search (`outputFormat=full`). |
| `iTotalDisplayRecords` | Number | Total records after search/filter (`outputFormat=full`). |
| `aaData` | Array | Job rows (`outputFormat=full`). |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `false` when aggregation fails |
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.symbolication_jobs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: List all jobs

```text
/o?method=crash_jobs&app_id=5f9c8a3b4d1e2a001f3b4567&api_key=YOUR_API_KEY
```

### Example 2: Filter by status and platform

```text
/o?method=crash_jobs&app_id=5f9c8a3b4d1e2a001f3b4567&platform=JavaScript&status=success&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Run Symbolication](crash-symbolicate.md)
- [Symbolication Result Callback](crash-symbolicate-result.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
