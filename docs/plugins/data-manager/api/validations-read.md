---
sidebar_label: "Validation Read"
---
# Data Manager Validations - Read Unresolved

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/validations
```

## Overview

Returns unresolved validation records for an app.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `app_id` | Valid app ID | Resolves app-scoped validation collection and returns unresolved records for that app only. |

## Response

### Success Response

```json
[
  {
    "_id": "67b85e7a9f2d3e0012ab9c10",
    "event": "purchase",
    "target": "segment",
    "type": "unexpected",
    "segment": "country",
    "resolved": false
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Unresolved validation records from `validation_errors_{app_id}`. |
| `[] ._id` | String | Validation record ID. |
| `[] .event` | String | Event key tied to validation. |
| `[] .target` | String | Validation target (`event` or `segment`). |
| `[] .type` | String | Validation type (for example `unexpected`, `unplanned`, `GLOBAL_REGEX`). |
| `[] .segment` | String | Segment key when target is `segment`. |
| `[] .resolved` | Boolean | Resolution state (always not `true` in this endpoint output). |

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
| Read unresolved | Always | Reads `validation_errors_{appId}` with filter `{ resolved: { $ne: true } }`. | Array of validation records |

### Impact on Other Data

- Read-only endpoint; no write/update side effects.

## Audit & System Logs

- This endpoint does not emit `/systemlogs` actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.validation_errors{appId}` | Unresolved validation source | Reads unresolved validation records (`resolved != true`) for the target app. |

---

## Examples

```text
/o/data-manager/validations?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Operational Considerations

- Collection name is app-scoped (`validation_errors_{app_id}`), so large validation backlogs can increase response size.

## Limitations

- No pagination in this endpoint; all unresolved records are returned.

---

## Related Endpoints

- [Data Manager Validations - Approve](validation-approvals-update.md)
- [Data Manager Validations - Delete](validations-delete.md)

---

## Last Updated

2026-02-16
