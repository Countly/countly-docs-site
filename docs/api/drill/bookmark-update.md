---
sidebar_label: "Bookmark - Update"
keywords:
  - "/i/drill/edit_bookmark"
  - "edit_bookmark"
  - "drill"
---
# Update bookmark

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/edit_bookmark
```

## Overview

Updates an existing bookmark created by the current member.

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
| `bookmark_id` | String | Yes | Bookmark ID to edit. |
| `event_key` | String | Yes | Event key for bookmark scope. |
| `query_obj` | JSON String (Object) | Yes | Query object as JSON string. |
| `query_text` | String | Yes | Human-readable query text. |
| `by_val` | JSON String (Array) | Yes | Segmentation key list as JSON string. |
| `by_val_text` | String | Yes | Human-readable segmentation text. |
| `name` | String | Yes | Bookmark name. |
| `desc` | String | Yes | Bookmark description. |
| `global` | Boolean String | Yes | `true` or `false`. |
| `visualization` | String | No | Visualization hint. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "result": {
    "status": "Success",
    "sign": "f3eab4f2f8d1..."
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result.status` | String | Success status string. |
| `result.sign` | String | Updated bookmark signature hash. |

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
  "result": "Bookmark not found"
}
```

- `400`

```json
{
  "result": "Duplicate entry"
}
```

## Behavior/Processing

- Validates required update fields.
- Loads bookmark by ID and ensures ownership.
- Recomputes signature and event-app hash.
- Updates bookmark and emits bookmark/systemlog events.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/drill/edit_bookmark?
  app_id=64f5c0d8f4f7ac0012ab3456&
  bookmark_id=67bd31c92e7f0b0012ab4567&
  event_key=[CLY]_session&
  name=US Sessions Updated&
  desc=Updated bookmark description&
  global=false&
  query_obj={"cc":"US"}&
  query_text=country is US&
  by_val=["sg.p"]&
  by_val_text=Platform
```

---

## Related Endpoints

- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)

---

## Last Updated

2026-02-16
