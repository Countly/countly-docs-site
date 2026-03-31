---
sidebar_label: "Validation Approve"
---
# Data Manager Validations - Approve

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/validations/approve
```

## Overview

Approves selected validation records and marks them resolved.

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
| `validationIds` | JSON String (Array) | Yes | Array of validation document IDs to approve. |
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
| Validation `target` | `event` / `segment` | Drives whether event status or segment status is updated in `drill_meta`. |
| Validation `type` | `unexpected`, `unplanned`, `GLOBAL_REGEX`, `SEGMENT_REGEX`, `data_type_mismatch`, `missing_segmentation` | Only `unexpected`/`unplanned` trigger approval meta updates; others are effectively no-op for approval path. |

## Response

### Success Response

Full success:

```json
"Success"
```

Partial failures:

```json
{
  "67b85e7a9f2d3e0012ab9c10": "failed"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `"Success"` on full success. |
| `validationId` | String | Present in partial-failure map output, value `"failed"`. |

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
| Full success | All selected items processed | Updates drill meta/status where applicable, marks validations resolved, logs approvals. | `"Success"` |
| Partial failure | Some validation items cannot be approved (for example missing parent event for segment target) | Skips failed item(s), tracks failure map, continues other items. | Object keyed by validation ID with `"failed"` |

### Impact on Other Data

- Updates `countly_drill.drill_meta` for approved event/segment statuses.
- Updates `countly.validation_errors{appId}` to set `resolved=true` and `lastresolvedAt`.
- Invalidates Data Manager cache for app.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-event-approve` | Approved event-level validation | `{ event: JSON.stringify(eventMeta), ev: validation.event }` |
| `dm-segment-approve` | Approved segment-level validation | `{ event: JSON.stringify(eventMeta), ev: validation.event, segment: validation.segment }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.validation_errors{appId}` | Validation workflow state | Marks selected validations as resolved and updates resolution timestamps. |
| `countly_drill.drill_meta` | Event/segment approval state | Updates event or segment status metadata for approve-eligible validation types. |
| `countly.systemlogs` | Audit trail | Writes `dm-event-approve` / `dm-segment-approve` for processed approvals. |

---

## Examples

### Approve multiple validation records

```text
/o/data-manager/validations/approve?
  app_id=64f5c0d8f4f7ac0012ab3456&
  validationIds=["67b85e7a9f2d3e0012ab9c10","67b85e7a9f2d3e0012ab9c11"]
```

### Approve a single segment validation

```text
/o/data-manager/validations/approve?
  app_id=64f5c0d8f4f7ac0012ab3456&
  validationIds=["67b85e7a9f2d3e0012ab9c10"]
```

## Operational Considerations

- Handler processes validations sequentially to preserve parent-event/segment dependency behavior.

## Limitations

- Malformed `validationIds` JSON returns generic `500 Error`.
- This endpoint currently requires `Read` permission even though it mutates data.

---

## Related Endpoints

- [Data Manager Validations - Read Unresolved](validations-read.md)
- [Data Manager Validations - Delete](validations-delete.md)

---

## Last Updated

2026-02-16
