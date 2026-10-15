---
sidebar_label: "Read Jobs"
keywords:
  - "/o?method=jobs"
  - "jobs"
last_update:
  date: "2026-10-15"
---

# Jobs - Read Jobs

## Endpoint

```plaintext
/o?method=jobs
```

## Overview

Returns the scheduled jobs of the server as a table. Without `name`, one row per job name is returned. With `name`, the individual runs of that job are returned.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires a global administrator.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `jobs`. |
| `app_id` | String | Yes | Application ID. The request is rejected if it is missing. |
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `name` | String | No | Job name. When set, the runs of this job are returned instead of the job list. |
| `sSearch` | String | No | Text to look for in job names. Only used when `name` is not set. |
| `iDisplayStart` | Number | No | Number of rows to skip. Default is `0`. |
| `iDisplayLength` | Number | No | Number of rows to return. Default is `10`. |
| `iSortCol_0` | Number | No | Index of the column to sort by. Default is `0`. The columns are `name`, `schedule`, `next`, `finished`, `status`, `total` for the job list, and `schedule`, `next`, `finished`, `status`, `data`, `duration` for the runs of a job. |
| `sSortDir_0` | String | No | `asc` for ascending order; any other value sorts in descending order. |
| `sEcho` | String | No | Counter that is returned unchanged in the response. |

## Examples

### List jobs

```plaintext
/o?method=jobs&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY
```

### List runs of one job

```plaintext
/o?method=jobs&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
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
| `sEcho` | String | The `sEcho` value of the request. |
| `iTotalRecords` | Number | Total number of jobs (or of runs, when `name` is set). |
| `iTotalDisplayRecords` | Number | Same value as `iTotalRecords`. |
| `aaData` | Array | Rows of the table. |
| `aaData[].name` | String | Job name. |
| `aaData[].status` | String | Job status: `SCHEDULED`, `RUNNING`, `DONE`, `CANCELLED`, `ABORTED`, `PAUSED`, `WAITING` or `SUSPENDED`. |
| `aaData[].schedule` | String | Schedule of the job. |
| `aaData[].next` | Number | Time of the next run, as a timestamp in milliseconds. |
| `aaData[].finished` | Number | Time the job last finished, as a timestamp in milliseconds. |
| `aaData[].total` | Number | Number of stored runs of the job. Only in the job list. |

When `name` is set, each row is a single run of the job and also has the job's own fields, such as `created`, `started`, `duration`, `data` and `error`.

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"app_id\""
}
```

Authentication and authorization failures are returned by the common auth layer.

## Behavior

- In the job list, the status shown for a job is taken from its run that is scheduled first, then suspended ones, then the most recently finished.
- `sSearch` matches job names as plain text, ignoring case, and is limited to 256 characters.

## Related Endpoints

- [Jobs - Suspend Job](./o-suspend-job.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.jobs` | Job schedules and runs | Reads job documents. |

</details>
