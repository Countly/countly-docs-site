---
sidebar_label: "Read Members"
keywords:
  - "/o?method=cohort"
  - "cohort"
  - "members"
last_update:
  date: "2026-10-09"
---

# Get Cohort Members

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/o?method=cohort`

## Overview

Returns the user IDs (`uid`) of the users currently in a cohort. For a cohort that is not calculated in real time, it can also start a calculation of the cohort and return a task ID instead.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| cohort | String | Yes | ID of the cohort to read |
| manual | Boolean | No | When set, the application ID is appended to `cohort` to build the cohort ID. |
| generate | Boolean | No | Calculate the cohort now instead of reading stored members. Ignored when real-time cohorts are enabled or the cohort is manual. |
| save_report | Boolean | No | With `generate`, keep the calculation as a saved task even if it finishes quickly. |

## Examples

### Example 1: Read cohort members

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=cohort" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID"
```

## Response

### Success Response

```json
[1, 5, 12, 40]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | `uid` values of the users that are currently in the cohort. |
| `task_id` | String | Returned as an object, `{"task_id": "..."}`, when a calculation of this cohort is already running. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing request parameter: cohort"
}
```

```json
{
  "result": "Requested cohort does not exist"
}
```

**Status Code**: `406 Not Acceptable`
```json
{
  "result": "Cannot get cohort results"
}
```

## Behavior

- Looks up the cohort by `cohort` and `app_id`.
- If real-time cohorts are enabled, `generate` is not set, or the cohort is manual, the endpoint reads the `uid` of every app user that is in the cohort and returns them as an array.
- Otherwise it starts a calculation of the cohort as a task. If a calculation for the same request is already running, it returns that task's ID. When the calculation finishes quickly the result is returned directly; otherwise the response points to the task.
- If the drill database is not available, it returns an empty array.

## Related Endpoints

- [Get cohort details](cohort-single-read.md) - GET /o?method=get_cohort
- [Get cohort state](cohort-state-read.md) - GET /o?method=cohortstate
- [Get cohort data](cohort-data-read.md) - GET /o?method=cohortdata

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Cohort definitions | Reads the requested cohort. |
| `countly.app_users{app_id}` | Cohort membership | Reads `uid` of users flagged as members of the cohort. |
| `countly.long_tasks` | Task tracking | Created when a calculation is started. |

</details>
