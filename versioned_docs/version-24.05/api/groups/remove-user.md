---
sidebar_label: "Remove User"
keywords:
  - "/i/groups/remove-user-group"
  - "remove-user-group"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Remove User from Group

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/groups/remove-user-group
```

## Overview

Removes one user from one group and recalculates the user effective access from remaining groups.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `args` | Object (JSON string) | Yes | Stringified remove-user object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | String | Yes | User email |
| `group_id` | String | Yes | Group ID to remove from user |

## Examples

### Example: Remove User from One Group

Endpoint form:

```text
https://your-server.com/i/groups/remove-user-group?api_key=YOUR_API_KEY&args={"email":"analyst@example.com","group_id":"507f1f77bcf86cd799439011"}
```

Decoded `args` object:

```json
{
  "email": "analyst@example.com",
  "group_id": "507f1f77bcf86cd799439011"
}
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
| 400 | `{ "result": "User not found" }` |
| 400 | `{ "result": "User is not in any group" }` |
| 400 | `{ "result": "User is not in given group" }` |
| 400 | `{ "result": "Group not found" }` |
| 400 | `{ "result": "Group does not have any user" }` |
| 400 | `{ "result": "Group does not have given user" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |

## Behavior

1. Validates user-group relation.
2. Removes user from `groups.users`.
3. Recomputes user effective permissions from remaining groups.
4. Updates user `group_id`, `admin_of`, `user_of`, `restrict`, `global_admin`, and `permission`.

## Related Endpoints

- [Groups - Assign User to Groups](save-user-groups.md)
- [Groups - Get Group Users](users.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Group membership update source/target |
| `countly.members` | Endpoint data source | ** - User permission and group assignment update target |

</details>
