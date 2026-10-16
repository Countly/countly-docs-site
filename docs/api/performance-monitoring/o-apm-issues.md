---
sidebar_label: "Read Issues"
keywords:
  - "/o/apm/issues"
  - "issues"
  - "apm"
  - "performance monitoring"
last_update:
  date: "2026-10-16"
---

# Performance Monitoring - Read Issues

## Endpoint

```text
/o/apm/issues
```

## Overview

Returns the network and device traces that have a threshold and are slower than it.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `performance_monitoring` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read issues

```text
/o/apm/issues?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  {
    "name": "example.com/demo/",
    "id": "TRACE_ID",
    "type": "network",
    "c": 1,
    "th": 2,
    "t": 16,
    "status": "open"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | One entry per issue. |
| `name` | String | Trace name. |
| `id` | String | Trace ID. Use it with [Performance Monitoring - Edit Trace Threshold](i-apm-edit.md) and [Performance Monitoring - Change Trace Status](i-apm-change-status.md). |
| `type` | String | `network` or `device`. |
| `c` | Number | Samples above the threshold. |
| `th` | Number | Threshold set for the trace. |
| `t` | Number | Total samples. |
| `status` | String | `open` or `mute`. |

## Behavior

- The device traces `app_in_background` and `app_in_foreground` are not reported as issues.

## Related Endpoints

- [Performance Monitoring - Edit Trace Threshold](i-apm-edit.md)
- [Performance Monitoring - Change Trace Status](i-apm-change-status.md)
