---
sidebar_label: "Comment Delete"
keywords:
  - "/i/crashes/delete_comment"
  - "delete_comment"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Delete Comment

## Endpoint

```plaintext
/i/crashes/delete_comment
```

## Overview

Deletes one comment from a crash group. Only the comment author or global admin can delete.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `crashes` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | Target app ID for validation context. |
| `args` | JSON String (Object) | Yes | Delete payload. |
| `args.app_id` | String | Yes | App ID used by delete path. |
| `args.crash_id` | String | Yes | Crash group ID. |
| `args.comment_id` | String | Yes | Comment ID to delete. |

## Examples

```plaintext
/i/crashes/delete_comment?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"app_id":"6991c75b024cb89cdc04efd2","crash_id":"crash_group_1","comment_id":"comment_1"}
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

Note: this endpoint returns `Success` even when the comment is missing or user is not allowed to delete it.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` for both applied deletes and no-op branches. |

### Error Responses

- `400`

```json
{
  "result": "Please provide args parameter"
}
```

Standard auth/permission errors from delete validation can also be returned.

## Behavior

- Finds target crash group and comment by `comment_id`.
- If user is author or global admin, removes the comment from array.
- Emits `crash_deleted_comment` system log action when delete is applied.
- If comment not found / not permitted, returns `Success` without changes.

## Related Endpoints

- [Crashes - Add Comment](./i-crashes-add-comment.md)
- [Crashes - Edit Comment](./i-crashes-edit-comment.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Crash comments | Pulls matching comment entry when authorized. |
| `countly.systemlogs` | Audit trail | Receives `crash_deleted_comment` action when delete occurs. |

</details>
