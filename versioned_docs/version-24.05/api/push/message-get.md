---
sidebar_label: "Message Get"
keywords:
  - "/o/push/message/{_id}"
  - "/o/push/message/67a3d2f5c1a23b0f4d6c0101"
  - "message"
  - "push"
last_update:
  date: "2026-04-09"
---

# Push - Message Get

## Endpoint

```plaintext
/o/push/message/{_id}
```

## Overview

Returns one push message object by ID.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `push` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID used by permission validation. |
| `{_id}` | String (ObjectID) | Yes | Message ID path parameter. |

## Examples

### Read one message

```plaintext
/o/push/message/67a3d2f5c1a23b0f4d6c0101?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "_id": "67a3d2f5c1a23b0f4d6c0101",
  "status": "created",
  "platforms": ["a", "i"],
  "contents": [
    {"message": "Hello users"}
  ],
  "triggers": [
    {"kind": "plain"}
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Full message object (`msg.json`) from push message model. |
| `_id` | String | Message ID. |
| `status` | String | Current push message status. |
| `platforms` | Array | Target platforms. |
| `contents` | Array | Localized/title/body payload content entries. |
| `triggers` | Array | Message trigger definitions. |

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

Standard authentication/authorization errors from read validation can also be returned.

## Behavior

- Validates the message ID as ObjectID.
- Reads the message by ID and joins recent `message_schedules` records.
- Recomputes the returned `status` from the message plus latest schedule.
- Returns raw message JSON payload via raw response body.

## Related Endpoints

- [Push - Message List](message-all.md)
- [Push - Message Update](message-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.messages` | Push message storage | Reads one message document by ID. |

</details>
