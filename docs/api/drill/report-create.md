---
sidebar_label: "Report - Create"
keywords:
  - "/o?method=createReport"
  - "createReport"
  - "drill"
  - "report"
last_update:
  date: "2026-10-09"
---

# Drill - Create Report

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=createReport
```

## Overview

Runs a Drill segmentation query as a report. With `autoRefresh=true` and no `projectionKey`, a report task is created that is calculated for daily, weekly and monthly buckets over 732 days. Otherwise the request is handled like [Query Segmentation - Read](query-segmentation-read.md).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `drill` `Read` permission.

## Request Parameters

The query parameters of [Query Segmentation - Read](query-segmentation-read.md) (`event`, `queryObject`, `period`, `bucket`, `projectionKey`, and so on) are accepted. The following are specific to reports:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `createReport`. |
| `app_id` | String | Yes | Target app ID. |
| `autoRefresh` | String | No | `true` creates an auto-refreshing report. `period` and `period_desc` are then set to `732days` and `bucket` is cleared. |
| `report_name` | String | No | Name of the report. |
| `report_desc` | String | No | Description of the report. |
| `period_desc` | String | No | Period description stored with the report. |
| `global` | String | No | `true` makes the report global. |
| `manually_create` | String | No | `true` marks the report as created manually. |
| `linked_to` | String | No | ID the report is linked to. |
| `task_id` | String | No | Existing report task ID. |
| `projectionKey` | String or JSON String (Array) | No | Group-by field or fields. A one-element array is treated as a single field; an empty array is ignored. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Create an auto-refreshing report

```text
/o?method=createReport&
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY&
  event=[CLY]_session&
  queryObject={}&
  autoRefresh=true&
  report_name=Sessions
```

## Response

### Success Response

For an auto-refreshing report without `projectionKey`, the response contains the ID of the report task:

```json
{
  "task_id": "65f1f7b2ad5b9b001f12ab34"
}
```

In all other cases the response has the same shape as [Query Segmentation - Read](query-segmentation-read.md).

### Error Responses

See [Query Segmentation - Read](query-segmentation-read.md) for the validation errors of the query parameters.

## Behavior

- With `autoRefresh=true` and no `projectionKey`, the report is created as a task group with daily, weekly and monthly sub-reports, each calculated over 732 days.

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Query Metadata - Read](query-metadata-read.md)
