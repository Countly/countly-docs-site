---
sidebar_label: "Message Pop"
keywords:
  - "/i/push/message/pop"
  - "pop"
  - "push"
  - "message"
last_update:
  date: "2026-10-15"
---

# Push - Message Pop

## Endpoint

```plaintext
/i/push/message/pop
```

## Overview

Removes users' pending notifications from a push message that uses an API trigger. It is the counterpart of [Message Push](./message-push.md): the filter selects the users whose queued notifications are removed.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `push` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |
| `_id` | String (ObjectID) | Yes | ID of the message. It must have an API trigger. |
| `filter` | Object | Yes | Selects the users whose notifications are removed. |
| `filter.user` | String | No | JSON filter on the app users collection. |
| `filter.drill` | String | No | Drill filter in JSON format. |
| `filter.geos` | Array | No | Array of geo IDs. |
| `filter.cohorts` | Array | No | Array of cohort IDs. |

## Examples

### Remove notifications for a group of users

```plaintext
/i/push/message/pop?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  _id=67a3d2f5c1a23b0f4d6c0101&
  filter={"cohorts":["67a3d2f5c1a23b0f4d6c0202"]}
```

## Response

### Success Response

```json
{
  "removed": 12
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `removed` | Number | Number of notifications removed. |

### Error Responses

- `400`

```json
{
  "kind": "ValidationError",
  "errors": [
    "_id is required"
  ]
}
```

- `400`

```json
{
  "kind": "PushError",
  "errors": [
    "No such message or it doesn't have API trigger"
  ]
}
```

- `400`

```json
{
  "kind": "PushError",
  "errors": [
    "Message is not api"
  ]
}
```

- `500`

```json
{
  "kind": "ServerError",
  "errors": [
    "Server error"
  ]
}
```

Standard authentication/authorization errors can also be returned.

## Behavior

- Validates `app_id`, `_id` and `filter`.
- Loads the message and checks that it belongs to the app in the request.
- Checks that the message has an API trigger.
- Removes the notifications of the users matched by `filter` and returns how many were removed.

## Related Endpoints

- [Push - Message Push](./message-push.md)
- [Push - Message Create](./message-create.md)
