---
sidebar_label: "Stats Table Read"
keywords:
  - "/o/journey-engine/stats/table"
  - "GET /o/journey-engine/stats/table"
  - "table"
  - "journey-engine"
  - "stats"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Stats Table

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/table
```

## Overview

Retrieve journey instance table data with pagination. For large datasets, the endpoint may create a background task and return a `task_id` for polling.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyVersionId` (optional): Filter by journey version
- `journeyDefinitionId` (optional): Filter by journey definition
- `status` (optional): Filter by instance status
- `period` (required): Time period (e.g., "7days", "30days", "month")
- `iDisplayStart` (optional): Pagination start index (default 0)
- `iDisplayLength` (optional): Pagination page size (default 10)
- `sEcho` (optional): DataTables echo value
- `taskId` (optional): If provided, returns task data with pagination
- `report_name`, `report_desc` (optional): Report metadata when creating task
- `autoRefresh`, `force`, `r_hour`, `linked_to` (optional): Task options

## Examples

### Query table data
```
GET /o/journey-engine/stats/table?app_id=64afe321d5f9b2f77cb2c8ed&journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days&iDisplayStart=0&iDisplayLength=25
```

### Retrieve data for a task
```
GET /o/journey-engine/stats/table?taskId=65a7c1e6f1c2a40001abc123&iDisplayStart=0&iDisplayLength=25
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 1200,
  "iTotalDisplayRecords": 1200,
  "aaData": [
    {
      "appUserId": "user_123",
      "status": "completed",
      "startTime": 1739239212000,
      "endTime": 1739239312000,
      "user_details": {"did": "device_456", "name": "Jane Doe"}
    }
  ]
}
```

### Additional Success Shape

```json
{
  "task_id": "65a7c1e6f1c2a40001abc123"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | DataTables echo value. |
| `iTotalRecords` | Number | Total/estimated records for the query. |
| `iTotalDisplayRecords` | Number | Filtered/display records. |
| `aaData` | Array | Journey instance rows. |
| `aaData[].appUserId` | String | App user ID. |
| `aaData[].status` | String | Journey instance status. |
| `aaData[].startTime` | Number | Instance start timestamp. |
| `aaData[].endTime` | Number or Null | Instance end timestamp. |
| `aaData[].user_details.did` | String | Device ID from joined app user profile. |
| `aaData[].user_details.lac` | Number | Last app contact timestamp from app user profile. |
| `aaData[].user_details.name` | String | App user name. |
| `aaData[].user_details.email` | String | App user email. |
| `task_id` | String | Background task id for large result sets or existing running task. |
| `_dataCollection` | String | Internal task result collection name when task metadata is returned. |
| `_taskId` | String | Internal task id reference when task metadata is returned. |

### Error Responses

- **400**: Invalid pagination parameters
- **404**: Task not found or no data available
- **408**: Task result timeout
- **500**: Query error

## Behavior

- If `taskId` is provided, loads stored task result data and applies `iDisplayStart`/`iDisplayLength` pagination.
- Without `taskId`, filters `journey_instances` by `journeyVersionId`, `journeyDefinitionId`, `status`, and selected period.
- Joins `app_users{app_id}` by `appUserId` to expose user details.
- Uses `common.DataTable` for sorting, search, projection, and paging.
- Very large estimated result sets are processed through the long-task manager and can return `{ "task_id": "..." }`.
- Task results may be stored in per-task `journey_task_data_<taskId>` collections for paginated retrieval.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
