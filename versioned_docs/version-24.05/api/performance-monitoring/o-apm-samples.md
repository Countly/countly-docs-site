---
sidebar_label: "Samples"
keywords:
  - "/o/apm/samples"
  - "samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-17"
---

# Performance Monitoring - Samples

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/samples
```

## Overview

Returns a page of the individual samples of one metric of a network or device trace, newest first.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Performance Monitoring feature (`performance_monitoring`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app the trace belongs to. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of the traces listed by the Performance Monitoring read endpoints. |
| `type` | String | Yes | Trace type, `network` or `device`. |
| `metric` | String | Yes | Name of the metric, for example `response_time` or `duration`. |
| `period` | String | Yes | Period of the data: `month`, `day`, `yesterday`, `hour`, `NUMBERdays` (for example `30days`) or a custom range as a JSON array. |
| `query` | String (JSON) | No | Filter on the samples, as a JSON user query. |
| `iDisplayStart` | Number | No | Number of samples to skip. Defaults to `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Defaults to `10`. |
| `sEcho` | String | No | Value echoed back in the response, for DataTables paging. |

## Examples

### Example: Read the first ten samples

```bash
curl "https://your-server.com/o/apm/samples?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&id=TRACE_ID&type=network&metric=response_time&period=30days"
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 16,
  "iTotalDisplayRecords": 16,
  "aaData": [
    {
      "_id": "SAMPLE_ID",
      "uid": "USER_ID",
      "did": "DEVICE_ID",
      "ts": 1649323200000,
      "sg": {
        "name": "example.com/demo/",
        "apm_metrics": {
          "response_time": 106
        },
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
| `iTotalRecords` | Number | Total number of samples that match. |
| `iTotalDisplayRecords` | Number | Same as `iTotalRecords`. |
| `aaData` | Array | The samples of the requested page. Each has the user (`uid`), device (`did`), time (`ts`) and the trace data (`sg`: `name`, `apm_metrics`, `stz`, `etz`). |

### Error Responses

- **HTTP 400** - Invalid request:
```json
{
  "result": "Unacceptable trace type."
}
```

Other messages for HTTP 400: `Trace id not provided.`, `Metric not provided.`, `Missing request parameter: period`, `Bad request parameter: period`, `Samples data could not be fetched.`. A `query` that cannot be parsed is also rejected with HTTP 400.

## Behavior

- Samples are sorted by time, newest first.
- When sample-level data is not stored for the app, the response is `{"trace": "<trace name>", "ts": 0, "samples": []}`.

## Related Endpoints

- [Performance Monitoring - Metric Data](o-apm-metric.md)
- [Performance Monitoring - User Samples](o-apm-user-samples.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Drill events collection of the trace type | Samples | Reads the samples of the trace in the period. |

</details>
