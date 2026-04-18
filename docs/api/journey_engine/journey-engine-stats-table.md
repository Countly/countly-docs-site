---
sidebar_label: "Stats Table Read"
keywords:
  - "/o/journey-engine/stats/table"
  - "GET /o/journey-engine/stats/table"
  - "table"
  - "journey-engine"
  - "stats"
---

# Journey Engine - Stats Table

## Endpoint

```
/o/journey-engine/stats/table
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve journey instance table data with pagination. For large datasets, the endpoint may create a background task and return a `task_id` for polling.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

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

## Examples

### Query table data
```
GET /o/journey-engine/stats/table?app_id=64afe321d5f9b2f77cb2c8ed&journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days&iDisplayStart=0&iDisplayLength=25
```

### Retrieve data for a task
```
GET /o/journey-engine/stats/table?taskId=65a7c1e6f1c2a40001abc123&iDisplayStart=0&iDisplayLength=25
```

## Behavior/Processing

- If `taskId` is provided, loads stored task result data and applies `iDisplayStart`/`iDisplayLength` pagination.
- Without `taskId`, filters `journey_instances` by `journeyVersionId`, `journeyDefinitionId`, `status`, and selected period.
- Joins `app_users{app_id}` by `appUserId` to expose user details.
- Uses `common.DataTable` for sorting, search, projection, and paging.
- Very large estimated result sets are processed through the long-task manager and can return `{ "task_id": "..." }`.
- Task results may be stored in per-task `journey_task_data_<taskId>` collections for paginated retrieval.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_instances` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Related Endpoints

- No related endpoints

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-04-18
