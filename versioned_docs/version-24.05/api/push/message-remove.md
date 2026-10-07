---
sidebar_label: "Message Delete"
keywords:
  - "/i/push/message/remove"
  - "remove"
  - "push"
  - "message"
last_update:
  date: "2026-03-07"
---

# Push - Message Delete

## Endpoint

```plaintext
/i/push/message/remove
```

## Overview

Soft-deletes a push message by marking it deleted.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `push` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID used by permission validation. |
| `_id` | String (ObjectID) | Yes | Message ID to remove. |

## Examples

### Delete one message

```plaintext
/i/push/message/remove?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  _id=67a3d2f5c1a23b0f4d6c0101
```

## Response

### Success Response

```json
{}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Empty object returned when deletion succeeds. |

### Error Responses

- `400`

```json
{
  "errors": [
    "_id is required"
  ]
}
```

- `404`

```json
{
  "errors": [
    "Message not found"
  ]
}
```

- `400`

```json
{
  "kind": "ValidationError",
  "errors": [
    "Failed to delete the message, please try again"
  ]
}
```

Standard authentication/authorization errors from remove validation can also be returned.

## Behavior

- Validates `_id` as ObjectID.
- Loads message that is not already deleted.
- Stops active/scheduled execution via `msg.stop(...)`.
- Marks message as deleted with atomic update and stores removal metadata:
  - `result.removed`
  - `result.removedBy`
  - `result.removedByName`
- Emits `push_message_deleted` system log action on success.

### Impact on Other Data

- Updates one message document state in `countly.messages`.
- Adds one audit entry in `countly.systemlogs`.

## Related Endpoints

- [Push - Message Create](message-create.md)
- [Push - Message Update](message-update.md)
- [Push - Message Toggle](message-toggle.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.messages` | Push message storage | Reads target message and updates deletion state/metadata. |
| `countly.systemlogs` | Audit trail | Receives `push_message_deleted` action payload. |

</details>
