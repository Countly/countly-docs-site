---
sidebar_label: "Test Users Lookup"
keywords:
  - "/o/push/test-users"
  - "test users"
  - "push"
last_update:
  date: "2026-11-14"
---

# /o/push/test-users

## Endpoint

```plaintext
/o/push/test-users
```

Ⓔ Enterprise Only

## Overview

Finds app users to use as push test users. Search by part of the device ID, or get specific users by user ID (`uid`).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission for Push Notifications.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes* | API key authentication |
| `auth_token` | String | Yes* | Session token authentication |
| `app_id` | String | Yes | App ID |
| `search` | String | Conditional | Part of the device ID to search for (case-insensitive); required if `uids` is not provided |
| `uids` | String | Conditional | Comma-separated list of user IDs (`uid`); required if `search` is not provided |

`*` Provide either `api_key` or `auth_token`.

## Examples

### Search users by device ID

```plaintext
https://your-server.com/o/push/test-users
  ?api_key=YOUR_API_KEY
  &app_id=6991c75b024cb89cdc04efd2
  &search=abc
```

### Get users by user ID

```plaintext
https://your-server.com/o/push/test-users
  ?api_key=YOUR_API_KEY
  &app_id=6991c75b024cb89cdc04efd2
  &uids=1,2,3
```

## Response

### Success Response

```json
[
  {
    "_id": "6991c75b024cb89cdc04efe1",
    "uid": "1",
    "did": "device_abc_001"
  },
  {
    "_id": "6991c75b024cb89cdc04efe2",
    "uid": "2",
    "did": "device_abc_002"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | App user record ID |
| `uid` | String | User ID |
| `did` | String | Device ID |

### Error Responses

`400 Bad Request`

```json
{
  "errors": ["One of search & uids parameters is required"]
}
```

```json
{
  "errors": ["Missing parameter \"app_id\""]
}
```

## Behavior

1. Validates `search` and `uids`.
2. If `uids` is provided, returns the users with those IDs. At most 1000 IDs are used and at most 1000 users are returned.
3. Otherwise, if `search` is not empty, returns users whose device ID matches it. At most 20 users are returned.
4. Results are sorted by device ID.
5. If neither `uids` nor a non-empty `search` is provided, returns `400`.

### Impact on Other Data

This endpoint is read-only and does not modify data.

## Limitations

- When both `uids` and `search` are sent, `uids` is used and `search` is ignored.
- A `search` lookup returns at most 20 users.

## Related Endpoints

- [Push Notifications - Message Test](./message-test.md)
- [Push Notifications - User History](./user.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose | Key Fields |
|---|---|---|
| `countly.app_users{appId}` | Source of the users returned | `uid`, `did` |

</details>
