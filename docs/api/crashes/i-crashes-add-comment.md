---
sidebar_label: "Comment Create"
keywords:
  - "/i/crashes/add_comment"
  - "add_comment"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Add Comment

## Endpoint

```plaintext
/i/crashes/add_comment
```

## Overview

Adds a comment to a crash group.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `crashes` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | Target app ID for validation context. |
| `args` | JSON String (Object) | Yes | Comment payload. |
| `args.app_id` | String | Yes | App ID used by comment write path. |
| `args.crash_id` | String | Yes | Crash group ID. |
| `args.text` | String | No | Comment text. Default empty string. |
| `args.time` | Number | No | Comment timestamp in ms. Default current time. |

## Examples

```plaintext
/i/crashes/add_comment?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"app_id":"6991c75b024cb89cdc04efd2","crash_id":"crash_group_1","text":"Investigating root cause"}
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
| `result` | String | `Success` when request is accepted. |

### Error Responses

- `400`

```json
{
  "result": "Please provide args parameter"
}
```

Standard auth/permission errors from create validation can also be returned.

## Behavior

- Builds comment object with `_id`, `author`, `author_id`, `time`, `text`.
- Comment `_id` is SHA1 hash of app/crash/comment payload.
- Pushes comment into crash group `comments` array.
- Emits `crash_added_comment` system log action.

## Related Endpoints

- [Crashes - Edit Comment](./i-crashes-edit-comment.md)
- [Crashes - Delete Comment](./i-crashes-delete-comment.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Crash comments | Pushes new entry into `comments` array. |
| `countly.systemlogs` | Audit trail | Receives `crash_added_comment` action. |

</details>
