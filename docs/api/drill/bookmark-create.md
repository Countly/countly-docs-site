---
sidebar_label: "Bookmark - Create"
keywords:
  - "/i/drill/add_bookmark"
  - "add_bookmark"
  - "drill"
---
# Create bookmark

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/add_bookmark
```

## Overview

Creates a saved Drill query bookmark. The stored query uses the same field names and operator syntax as `/o?method=segmentation` `queryObject`.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `drill` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `event_key` | String | Yes | Event key for bookmark scope. |
| `query_obj` | JSON String (Object) | Yes | Drill query object as JSON string. Use the same shape as `/o?method=segmentation` `queryObject`, for example `{"up.cc":"US"}` or `{"sg.plan":{"$in":["pro"]}}`. |
| `name` | String | Yes | Bookmark name. |
| `desc` | String | Yes | Bookmark description. |
| `global` | Boolean String | Yes | `true` or `false`. |
| `query_text` | String | No | Human-readable query label stored with the bookmark. If omitted for a normal bookmark, the server stores `{}` as `query_obj`. |
| `by_val` | JSON String (Array) | No | Drill projection key list as JSON string, equivalent to `/o?method=segmentation` `projectionKey`, for example `["up.p"]` or `["sg.plan"]`. Defaults to `[]`. |
| `by_val_text` | String | No | Human-readable projection label stored with the bookmark. |
| `namespace` | String | No | Optional non-default namespace. The default Drill namespace is stored without a `namespace` field. |
| `visualization` | String | No | Optional visualization hint included in duplicate-signature calculation. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "result": {
    "status": "Success",
    "id": "67bd31c92e7f0b0012ab4567",
    "sign": "f3eab4f2f8d1..."
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result.status` | String | Success status string. |
| `result.id` | String | New bookmark ID. |
| `result.sign` | String | Bookmark signature hash. |

### Error Responses

- `200`

```json
{
  "result": "Not enough args"
}
```

- `400`

```json
{
  "result": "Duplicate entry"
}
```

## Behavior/Processing

- Validates required bookmark fields and types.
- Parses `query_obj` to detect internal bookmarks. For normal bookmarks, `query_obj` and `query_text` must both be provided or the stored query is reset to `{}` with an empty label.
- Stores `by_val` as the segmentation/projection key list. If omitted, it stores `[]`.
- Builds deterministic `sign` from `app_id`, `namespace`, `event_key`, `creator`, `visualization`, parsed `query_obj`, and parsed `by_val`. Array and object ordering do not affect the signature.
- Rejects duplicate bookmarks when the computed `sign` already exists.
- Stores bookmark with `event_app_id` hash in Drill bookmarks collection.
- Emits bookmark/systemlog events.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/drill/add_bookmark?
  app_id=64f5c0d8f4f7ac0012ab3456&
  event_key=[CLY]_session&
  name=US iOS Sessions&
  desc=Sessions for iOS users in US&
  global=false&
  query_obj={"up.cc":"US","up.p":"ios"}&
  query_text=Country is US and platform is iOS&
  by_val=["up.p"]&
  by_val_text=Platform
```

### Create an event segmentation bookmark

```text
/i/drill/add_bookmark?
  app_id=64f5c0d8f4f7ac0012ab3456&
  event_key=Purchase&
  name=Purchase Plan Split&
  desc=Purchases grouped by selected plan&
  global=false&
  query_obj={"sg.plan":{"$in":["pro","enterprise"]}}&
  query_text=Plan is pro or enterprise&
  by_val=["sg.plan"]&
  by_val_text=Plan
```

---

## Related Endpoints

- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Update](bookmark-update.md)
- [Bookmark - Delete](bookmark-delete.md)

---

## Last Updated

2026-04-17
