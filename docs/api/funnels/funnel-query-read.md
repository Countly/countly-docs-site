---
sidebar_label: "Analyze"
keywords:
  - "/o"
  - "o"
---

# Analyze funnel

## Endpoint

```text
/o?method=funnel
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Calculates funnel progression data for a funnel definition and selected period/filter.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `funnel`. |
| `app_id` | String | Yes | Target app ID. |
| `funnel` | String | Yes | Funnel ID. |
| `period` | String or JSON String (Array/Object) | No | Period input for calculation. |
| `filter` | JSON String (Object) | No | Query filter object. |
| `filter_id` | String | No | Drill bookmark ID used when `filter` is not provided. |
| `task_id` | String | No | Existing task ID to fetch async task result. |
| `end_step` | Number | No | Step index used for user-list extraction mode. |
| `users_for_step` | Number | No | Legacy alias for `end_step`; returns user IDs for that step. |
| `users_between_steps` | String | No | Legacy format `from|to`; returns user IDs between steps. |
| `no_cache` | Boolean/String | No | Skips cache lookup for this request. |
| `save_report` | Boolean/String | No | Runs through long-task/report flow. |
| `echo` | String | No | Echo value returned in response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `funnels.funnel_caching` | `true` | Cache read/write behavior for funnel results. | Repeated requests can return cached results faster (until cache expires/invalidates). |

## Response

### Success Response (Calculated Funnel)

```json
{
  "total_users": 1000,
  "users_in_first_step": 820,
  "success_users": 290,
  "success_rate": 29,
  "steps": [
    {
      "step": "Product View",
      "query": {},
      "users": 820,
      "times": 950,
      "percent": 82,
      "percentLeft": 18,
      "percentUserEntered": 100,
      "percentLeftUserEntered": 0,
      "averageTimeSpend": 0
    },
    {
      "step": "Add to Cart",
      "query": {},
      "users": 510,
      "times": 580,
      "percent": 51,
      "percentLeft": 31,
      "percentUserEntered": 62.2,
      "percentLeftUserEntered": 37.8,
      "averageTimeSpend": 91
    }
  ],
  "echo": "widget-1"
}
```

### Success Response (Async Task Started/Running)

```json
{
  "task_id": "67f2d1f37f7d9f0012ab7890"
}
```

### Success Response (User IDs Mode)

```json
["uid1", "uid2", "uid3"]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `total_users` | Number | Total users in analyzed period/user set. |
| `users_in_first_step` | Number | Users who matched step 1. |
| `success_users` | Number | Users who reached final step. |
| `success_rate` | Number | Final-step conversion percentage. |
| `steps` | Array | Step-by-step funnel metrics. |
| `steps[].step` | String or Array | Step event or grouped step events. |
| `steps[].users` | Number | Users reaching step. |
| `steps[].times` | Number | Event count on step. |
| `steps[].percent` | Number | Percentage relative to full funnel population. |
| `steps[].averageTimeSpend` | Number | Average transition time to next step. |
| `task_id` | String | Async task ID when long-task processing is used. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: funnel"
}
```

- `400`

```json
{
  "result": "Requested funnel does not exist"
}
```

- `500`

```json
{
  "result": "There was a problem calculating funnel"
}
```

## Behavior/Processing

- If `task_id` is provided, endpoint returns parsed stored task output.
- For active drill-enabled deployments, processing uses task manager and may return `task_id`.
- If `users_for_step` or `users_between_steps` is requested, response returns user ID list.
- In normal mode, per-user raw `step.data` objects are removed before response.
- If drill storage is unavailable, returns zeroed step structure based on funnel definition.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.long_tasks` | Background task tracking | Stores long-task lifecycle records for asynchronous endpoint processing. |
| `countly_drill.drill_events` | Drill event records | Stores granular event rows queried or updated by this endpoint. |
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly_fs.funnels_cache` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o?
  method=funnel&
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel=67f1c22912df5acb8f8d5caaf0f89a31&
  period=30days
```

```text
/o?
  method=funnel&
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel=67f1c22912df5acb8f8d5caaf0f89a31&
  period=30days&
  filter={"cc":"US","d.ios":true}
```

```text
/o?
  method=funnel&
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel=67f1c22912df5acb8f8d5caaf0f89a31&
  users_between_steps=0|1
```

---

## Related Endpoints

- [Funnels - Read](funnel-single-read.md)
- [Funnels - Read Data](funnel-data-read.md)
- [Funnels - Read User](user-funnels-read.md)
- [Funnels - List](read.md)

---

## Last Updated

2026-02-16
