---
sidebar_label: "Message Get"
keywords:
  - "/o/push/message/GET"
  - "message"
  - "push"
last_update:
  date: "2026-10-01"
---

# Push - Message Get

## Endpoint

```plaintext
/o/push/message/GET
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
| `app_id` | String | Yes | App ID used by permission validation. The message lookup is limited to this app. |
| `_id` | String (ObjectID) | Yes | Message ID query parameter. |

## Examples

### Read one message

```plaintext
/o/push/message/GET?
  api_key=YOUR_API_KEY&
  _id=67a3d2f5c1a23b0f4d6c0101&
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
| `(root)` | Object | Stored push message document, with `status` recomputed and a `schedules` array attached. |
| `_id` | String | Message ID. |
| `status` | String | Current push message status. |
| `platforms` | Array | Target platforms. |
| `contents` | Array | Localized/title/body payload content entries. |
| `triggers` | Array | Message trigger definitions. |
| `schedules` | Array | Up to 20 most recent schedule records for this message, newest `scheduledTo` first. |

### Error Responses

- `400`

```json
{
  "errors": [
    "Missing _id argument"
  ]
}
```

- `400` (`_id` is not a valid ObjectID)

```json
{
  "errors": [
    "Incorrect ObjectID for _id"
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
- Reads the message by ID (limited to `app_id`) and attaches its 20 most recent schedule records as `schedules`.
- Recomputes the returned `status`: for an active message with a date trigger (`plain`, `rec` or `multi`) that has at least one schedule, the latest schedule's status is returned; otherwise the message's own status is returned.
- Returns the message object.

## Related Endpoints

- [Push - Message List](message-all.md)
- [Push - Message Update](message-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.messages` | Push message storage | Reads one message document by ID (scoped to `app_id`). |
| `countly.message_schedules` | Schedules | Joins the latest 20 schedules by `messageId`. |

</details>
