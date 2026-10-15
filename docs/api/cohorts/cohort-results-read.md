---
sidebar_label: "Cohort Results Read"
keywords:
  - "/o?method=cohort"
  - "cohort"
  - "cohorts"
last_update:
  date: "2026-10-09"
---

# Cohorts - Read Cohort Results

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=cohort
```

## Overview

Returns the calculated results of a cohort. Depending on the cohort type and the `generate` parameter, results are read from the stored cache or calculated in a background task.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `cohorts` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `cohort`. |
| `app_id` | String | Yes | Application ID. |
| `cohort` | String | Yes | Cohort ID. |
| `manual` | Boolean/String | No | When set, the application ID is appended to `cohort` to build the cohort ID. |
| `generate` | Boolean/String | No | When set for a non-manual cohort, the results are calculated instead of read from the cache. Ignored when real-time cohorts are enabled. |
| `save_report` | Boolean/String | No | With `generate`, keeps the calculation as a saved report. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read cached results of a cohort

```text
/o?method=cohort&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  cohort=65f0cbf8bca6b8e8fbf7f901
```

### Calculate the results

```text
/o?method=cohort&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  cohort=65f0cbf8bca6b8e8fbf7f901&
  generate=true
```

## Response

### Success Response

The cohort's stored results are returned as the response body. When the results are being calculated in a background task, a task reference is returned instead:

```json
{
  "task_id": "65f1f7b2ad5b9b001f12ab34"
}
```

An empty array (`[]`) is returned if the server has no Drill database connection.

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: cohort"
}
```

- `400`

```json
{
  "result": "Requested cohort does not exist"
}
```

- `406`

```json
{
  "result": "Cannot get cohort results"
}
```

## Behavior

### Behavior Modes

| Mode | Condition | Result |
|---|---|---|
| Cached read | Real-time cohorts are enabled, `generate` is not set, or the cohort is manual | Returns the stored results of the cohort. |
| Calculation | `generate` is set, real-time cohorts are disabled, and the cohort is not manual | Calculates the results in a background task. Returns the `task_id` of a task that is already running for the same request. |

## Related Endpoints

- [Cohorts - Read Cohort State](cohort-state-read.md)
- [Cohorts - Read Cohort Data](cohort-data-read.md)
- [Cohorts - Read Cohort](cohort-single-read.md)
