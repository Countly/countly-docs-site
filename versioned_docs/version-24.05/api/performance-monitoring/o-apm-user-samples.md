---
sidebar_label: "User Samples"
keywords:
  - "/o/apm/user-samples"
  - "user samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - User Samples

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/user-samples
```

## Overview

Returns a page of the network or device trace samples reported by one user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Performance Monitoring feature (`performance_monitoring`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app. |
| `uid` | String | Yes | ID of the app user. |
| `type` | String | Yes | Trace type, `network` or `device`. |
| `sSearch` | String | No | Only return samples whose trace name matches this text (case-insensitive). |
| `iSortCol_0` | Number | No | Column to sort by: `1` trace name, `2` start time (default), `3` end time. |
| `sSortDir_0` | String | No | `asc` for ascending; any other value or none sorts descending. |
| `iDisplayStart` | Number | No | Number of samples to skip. Defaults to `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Defaults to `5`. |
| `sEcho` | String | No | Value echoed back in the response, for DataTables paging. |

## Examples

### Example: Read the network samples of a user

```bash
curl "https://your-server.com/o/apm/user-samples?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&uid=USER_ID&type=network"
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
      "uid": "USER_ID",
      "did": "DEVICE_ID",
      "ts": 1649323200000,
      "sg": {
        "name": "example.com/demo/",
        "apm_metrics": "{\"response_time\":106}",
        "stz": 1649323200000,
        "etz": 1649323200106
      }
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value of the request. |
| `iTotalRecords` | Number | Total number of samples of the user. |
| `iTotalDisplayRecords` | Number | Same as `iTotalRecords`. |
| `aaData` | Array | The samples of the requested page. Each has the user (`uid`), device (`did`), time (`ts`) and the trace data (`sg`: `name`, `apm_metrics`, `stz`, `etz`). |

### Error Responses

- **HTTP 400** - Invalid request:
```json
{
  "result": "Please provide user uid."
}
```

Other messages for HTTP 400: `Please provide APM type.` and `Something went wrong.`.

## Related Endpoints

- [Performance Monitoring - Samples](o-apm-samples.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Drill events collection of the trace type | Samples | Reads the samples of the user. |

</details>
