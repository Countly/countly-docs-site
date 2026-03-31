---
sidebar_label: "Remove User"
---

# Remove User from Group

## Endpoint

```
/i/groups/remove-user-group
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Removes one user from one group and recalculates the user effective access from remaining groups.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Behavior/Processing

1. Validates user-group relation.
2. Removes user from `groups.users`.
3. Recomputes user effective permissions from remaining groups.
4. Updates user `group_id`, `admin_of`, `user_of`, `restrict`, `global_admin`, and `permission`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Group membership update source/target |
| `countly.members` | Endpoint data source | ** - User permission and group assignment update target |

---

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

---

## Related Endpoints

- [Groups - Assign User to Groups](save-user-groups.md)
- [Groups - Get Group Users](users.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
