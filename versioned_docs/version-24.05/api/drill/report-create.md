---
sidebar_label: "Report - Create"
keywords:
  - "/o?method=createReport"
  - "createReport"
  - "drill"
last_update:
  date: "2026-10-09"
---

# Create a saved Drill report

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=createReport
```

## Overview

Runs a Drill segmentation query and, for auto-refreshing reports, saves it as a task that is recalculated in the background with daily, weekly and monthly buckets over the last 732 days.

Without `autoRefresh=true` the request behaves like [Query Segmentation - Read](query-segmentation-read.md).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `drill` `Read` permission.

## Request Parameters

All parameters of [Query Segmentation - Read](query-segmentation-read.md) are accepted, with `method` set to `createReport`. The following control the saved report:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `autoRefresh` | String | No | `true` to save the report as an auto-refreshing task. Period is then fixed to 732 days and the bucket is calculated for daily, weekly and monthly. |
| `report_name` | String | No | Name of the report. |
| `report_desc` | String | No | Description of the report. |
| `period_desc` | String | No | Period description stored with the report. |
| `global` | String | No | `true` to make the report visible to other members. |
| `manually_create` | String | No | `true` when the report is created by hand. |
| `task_id` | String | No | Existing task to update instead of creating a new one. |
| `linked_to` | String | No | ID of an item the report is linked to. |
| `projectionKey` | String or JSON String (Array) | No | Group-by field or fields. A saved auto-refresh report is only created when no group-by field is given; otherwise the request is processed as a plain segmentation query. |

## Examples

### Save an auto-refreshing report

```text
/o?method=createReport&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={}&
  period=30days&
  bucket=daily&
  autoRefresh=true&
  report_name=Weekly sessions
```

## Response

For an auto-refreshing report the response contains the ID of the created task:

```json
{
  "task_id": "17f0f6c3a2c42cbced96d4a01f88f9a7f45bc7a5"
}
```

Otherwise the response is the same as for [Query Segmentation - Read](query-segmentation-read.md).

## Behavior

- The saved report is a background task linked to the member who created it.
- After the task is created, the daily, weekly and monthly parts are calculated in the background and can be read through the [Tasks](../core/tasks/index.md) endpoints.

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Tasks - Check Task Status](../core/tasks/o-tasks-check.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.long_tasks` | Task metadata storage | Stores the saved report and its daily, weekly and monthly parts. |
| `countly_drill.drill_events` | Drill event data | Source of the report data. |

</details>
