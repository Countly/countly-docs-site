---
sidebar_label: "Query Metadata - Read"
---
# Read segmentation metadata

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=segmentation_meta
```

## Overview

Returns metadata for event segmentation fields and user properties.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`

Validation methods:
- 
-  for `event=[CLY]_crash`

## Permissions

Requires read permission according to validation path above.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation_meta`. |
| `app_id` | String | Yes | Target app ID. |
| `event` | String | Yes | Event key to inspect. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

```json
{
  "e": "[CLY]_session",
  "up": {
    "p": {"type": "l"}
  },
  "sg": {
    "cc": {"type": "s", "values": ["US", "DE"]}
  },
  "chr": {
    "type": "l",
    "values": ["67ad1e..."]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Merged metadata object for user properties and event segments. |
| `up` | Object | User-property metadata map. |
| `sg` | Object | Segment metadata map for selected event. |

### Error Responses

- `500`

```json
{
  "result": "Internal error"
}
```

## Behavior/Processing

- Merges app-level meta (`_meta_up`) and event-level meta (`_meta_<hash>`).
- Enriches output with cohorts and optional plugin maps (journeys/content/feedback/geos).
- Returns preset field types when `record_meta` is disabled.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Drill metadata model | Stores event/segment/property metadata dictionaries used by this endpoint. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.content_blocks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o?method=segmentation_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session
```

---

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)

---

## Last Updated

2026-02-16
