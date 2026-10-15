---
sidebar_label: "Suspend Job"
keywords:
  - "/o?method=suspend_job"
  - "suspend_job"
  - "jobs"
last_update:
  date: "2026-10-09"
---

# /o?method=suspend_job

## Endpoint

```plaintext
/o?method=suspend_job
```

## Overview

Suspends a scheduled job, or sets a suspended job back to scheduled.

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
| `method` | String | Yes | Must be `suspend_job`. |
| `id` | String | Yes | `_id` of the job record, as returned by [Jobs List](./o-jobs.md). |
| `suspend` | Boolean | Yes | `true` to suspend a scheduled job; `false` to schedule a suspended job again. |

## Examples

### Example 1: Suspend a job

```plaintext
/o?method=suspend_job&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
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

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Boolean | `true` when the job status was changed. |
| `message` | String | Outcome message. |

### Error Responses

The request is answered with status `200` and `result` set to `false` when the job was not changed:

```json
{
  "result": false,
  "message": "Updating job status failed, please check api logs"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"app_id\""
}
```

## Behavior

- With `suspend=true` only a job that is currently `SCHEDULED` is changed, to `SUSPENDED`.
- With `suspend=false` only a job that is currently `SUSPENDED` is changed, to `SCHEDULED`.
- A job in any other state is left as it is and `result` is `false`.

## Related Endpoints

- [Jobs List](./o-jobs.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.jobs` | Job storage | Updates the `status` of one job record. |

</details>
