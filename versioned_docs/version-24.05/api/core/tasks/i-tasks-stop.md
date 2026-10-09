---
sidebar_label: "Stop Task"
keywords:
  - "/i/tasks/stop"
  - "stop"
  - "tasks"
last_update:
  date: "2026-10-09"
---

# /i/tasks/stop

## Endpoint

```plaintext
/i/tasks/stop
```

## Overview

Stops a running task by ending the database operation that is executing it.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires write access to feature `core` for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | App ID used for write-permission validation. |
| `task_id` | String | Yes | ID of the task to stop. |

## Examples

### Example 1: Stop task

```plaintext
/i/tasks/stop?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  task_id=17f0f6c3a2c42cbced96d4a01f88f9a7f45bc7a5
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Outcome message. |

### Error Responses

**Status Code**: `200 OK`

```json
{
  "result": "Task does not exist"
}
```

```json
{
  "result": "No permission to stop this task"
}
```

```json
{
  "result": "Operation could not be stopped"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Response |
|---|---|---|
| Task stopped | `task_id` exists in `long_tasks` and the database accepts the stop request. | `{ "result": "Success" }` |
| Task missing | `task_id` is not found. | `{ "result": "Task does not exist" }` |
| Creator missing | The task has a creator that no longer exists as a dashboard member. | `{ "result": "No permission to stop this task" }` |
| Stop refused | The database could not end the operation. | `{ "result": "Operation could not be stopped" }` |

- The endpoint answers with HTTP status `200` in all of these cases, so check the `result` text.

## Related Endpoints

- [Tasks - Check Task Status](./o-tasks-check.md)
- [Tasks - Read Task](./o-tasks-task.md)
- [Tasks - Delete Task](./i-tasks-delete.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission validation | Reads member identity and app-level write permissions; checks that the task creator still exists. |
| `countly.long_tasks` | Task metadata storage | Reads the task document to find the database operation to stop. |

</details>
