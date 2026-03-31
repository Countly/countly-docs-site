---
sidebar_label: "Bookmark - Delete"
---
# Delete bookmark

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/delete_bookmark
```

## Overview

Deletes one saved Drill bookmark.

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
| `bookmark_id` | String | Yes | Bookmark ID to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when bookmark is deleted. |

### Error Responses

- `200`

```json
{
  "result": "Not enough args"
}
```

- `401`

```json
{
  "result": "Don't have permission to delete bookmark"
}
```

- `500`

```json
{
  "result": "Query delete error"
}
```

## Behavior/Processing

- Validates bookmark ID.
- Allows deletion for global bookmarks or user-owned bookmarks.
- Deletes bookmark and emits cleanup/systemlog events.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/drill/delete_bookmark?
  app_id=64f5c0d8f4f7ac0012ab3456&
  bookmark_id=67bd31c92e7f0b0012ab4567
```

---

## Related Endpoints

- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)

---

## Last Updated

2026-02-16
