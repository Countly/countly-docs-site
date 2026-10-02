---
sidebar_label: "Event Segments Read"
keywords:
  - "/o/data-manager/event-segment"
  - "event-segment"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Read event segment metadata

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/event-segment
```

## Overview

Returns segment metadata per event, including status/required/description and latest audit info.

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
/o/data-manager/event-segment?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
[
  {
    "_id": "purchase",
    "sg": [
      {
        "name": "country",
        "type": "s",
        "status": "approved",
        "required": false,
        "description": "Country code"
      }
    ]
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Array of events with grouped segment metadata (`sg`). |
| `[].sg[].name` | String | Segment key. |
| `[].sg[].type` | String | Segment type. |
| `[].sg[].status` | String | Segment status when present. |
| `[].sg[].required` | Boolean | Segment required flag when present. |
| `[].sg[].description` | String | Segment description when present. |
| `[].sg[].audit` | Object | Latest audit info (if found). |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Aggregates event segment metadata from `countly_drill.drill_meta`.
- Enriches segments with audit info from `countly.systemlogs` and `countly.members`.
- Adds masking metadata from app masking config when present.

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Segment Properties - Update](segment-properties-update.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Primary source for event segment metadata | Reads event and segment definitions, including status/type/required fields. |
| `countly.systemlogs` | Audit enrichment source | Reads latest segment/event-related system log entries to attach audit metadata. |
| `countly.members` | User-name enrichment source | Reads member names for `user_id` values found in audit logs. |
| `countly.apps` | Masking enrichment source | Reads app masking configuration to annotate masked segments in the response. |

</details>
