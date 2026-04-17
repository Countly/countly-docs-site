---
sidebar_label: "Metadata Regeneration"
keywords:
  - "/i/drill/regenerate_meta"
  - "regenerate_meta"
  - "drill"
---
# Regenerate metadata

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/regenerate_meta
```

## Overview

Regenerates Drill event and user-property metadata for one app.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`

## Permissions

Requires `drill` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `period` | String or JSON | No | Period used to limit source data. Defaults to `30days`. Accepted keyword values are `month`, `day`, `yesterday`, `hour`, and `prevMonth`; relative values like `7days` are also accepted. A JSON object with `since` is converted to `[since, Date.now()]`. |
| `wait_to_finish` | Boolean String | No | If set, waits for regeneration to finish and returns `Meta regeneration done`. Otherwise returns immediately. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Async Success Response

```json
{
  "result": "Meta regeneration started"
}
```

### Wait Response

```json
{
  "result": "Meta regeneration done"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Regeneration status message. |

### Error Responses

- `404`

```json
{
  "result": "Missing parameter app_id"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

## Behavior/Processing

- Parses `period`; invalid non-keyword periods return `Bad request parameter: period`.
- Converts `period.since` objects to a timestamp range ending at request time.
- Rebuilds the event list, then fixes Drill metadata for the app and selected period range.
- Writes completion status to system logs with action `meta_regeneration_finished`.
- Returns immediately unless `wait_to_finish` is provided.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App lookup | Reads target app metadata. |
| `countly_drill.drill_meta` | Drill metadata model | Rebuilds and fixes metadata documents. |
| `countly_drill.drill_events{appId/hash}` | Source event data | Reads Drill event data for metadata regeneration. |
| `countly.systemlogs` | Audit trail | Stores `meta_regeneration_finished` completion status. |

---

## Examples

### Start async regeneration

```text
/i/drill/regenerate_meta?
  app_id=64f5c0d8f4f7ac0012ab3456&
  period=30days
```

### Wait for regeneration

```text
/i/drill/regenerate_meta?
  app_id=64f5c0d8f4f7ac0012ab3456&
  period={"since":1735689600000}&
  wait_to_finish=true
```

---

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Metadata Cleanup - Update](metadata-cleanup-update.md)
- [Metadata Lists - Recheck](metadata-list-recheck-update.md)

---

## Last Updated

2026-04-17
