---
sidebar_label: "Query Metadata - Read"
keywords:
  - "/o"
  - "o"
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

The endpoint merges app-level user property metadata with event-level segmentation metadata. It can also add plugin-specific maps for cohorts, feedback widgets, journeys, content blocks, and geolocation targets when those plugins have relevant data.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires `drill` `Read` permission for most events.
- Requires `crashes` read permission when `event=[CLY]_crash`.

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
    "p": {
      "type": "l",
      "values": ["iOS", "Android"]
    },
    "cc": {
      "type": "l",
      "values": ["US", "DE"]
    },
    "av": {
      "type": "s"
    }
  },
  "sg": {
    "source": {
      "type": "s",
      "values": ["organic", "paid"]
    }
  },
  "chr": {
    "type": "l",
    "values": ["67ad1e..."]
  },
  "geo": {
    "type": "l",
    "values": [
      {
        "_id": "65f1f7b2ad5b9b001f12ab34",
        "title": "Berlin Store",
        "app": "64f5c0d8f4f7ac0012ab3456"
      }
    ]
  }
}
```

### Feedback Event Response Additions

For `[CLY]_survey`, `[CLY]_nps`, and `[CLY]_star_rating`, the response can include widget/question maps and normalized `widget_id` values.

```json
{
  "e": "[CLY]_star_rating",
  "sg": {
    "widget_id": {
      "type": "s",
      "values": ["65f1f7b2ad5b9b001f12ab34"]
    },
    "rating": {
      "type": "n",
      "values": [1, 2, 3, 4, 5]
    }
  },
  "widget_map": [
    {
      "_id": "65f1f7b2ad5b9b001f12ab34",
      "name": "App Rating"
    }
  ]
}
```

### Journey/Content Event Response Additions

For journey/content internal events, the response can include `journey_map` and `content_map`. When present, related segment values are replaced with ids from those maps.

```json
{
  "e": "[CLY]_content_shown",
  "sg": {
    "journey_definition_id": {
      "type": "s",
      "values": ["65f1f7b2ad5b9b001f12ab34"]
    },
    "content_block_id": {
      "type": "s",
      "values": ["65f1f7b2ad5b9b001f12ab35"]
    }
  },
  "journey_map": [
    {
      "_id": "65f1f7b2ad5b9b001f12ab34",
      "name": "Onboarding Journey"
    }
  ],
  "content_map": [
    {
      "_id": "65f1f7b2ad5b9b001f12ab35",
      "name": "Welcome Banner"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Merged metadata object for user properties, event segments, and optional plugin maps. |
| `e` | String | Event key represented by this metadata response. |
| `up` | Object | User-property metadata map from app-level `_meta_up`. Keys use stored user-property names such as `p`, `cc`, `av`, and custom fields. |
| `up.<field>.type` | String | Field type. Common values include `s` string, `n` number, `d` date, `l` list, and `a` array/list-like values. |
| `up.<field>.values` | Array | Known sampled values for the user property, when recorded and not masked. |
| `up.<field>.ttl` | Number | Property expiration setting, when configured. |
| `sg` | Object | Segment metadata map for the selected event. |
| `sg.<field>.type` | String | Segment field type. |
| `sg.<field>.values` | Array | Known sampled segment values. Survey answer fields with keys starting `answ-` are omitted from this metadata response. |
| `chr` | Object | Cohort selector metadata. Present when cohorts exist for the app. |
| `chr.values` | Array | Cohort ids available as Drill filters. |
| `geo` | Object | Geolocation selector metadata. Present when geolocation targets exist. |
| `geo.values[]` | Array | Geo target objects with `_id`, `title`, and `app`. |
| `widget_map` | Array | Feedback widget id/name map for feedback events. |
| `questionMap` | Array | Survey question metadata for `[CLY]_survey`, when available. |
| `journey_map` | Array | Journey id/name map for journey/content internal events. |
| `content_map` | Array | Content block id/name map for content internal events. |

### Error Responses

- `500`

```json
{
  "result": "Internal error"
}
```

## Behavior/Processing

- Merges app-level meta (`_meta_up`) and event-level meta (`_meta_<hash>`).
- Omits masked user-property values when Data Manager masking is enabled.
- Omits survey answer fields whose segment keys start with `answ-`.
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

### Read session metadata

```text
/o?method=segmentation_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session
```

### Read custom event metadata

```text
/o?method=segmentation_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase
```

### Read feedback widget metadata

```text
/o?method=segmentation_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_star_rating
```

### Read crash metadata

```text
/o?method=segmentation_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_crash
```

---

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)

---

## Last Updated

2026-04-17
