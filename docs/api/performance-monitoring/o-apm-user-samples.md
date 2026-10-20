---
sidebar_label: "Read User Samples"
keywords:
  - "/o/apm/user-samples"
  - "user-samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read User Samples

## Endpoint

```text
/o/apm/user-samples
```

## Overview

Returns a page of the network or device trace samples recorded for one app user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `uid` | String | Yes | Countly internal user ID. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `sSearch` | String | No | Only samples whose trace name matches this text (case-insensitive) are returned. |
| `iSortCol_0` | Number | No | Column to sort by: `1` trace name, `2` start time, `3` end time. Defaults to `2`. |
| `sSortDir_0` | String | No | `asc` for ascending order; any other value sorts descending. |
| `iDisplayStart` | Number | No | Number of samples to skip. Defaults to `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Defaults to `5`. |
| `sEcho` | String | No | Value returned unchanged in the response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the latest network samples of a user

```text
/o/apm/user-samples?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  uid=1&
  type=network
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 1,
  "iTotalDisplayRecords": 1,
  "aaData": [
    {
      "_id": "SAMPLE_ID",
      "uid": "1",
      "did": "device_123",
      "ts": 1682328445330,
      "sg": {
        "name": "example.com/demo/",
        "apm_metrics": "{}",
        "stz": 1682328445000,
        "etz": 1682328446000
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | Value of the `sEcho` request parameter. |
| `iTotalRecords` | Number | Total number of samples of the user. |
| `iTotalDisplayRecords` | Number | Total number of samples of the user. |
| `aaData` | Array | Samples of the requested page, with `_id`, `did`, `uid`, `ts`, and the segments `name`, `apm_metrics`, `stz` and `etz`. |

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

- [Performance Monitoring - Read Samples](o-apm-samples.md)
