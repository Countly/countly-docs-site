---
sidebar_label: "Export Request Query"
keywords:
  - "/o/export/requestQuery"
  - "requestQuery"
  - "export"
last_update:
  date: "2026-02-17"
---

# /o/export/requestQuery

## Endpoint

```plaintext
/o/export/requestQuery
```

## Overview

Creates an asynchronous export task from a target API query and returns a task ID immediately.

Only paths registered as export query producers are accepted. The endpoint re-runs the named producer, which builds and authorizes the query itself; any other `path` is rejected with `400 Path is not an export query producer`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires authenticated dashboard user access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | No | Optional app ID attached to created export task metadata. |
| `path` | String | Yes | Path (with query string) of a registered export query producer. See [Supported Paths](#supported-paths). |
| `method` | String | No | Optional method value forwarded to request pipeline. |
| `data` | JSON String (Object) | No | Request payload for target query. |
| `db` | String | No | Ignored. The database is chosen by the matched producer (`countly` or `countly_drill`), not by the caller. |
| `type` | String | No | Export format (`json`, `csv`, `xls`, `xlsx`). |
| `filename` | String | No | Export base file name (extension is appended from `type`). |
| `type_name` | String | No | Task type label in task metadata (default: `tableExport`). |

## Parameter Semantics

- `path` is parsed as a URL. Its pathname must be `/o` or start with `/o/`, and must match a registered producer together with that producer's pinned query parameters; otherwise the request fails with `Path is not an export query producer`.
- The producer's pinned parameters are forced onto `path` before it is re-run, so the caller cannot switch the producer into another mode.
- `data` parse failures fall back to `{}`.
- Task metadata stores report file name as `filename + "." + type`.

## Supported Paths

In 24.05, these export query producers are registered:

| Producer path | Required (pinned) parameters | Database | Plugin |
|---|---|---|---|
| `/o` | `method=views`, `action=getExportQuery` | `countly` | Views |
| `/o/heatmaps/export` | none | `countly` | Heatmaps (Enterprise) |
| `/o/surveys/survey/data` | `method=export`, `action=getExportQuery` | `countly_drill` | Surveys (Enterprise) |

## Examples

### Example 1: Create async CSV export of the Views table

```plaintext
/o/export/requestQuery?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  path=/o?method=views&action=getExportQuery&app_id=6991c75b024cb89cdc04efd2&period=30days&
  type=csv&
  filename=views-30days
```

The `path` value must be URL-encoded when sent, for example `path=%2Fo%3Fmethod%3Dviews%26action%3DgetExportQuery%26app_id%3D6991c75b024cb89cdc04efd2%26period%3D30days`.

### Example 2: Path that is not a producer

```plaintext
/o/export/requestQuery?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  path=/o/analytics/events&
  type=json&
  filename=events
```

Returns `400` with `Path is not an export query producer`.

## Response

### Success Response

```json
{
  "result": {
    "task_id": "17f0f6c3a2c42cbced96d4a01f88f9a7f45bc7a5"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Wrapped long-task creation payload. |
| `result.task_id` | String | ID of created export task. Use this ID to download task output later. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"path\""
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Path is not an export query producer"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Valid request mode | `path` is provided and request validates | Creates long task immediately (`force` mode), returns wrapped `task_id`, continues export in background. | Wrapped object `{ "result": { "task_id": "..." } }` |
| Invalid request mode | `path` is missing, unparsable, or not a registered export query producer | Fails validation before task creation. | Wrapped string error (for example missing `path`) |

### Impact on Other Data

- Creates/updates task metadata and export result files.

## Operational Considerations

- This endpoint is asynchronous by design.
- Use [Data Export - Download Export](./o-export-download.md) with the returned `task_id` to fetch final output.

## Limitations

- Returns only task creation response, not final export data.
- Final export availability depends on task completion and output size.

## Related Endpoints

- [Data Export - Download Export](./o-export-download.md)
- [Tasks - Task Status](../tasks/o-tasks-task.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- No `/systemlogs` action is emitted by this endpoint itself for normal task creation flow.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication validation | Reads caller identity for management-read access validation. |
| `countly.long_tasks` | Async export task state | Creates and updates export task records. |
| `countly_fs.task_results` | Async export output storage | Stores export result file content for later download. |

</details>
