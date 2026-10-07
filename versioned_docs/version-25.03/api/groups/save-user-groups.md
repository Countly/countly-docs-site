---
sidebar_label: "Assign User"
keywords:
  - "/i/groups/save-user-group"
  - "save-user-group"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Assign User to Groups

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/groups/save-user-group
```

## Overview

Assigns a user to one or more groups, or clears all user group assignments when `group_id` is omitted/empty.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `args` | Object (JSON string) | Yes | Stringified assignment object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | String | Yes | User email |
| `group_id` | Array | No | Group IDs to assign. Empty/omitted removes all group assignments |

## Examples

### Example 1: Assign User to Two Groups

Endpoint form:

```text
https://your-server.com/i/groups/save-user-group?api_key=YOUR_API_KEY&args={"email":"analyst@example.com","group_id":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012"]}
```

Decoded `args` object:

```json
{
  "email": "analyst@example.com",
  "group_id": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ]
}
```

### Example 2: Remove User from All Groups

Endpoint form:

```text
https://your-server.com/i/groups/save-user-group?api_key=YOUR_API_KEY&args={"email":"analyst@example.com","group_id":[]}
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
| `result` | String | Operation status |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{ "result": "Not enough args" }` |
| 400 | `{ "result": "User Not found" }` |
| 400 | `{ "result": "group_id is wrong!" }` |
| 400 | `{ "result": "Cannot add Global Admin to group" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |

## Behavior

1. Validates user by `email`.
2. When `group_id` is provided, validates groups and merges permissions from target groups.
3. Synchronizes both sides of membership (`members.group_id` and `groups.users`).
4. When `group_id` is missing/empty, removes all group assignments from the user.

## Related Endpoints

- [Groups - Get Group Users](users.md)
- [Groups - Assign Many Users to a Group](save-many-user-groups.md)
- [Groups - Remove User from Group](remove-user.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Endpoint data source | ** - User group assignments and effective permissions |
| `countly.groups` | Endpoint data source | ** - Group user list synchronization |

</details>
