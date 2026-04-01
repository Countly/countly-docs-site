---
sidebar_label: "Event Segments Read"
keywords:
  - "/o/data-manager/event-segment"
  - "event-segment"
  - "data-manager"
---
# Read event segment metadata

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/data-manager/event-segment
```

## Overview

Returns segment metadata per event, including status/required/description and latest audit info.

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

## Behavior/Processing

- Aggregates event segment metadata from `countly_drill.drill_meta`.
- Enriches segments with audit info from `countly.systemlogs` and `countly.members`.
- Adds masking metadata from app masking config when present.

## Audit & System Logs

- This endpoint does not emit `/systemlogs` actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Primary source for event segment metadata | Reads event and segment definitions, including status/type/required fields. |
| `countly.systemlogs` | Audit enrichment source | Reads latest segment/event-related system log entries to attach audit metadata. |
| `countly.members` | User-name enrichment source | Reads member names for `user_id` values found in audit logs. |
| `countly.apps` | Masking enrichment source | Reads app masking configuration to annotate masked segments in the response. |

---

## Examples

```text
/o/data-manager/event-segment?
  app_id=64f5c0d8f4f7ac0012ab3456
```

---

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Segment Properties - Update](segment-properties-update.md)

---

## Last Updated

2026-02-16
