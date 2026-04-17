---
sidebar_label: "Data Regeneration"
keywords:
  - "/i/drill/regeneration"
  - "regeneration"
  - "drill"
---
# Regenerate Drill data

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/regeneration
```

## Overview

Starts Drill data regeneration for sessions, custom/system events, or views.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`

## Permissions

Requires `drill` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `method` | String | Yes | Regeneration target. Must be `sessions`, `events`, or `views`. |
| `period` | String or JSON | No | Period used to limit source data. Defaults to `30days`. Accepted keyword values are `month`, `day`, `yesterday`, `hour`, and `prevMonth`; relative values like `7days` are also accepted. A JSON object with `since` is converted to `[since, Date.now()]`. |
| `event` | String | Conditional | Event key to regenerate. Required when `method=events`. |
| `view_id` | String or JSON String (Array) | No | View ID or view ID array used when `method=views`. If omitted, all views are regenerated. |
| `wait_to_finish` | Boolean String | No | If set, runs with `force=false`; otherwise regeneration is forced through the long-task path. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

The response payload depends on the selected `method` and long-task execution path. Successful view regeneration returns a structured status object.

```json
{
  "result": {
    "app_id": "64f5c0d8f4f7ac0012ab3456",
    "view_id": "home",
    "period": "30days",
    "result": "Success"
  }
}
```

Event and session regeneration can return the result produced by the relevant regeneration worker.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object or String | Regeneration worker output or error/status string. |
| `result.app_id` | String | Target app ID for view regeneration responses. |
| `result.view_id` | String or Array | Regenerated view id or ids, when `method=views`. |
| `result.period` | String or Array | Period used for regeneration. |
| `result.result` | String | `Success` or `Error` for view regeneration responses. |
| `result.error_msg` | String | Error message when view regeneration fails. |

### Error Responses

- `404`

```json
{
  "result": "Missing parameter app_id"
}
```

- `404`

```json
{
  "result": "Missing parameter event"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

- `200`

```json
{
  "result": "Missing parameter method. Must be one of: sessions, events, views"
}
```

## Behavior/Processing

- Parses `period`; invalid non-keyword periods return `Bad request parameter: period`.
- Converts `period.since` objects to a timestamp range ending at request time.
- Creates a long task with type `regeneration`.
- `method=events` requires `event` and calls event regeneration.
- `method=sessions` regenerates session Drill data.
- `method=views` regenerates one, multiple, or all views and writes a `view_recalculation_finished` system log entry.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App lookup | Reads target app metadata. |
| `countly.long_tasks` | Long-task execution | Tracks regeneration work. |
| `countly_drill.drill_events{appId/hash}` | Drill data | Rebuilds Drill event/session/view data. |
| `countly.systemlogs` | Audit trail | Stores view recalculation completion status. |

---

## Examples

### Regenerate sessions

```text
/i/drill/regeneration?
  app_id=64f5c0d8f4f7ac0012ab3456&
  method=sessions&
  period=30days
```

### Regenerate one event

```text
/i/drill/regeneration?
  app_id=64f5c0d8f4f7ac0012ab3456&
  method=events&
  event=Purchase&
  period=7days
```

### Regenerate selected views

```text
/i/drill/regeneration?
  app_id=64f5c0d8f4f7ac0012ab3456&
  method=views&
  view_id=["home","checkout"]&
  period=30days
```

---

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Metadata Regeneration - Update](metadata-regeneration-update.md)

---

## Last Updated

2026-04-17
