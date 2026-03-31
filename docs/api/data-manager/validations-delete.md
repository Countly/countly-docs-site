---
sidebar_label: "Validation Delete"
---
# Data Manager Validations - Resolve by Deletion

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/validations/delete
```

## Overview

Applies deletion/cleanup behavior for selected validation records and marks them resolved.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Read` permission for this endpoint.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `validationIds` | JSON String (Array) | Yes | Array of validation document IDs to process. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `validationIds` Array Structure

`validationIds` is a JSON-stringified array of validation record IDs.

Decoded example:

```json
["67b85e7a9f2d3e0012ab9c10", "67b85e7a9f2d3e0012ab9c11"]
```

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `validationIds` | JSON array of document IDs | Must be a JSON-stringified array of validation record IDs. |
| Validation `type` | `GLOBAL_REGEX`, `unexpected`, `unplanned`, `missing_segmentation`, `data_type_mismatch` | Each type triggers different cleanup logic in drill collections / events hooks. |
| Validation `target` | `event` / `segment` | Affects selected systemlog action and cleanup strategy. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when selected validations are processed. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Delete/resolve validations | Always | Runs cleanup branch per validation type, marks validation deleted/resolved, logs operation. | Raw root string: `"Success"` |

### Impact on Other Data

- Marks validation records as `resolved=true`, `deleted=true`, `lastDeletedAt={ts}`.
- Depending on type, removes segment/event data in `drill_events` and event-specific drill collections.
- For `unexpected/unplanned` event target, dispatches `/i/events/delete_events` hook.
- Invalidates Data Manager cache for app.

## Audit & System Logs

Emits one systemlog record per processed validation using action chosen by branch:

- default branch starts with `dm-event-approve`
- segment cleanup branches use `dm-segment-delete`

Payload includes:

- `ev` (event key)
- optional `segment` for segment-target branches

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.validation_errors{appId}` | Validation workflow state | Marks selected validations as `resolved=true`, `deleted=true`, and sets `lastDeletedAt`. |
| `countly_drill.drill_events` | Drill event cleanup | Deletes/unsets invalid segment/event values for relevant validation types. |
| `countly_drill.{eventCollection}` | Event-specific drill collections cleanup | Deletes invalid rows in event-specific drill collections resolved by `drillCommon.getCollectionName(...)`. |
| `countly.events_data` | Aggregated data cleanup (indirect branch) | Can be updated/deleted through delegated segment cleanup flows for selected validation types. |
| `countly.systemlogs` | Audit trail | Writes one cleanup action per processed validation (`dm-event-approve`/`dm-segment-delete` branch-dependent). |

---

## Examples

### Resolve one validation by deletion

```text
/o/data-manager/validations/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  validationIds=["67b85e7a9f2d3e0012ab9c10"]
```

### Resolve multiple validations by deletion

```text
/o/data-manager/validations/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  validationIds=["67b85e7a9f2d3e0012ab9c10","67b85e7a9f2d3e0012ab9c11"]
```

## Operational Considerations

- Processing is sequential and can be expensive for large validation batches, especially when cleanup touches drill-level data.

## Limitations

- Malformed `validationIds` JSON returns generic `500 Error`.
- This endpoint currently requires `Read` permission even though it mutates data.

---

## Related Endpoints

- [Data Manager Validations - Read Unresolved](validations-read.md)
- [Data Manager Validations - Approve](validation-approvals-update.md)

---

## Last Updated

2026-02-16
