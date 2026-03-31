---
sidebar_label: "Transformation Read"
---
# Data Transformations - Read Rules

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/transformation
```

## Overview

Returns transformation rules for the app, enriched with latest audit information per rule ID.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_transformations` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Parameter Semantics

| Field | Expected values | Behavior |
|---|---|---|
| `app_id` | Valid app ID | Limits the response to transformation rules owned by that app. |

## Response

### Success Response

```json
[
  {
    "_id": "67b860e39f2d3e0012ab9c44",
    "app": "64f5c0d8f4f7ac0012ab3456",
    "actionType": "SEGMENT_RENAME",
    "status": "ENABLED",
    "transformResult": "country",
    "transformTarget": ["country_code"],
    "audit": {
      "_id": "67b860e39f2d3e0012ab9c44",
      "user_id": "64f5be9bf4f7ac0012ab3001",
      "ts": 1739599800,
      "userName": "Jane Doe"
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Transformation documents for the app. |
| `[] ._id` | String | Transformation ID. |
| `[] .app` | String | App ID owner. |
| `[] .actionType` | String | Internal action type constant (for example `SEGMENT_RENAME`). |
| `[] .status` | String | Rule status (`ENABLED` or `DISABLED`). |
| `[] .transformResult` | String | Target name/value of transformation. |
| `[] .transformTarget` | Array | Source fields/events affected by transformation. |
| `[] .audit` | Object | Latest matching audit info from system logs (if found). |

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
| Read transformations | Always | Loads rules from `countly.datamanager_transforms`, enriches with latest systemlog action for each rule ID, resolves member names. | Array of transformation objects |

### Impact on Other Data

- Read-only endpoint; no write/update side effects.

## Audit & System Logs

This endpoint does not write logs. It reads audit data from `countly.systemlogs` actions:

- `dm-transformation`
- `dm-transformation-edit`
- `dm-toggle-status`

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Primary rule source | Reads transformation rule documents for the target app. |
| `countly.systemlogs` | Audit enrichment source | Reads latest transformation-related actions per rule ID. |
| `countly.members` | User-name enrichment source | Resolves systemlog `user_id` values to member full names for `audit.userName`. |

---

## Examples

```text
/o/data-manager/transformation?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Operational Considerations

- Uses aggregation and join-like enrichment (rules + logs + members), so response cost grows with rule count.

## Limitations

- Returns only latest log per transformation ID among the tracked actions.
- If member records are missing for old logs, `audit.userName` can be absent.

---

## Related Endpoints

- [Data Transformations - Create Rule](transformations-create.md)
- [Data Transformations - Update Rule](transformation-rules-update.md)
- [Data Transformations - Toggle Status](transformation-status-update.md)

---

## Last Updated

2026-02-16
