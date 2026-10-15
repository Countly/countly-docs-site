---
sidebar_label: "Suspend Job"
keywords:
  - "/o?method=suspend_job"
  - "suspend_job"
  - "jobs"
last_update:
  date: "2026-10-15"
---

# Jobs - Suspend Job

## Endpoint

```plaintext
/o?method=suspend_job
```

## Overview

Suspends a scheduled job, or schedules a suspended job again.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires a global administrator.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `suspend_job`. |
| `app_id` | String | Yes | Application ID. The request is rejected if it is missing. |
| `id` | String (ObjectID) | Yes | ID of the job, as returned in `_id` by [Jobs - Read Jobs](./o-jobs.md) when `name` is set. |
| `suspend` | Boolean | Yes | `true` suspends a scheduled job. `false` schedules a suspended job again. |
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |

## Examples

### Suspend a job

```plaintext
/o?method=suspend_job&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  id=62596cd41307dc89c269b5a8&
  suspend=true
```

## Response

### Success Response

```json
{
  "result": true,
  "message": "Job suspended successfully"
}
```

When a job is scheduled again (`suspend=false`), `message` is `Job scheduled successfully`.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Boolean | `true` if the job status was changed. |
| `message` | String | Description of the outcome. |

### Error Responses

If the job is not found, is not in the expected status (`SCHEDULED` to suspend, `SUSPENDED` to schedule again), or the parameters are invalid, `result` is `false`:

```json
{
  "result": false,
  "message": "Updating job status failed, please check api logs"
}
```

## Behavior

- Only a job that is `SCHEDULED` can be suspended, and only a job that is `SUSPENDED` can be scheduled again.

## Related Endpoints

- [Jobs - Read Jobs](./o-jobs.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.jobs` | Job schedules | Updates the status of one job document. |

</details>
