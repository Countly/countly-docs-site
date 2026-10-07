---
sidebar_label: "Assign Many"
keywords:
  - "/i/groups/save-many-user-group"
  - "save-many-user-group"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Assign Many Users to a Group

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/groups/save-many-user-group
```

## Overview

Bulk-assigns many users (by email list) to one group.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `args` | Object (JSON string) | Yes | Stringified bulk assignment object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `emails` | Array | Yes | User email list |
| `group_id` | String | Yes | Target group ID |

## Examples

### Example: Assign Many Users

Endpoint form:

```text
https://your-server.com/i/groups/save-many-user-group?api_key=YOUR_API_KEY&args={"emails":["a@example.com","b@example.com","c@example.com"],"group_id":"507f1f77bcf86cd799439011"}
```

Decoded `args` object:

```json
{
  "emails": [
    "a@example.com",
    "b@example.com",
    "c@example.com"
  ],
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
| 400 | `{ "result": "Users not found" }` |
| 400 | `{ "result": "Cannot add Global Admin to group" }` |
| 400 | `{ "result": "Group not found" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |

## Behavior

1. Validates `emails` and `group_id`.
2. Loads target users and group.
3. Merges each user permission with group permission.
4. Updates users in bulk and updates group member list.

## Related Endpoints

- [Groups - Assign User to Groups](save-user-groups.md)
- [Groups - Get Group Users](users.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Endpoint data source | ** - Bulk update target |
| `countly.groups` | Endpoint data source | ** - Group member list update target |

</details>
