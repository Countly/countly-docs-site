---
sidebar_label: "Bookmark - Delete"
keywords:
  - "/i/drill/delete_bookmark"
  - "delete_bookmark"
  - "drill"
last_update:
  date: "2026-04-17"
---

# Delete bookmark

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/drill/delete_bookmark
```

## Overview

Deletes one saved Drill bookmark.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `drill` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `bookmark_id` | String | Yes | Bookmark ID to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/i/drill/delete_bookmark?
  app_id=64f5c0d8f4f7ac0012ab3456&
  bookmark_id=67bd31c92e7f0b0012ab4567
```

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

## Behavior

- Validates bookmark ID.
- Allows deletion for globally visible bookmarks, legacy bookmarks without `creator`, or user-owned bookmarks.
- Deletes bookmark and emits cleanup/systemlog events.
- Dispatches dashboard cleanup so widgets that reference the deleted Drill bookmark can be removed.

## Related Endpoints

- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
