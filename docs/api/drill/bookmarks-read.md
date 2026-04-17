---
sidebar_label: "Bookmarks - Read"
keywords:
  - "/o"
  - "o"
---
# Read bookmarks

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=drill_bookmarks
```

## Overview

Lists Drill bookmarks visible to the current member. Bookmarks store saved Drill query filters (`query_obj`) and projection keys (`by_val`) used by `/o?method=segmentation`.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `Read` permission as evaluated by `FEATURE_DEPENDENCIES` (`funnels`, `cohorts`, `users`, `drill`, `formulas`).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `drill_bookmarks`. |
| `app_id` | String | Yes | Target app ID. |
| `event_key` | String | Conditional | Used for event-level bookmark mode (`app_level` not set to `1`). The server hashes `app_id + event_key` and matches stored `event_app_id`. |
| `app_level` | String | No | If `1`, returns app-level bookmarks by `app_id`; otherwise returns event-scoped bookmarks by `event_app_id`. |
| `apps` | JSON String (Array) | No | Optional app ID list when `app_level=1`; returns bookmarks where `app_id` is in this list. |
| `namespace` | String | No | Non-default namespace filter. If omitted or set to `drill`, only bookmarks without a stored `namespace` are returned. |
| `only_count` | Boolean String | No | If present, returns only the matching bookmark count instead of bookmark objects. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

Bookmark list:

```json
[
  {
    "_id": "67bd31c92e7f0b0012ab4567",
    "app_id": "64f5c0d8f4f7ac0012ab3456",
    "event_key": "[CLY]_session",
    "name": "US iOS Sessions",
    "desc": "Sessions for iOS users in US",
    "global": false,
    "creator": "64f5bf79f4f7ac0012ab1234",
    "query_obj": "{\"up.cc\":\"US\",\"up.p\":\"ios\"}",
    "query_text": "Country is US and platform is iOS",
    "by_val": "[\"up.p\"]",
    "by_val_text": "Platform",
    "event_app_id": "2c2f0f9a..."
  }
]
```

Count mode (`only_count`):

```json
5
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Array or Number | Bookmark array or count depending on request mode. |
| `_id` | String | Bookmark ID. Present in list mode. |
| `app_id` | String | App ID the bookmark belongs to. |
| `event_key` | String | Event key the bookmark belongs to. |
| `name` | String | Bookmark name. |
| `desc` | String | Bookmark description. |
| `global` | Boolean | Whether the bookmark is visible beyond its creator. |
| `creator` | String | Member ID of the bookmark creator. |
| `query_obj` | String | Saved Drill query object JSON string. Uses the same shape as segmentation `queryObject`. |
| `query_text` | String | Human-readable query label. |
| `by_val` | String | Saved projection key array JSON string, equivalent to segmentation `projectionKey`. |
| `by_val_text` | String | Human-readable projection label. |
| `namespace` | String | Non-default namespace, when stored. Default Drill bookmarks usually omit this field. |
| `visualization` | String | Optional visualization hint. |
| `sign` | String | Deterministic duplicate-detection signature. |
| `event_app_id` | String | MD5 hash of `app_id + event_key` used for event-scoped lookup. |

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior/Processing

- Filters bookmarks by user visibility: globally visible bookmarks or bookmarks created by the current member.
- Applies namespace and app/event scope rules.
- Uses `event_app_id` hash for event-scoped bookmarks when `app_level` is not `1`.
- Returns a number instead of an array when `only_count` is provided.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### List event-scoped bookmarks

```text
/o?method=drill_bookmarks&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event_key=[CLY]_session
```

### Get bookmark count

```text
/o?method=drill_bookmarks&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event_key=[CLY]_session&
  only_count=true
```

### List app-level bookmarks for multiple apps

```text
/o?method=drill_bookmarks&
  app_id=64f5c0d8f4f7ac0012ab3456&
  app_level=1&
  apps=["64f5c0d8f4f7ac0012ab3456","64f5c0d8f4f7ac0012ab7890"]
```

---

## Related Endpoints

- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)
- [Bookmark - Update](bookmark-update.md)
- [Bookmark - Delete](bookmark-delete.md)

---

## Last Updated

2026-04-17
