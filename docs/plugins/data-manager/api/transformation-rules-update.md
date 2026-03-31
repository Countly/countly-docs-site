---
sidebar_label: "Transformation Update"
---
# Data Transformations - Update Rule

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/data-manager/transformation/edit
```

## Overview

Updates an existing transformation rule by ID.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_transformations` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `id` | String | Yes | Transformation document ID. |
| `transformation` | JSON String (Object) | Yes | Updated transformation payload. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `transformation` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `actionType` | String | Yes | Operation type: `rename`, `merge`, `change-value`, `copy-to-user-custom`. |
| `transformTarget` | Array | Yes | Source key(s) or event(s) to transform. |
| `transformResult` | String | Yes | Target key/name/value produced by transformation. |
| `transformationProcessTarget` | String | No | Processing scope metadata: `incoming`, `existing`, `both`. |
| `parentEvent` | String | No | Event context or `CUSTOM_PROPERTY`. |
| `targetRegex` | String | No | Regex pattern used by value-change and regex flows. |
| `isRegex` | Boolean/String | No | Regex mode flag. |
| `isRegexMerge` | Boolean/String | No | Regex merge mode flag. |
| `sourceEventDelete` | Boolean/String | No | Source cleanup flag for merge workflows. |
| `isExistingEvent` | Boolean/String | No | Existing-event handling flag. |
| `status` | String | No | Rule status value. |

Decoded example:

```json
{
  "actionType": "rename",
  "parentEvent": "purchase",
  "transformTarget": ["region_code"],
  "transformResult": "region",
  "transformationProcessTarget": "incoming"
}
```

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `transformation.actionType` | `rename`, `merge`, `change-value`, `copy-to-user-custom` | Controls how the rule updates names, merges values, rewrites values, or copies segment values. Invalid combinations return generic `500 Error`. |
| `transformation.transformationProcessTarget` | `incoming`, `existing`, `both` | Stored in rule metadata; this endpoint does not run historical reprocessing. |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | `Success` when update completes. |

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
| Update rule | Always | Parses transformation payload and updates the matching rule by `_id` + `app`, including cleanup of removed optional fields. | Raw root string: `"Success"` |

### Impact on Other Data

- Updates transformation document in `countly.datamanager_transforms`.
- Invalidates transformation cache for the app.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-transformation-edit` | After successful update | `{ transform: JSON.stringify(transform), id: id }` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Transformation rule storage | Updates existing rule document by `_id` + `app`, including `$set` and `$unset` of optional fields. |
| `countly.systemlogs` | Audit trail | Writes `dm-transformation-edit` with updated payload and rule ID. |

---

## Examples

```text
/i/data-manager/transformation/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  id=67b860e39f2d3e0012ab9c44&
  transformation={
    "parentEvent":"purchase",
    "transformTarget":["region_code"],
    "transformResult":"region",
    "actionType":"rename",
    "transformationProcessTarget":"incoming"
  }
```

## Operational Considerations

- No long-task branch is executed for update in the current endpoint behavior.

## Limitations

- Malformed JSON in `transformation` or invalid transform mapping returns generic `500 Error`.

---

## Related Endpoints

- [Data Transformations - Read Rules](transformations-read.md)
- [Data Transformations - Create Rule](transformations-create.md)
- [Data Transformations - Toggle Status](transformation-status-update.md)

---

## Last Updated

2026-02-16
