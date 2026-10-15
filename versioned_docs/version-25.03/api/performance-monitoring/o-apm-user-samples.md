---
sidebar_label: "User Samples Read"
keywords:
  - "/o/apm/user-samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - User Samples Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/user-samples
```

## Overview

Returns a page of the performance monitoring samples recorded for one user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `uid` | String | Yes | User ID (`uid`) of the app user. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `sSearch` | String | No | Only samples whose trace name matches this text (case-insensitive) are returned. |
| `iDisplayStart` | Number | No | Number of samples to skip. Default is `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Default is `5`. |
| `iSortCol_0` | Number | No | Index of the column to sort by: `1` trace name, `2` start time, `3` end time. Default is `2`. |
| `sSortDir_0` | String | No | `asc` for ascending order; any other value sorts in descending order. |
| `sEcho` | String | No | Counter that is returned unchanged in the response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read samples of a user

```text
/o/apm/user-samples?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  uid=a1b2c3d4&
  type=network
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 12,
  "iTotalDisplayRecords": 12,
  "aaData": []
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value of the request. |
| `iTotalRecords` | Number | Total number of samples of the user. |
| `iTotalDisplayRecords` | Number | Same value as `iTotalRecords`. |
| `aaData` | Array | The samples of the requested page. Each sample has the sample `_id`, `did`, `uid`, `ts` and `sg` with the trace `name`, `apm_metrics`, `stz` and `etz`. |

### Error Responses

- `400`

```json
{
  "result": "Please provide user uid."
}
```

- `400`

```json
{
  "result": "Please provide APM type."
}
```

- `400`

```json
{
  "result": "Something went wrong."
}
```

## Related Endpoints

- [Performance Monitoring - Samples Read](o-apm-samples.md)
