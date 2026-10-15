---
sidebar_label: "Jobs List"
keywords:
  - "/o?method=jobs"
  - "jobs"
last_update:
  date: "2026-10-09"
---

# /o?method=jobs

## Endpoint

```plaintext
/o?method=jobs
```

## Overview

Lists the background jobs of the server, one row per job name. When `name` is given, lists the individual runs of that job instead.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires a global administrator.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | App ID. The request is rejected without it. |
| `method` | String | Yes | Must be `jobs`. |
| `name` | String | No | Job name. When set, returns the runs of this job. |
| `sSearch` | String | No | Text to look for in job names. Plain text, case-insensitive, at most 256 characters. Only applies to the list without `name`. |
| `iDisplayStart` | Number | No | Number of rows to skip. Default `0`. |
| `iDisplayLength` | Number | No | Number of rows to return. Default `10`. |
| `iSortCol_0` | Number | No | Index of the column to sort by. |
| `sSortDir_0` | String | No | `asc` for ascending; any other value sorts descending. |
| `sEcho` | String | No | Counter returned unchanged in the response. |

**Sortable columns** (`iSortCol_0`): without `name`: `name`, `schedule`, `next`, `finished`, `status`, `total` (0-5). With `name`: `schedule`, `next`, `finished`, `status`, `data`, `duration` (0-5).

## Examples

### Example 1: List jobs

```plaintext
/o?method=jobs&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  iDisplayStart=0&
  iDisplayLength=10
```

### Example 2: List the runs of one job

```plaintext
/o?method=jobs&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  name=api:ping
```

## Response

### Success Response

```json
{
  "sEcho": "0",
  "iTotalRecords": 14,
  "iTotalDisplayRecords": 14,
  "aaData": [
    {
      "_id": "server-stats:stats",
      "name": "server-stats:stats",
      "status": "SCHEDULED",
      "schedule": "every 1 day",
      "next": 1650326400000,
      "finished": 1650240007917,
      "total": 1
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Value of the `sEcho` request parameter. |
| `iTotalRecords` | Number | Total number of rows. |
| `iTotalDisplayRecords` | Number | Same as `iTotalRecords`. |
| `aaData` | Array | Job rows. |
| `aaData[].name` | String | Job name. |
| `aaData[].status` | String | Job status as text. |
| `aaData[].schedule` | String | Schedule of the job. |
| `aaData[].next` | Number | Next run time (ms since epoch). |
| `aaData[].finished` | Number | Last finish time (ms since epoch). |
| `aaData[].total` | Number | Number of stored runs of this job name. |

With `name`, each row is a stored run of the job and contains the full job record (for example `created`, `started`, `finished`, `duration`, `data`, `schedule`, `next`, `modified`, `error`).

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"app_id\""
}
```

**Status Code**: `500`
```json
"Fetching jobs failed"
```

## Behavior

- Without `name`, rows are grouped by job name. For each name the row shown is a running or scheduled run if there is one, otherwise the most recently finished one.

## Related Endpoints

- [Suspend Job](./o-suspend-job.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.jobs` | Job storage | Reads job records. |

</details>
