---
sidebar_label: "Samples Read"
keywords:
  - "/o/apm/samples"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-15"
---

# Performance Monitoring - Samples Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/apm/samples
```

## Overview

Returns a page of the recorded samples of one metric of a trace, newest first.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `type` | String | Yes | Trace type: `network` or `device`. |
| `id` | String | Yes | Trace ID, as returned in the `id` field of traces by [Overview Read](o-apm-overview.md). |
| `metric` | String | Yes | Name of the metric, for example `response_time` or `duration`. |
| `period` | String or Array | Yes | `month`, `day`, `yesterday`, `hour`, `<number>days` (for example `30days`), or a custom range as a JSON array. |
| `query` | JSON String (Object) | No | Filter on the samples, in the same format as the Drill `queryObject`. |
| `iDisplayStart` | Number | No | Number of samples to skip. Default is `0`. |
| `iDisplayLength` | Number | No | Number of samples to return. Default is `10`. |
| `sEcho` | String | No | Counter that is returned unchanged in the response. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read the first samples of a trace

```text
/o/apm/samples?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  type=network&
  id=TRACE_ID&
  metric=response_time&
  period=30days&
  iDisplayLength=10
```

## Response

### Success Response

```json
{
  "sEcho": "1",
  "iTotalRecords": 120,
  "iTotalDisplayRecords": 120,
  "aaData": []
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `sEcho` | String | The `sEcho` value of the request. |
| `iTotalRecords` | Number | Total number of samples that match the request. |
| `iTotalDisplayRecords` | Number | Same value as `iTotalRecords`. |
| `aaData` | Array | The samples of the requested page. |

If the server has no Drill database, the response is `{"trace": "<trace name>", "ts": 0, "samples": []}`.

### Error Responses

The request is validated like [Metric Read](o-apm-metric.md); its `400` errors apply here too. A failed read returns:

```json
{
  "result": "Samples data could not be fetched."
}
```

## Related Endpoints

- [Performance Monitoring - Metric Read](o-apm-metric.md)
- [Performance Monitoring - User Samples Read](o-apm-user-samples.md)
