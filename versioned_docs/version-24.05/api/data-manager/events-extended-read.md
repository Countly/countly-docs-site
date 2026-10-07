---
sidebar_label: "Events Extended Read"
keywords:
  - "/o/data-manager/events-extended"
  - "events-extended"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Read extended event metadata

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/events-extended
```

## Overview

Returns merged event metadata from event map and drill metadata, including latest audit information.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o/data-manager/events-extended?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
[
  {
    "key": "purchase",
    "name": "Purchase",
    "description": "Purchase event",
    "status": "live",
    "is_visible": true,
    "segments": ["country", "price"],
    "audit": {
      "userName": "Jane Doe",
      "ts": 1739599800
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | List of merged event metadata objects. |
| `[].audit` | Object | Latest matching audit object (if available). |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Reads event list/map from `countly.events`.
- Reads event metadata from `countly_drill.drill_meta` (excluding internal/cohort/biglist).
- Reads latest relevant event logs from `countly.systemlogs` and member names from `countly.members`.
- Merges data by event key and returns combined array.

## Related Endpoints

- [Events - Create](events-create.md)
- [Event Status - Update](event-status-update.md)
- [Events Visibility - Update](events-visibility-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Base event catalog | Reads event `list`, `map`, and `segments` metadata. |
| `countly_drill.drill_meta` | Drill-level event metadata | Reads event status and segment model metadata for merge with base event catalog. |
| `countly.systemlogs` | Audit enrichment source | Reads latest event-related system log entries for each returned event. |
| `countly.members` | User-name enrichment source | Resolves `user_id` from system logs to member full names (`audit.userName`). |

</details>
