---
sidebar_label: "Bookmarks - Read"
---
# Read bookmarks

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o?method=drill_bookmarks
```

## Overview

Lists Drill bookmarks visible to the current member.

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
| `event_key` | String | Conditional | Used for event-level bookmark mode (`app_level` not set to `1`). |
| `app_level` | String | No | If `1`, returns app-level bookmarks; otherwise uses event hash scope. |
| `apps` | JSON String (Array) | No | Optional app list when `app_level=1`. |
| `namespace` | String | No | Non-default namespace filter. |
| `only_count` | Boolean String | No | If present, returns only count. |
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
    "global": false
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

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior/Processing

- Filters bookmarks by user visibility (`global` or creator).
- Applies namespace and app/event scope rules.
- Uses `event_app_id` hash for event-scoped bookmarks.

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

---

## Related Endpoints

- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)
- [Bookmark - Update](bookmark-update.md)
- [Bookmark - Delete](bookmark-delete.md)

---

## Last Updated

2026-02-16
