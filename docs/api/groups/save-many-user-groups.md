---
sidebar_label: "Assign Many"
keywords:
  - "/i/groups/save-many-user-group"
  - "save-many-user-group"
  - "groups"
---

# Assign Many Users to a Group

## Endpoint

```
/i/groups/save-many-user-group
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Bulk-assigns many users (by email list) to one group.

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
| `args` | Object (JSON string) | Yes | Stringified bulk assignment object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `emails` | Array | Yes | User email list |
| `group_id` | String | Yes | Target group ID |

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

## Behavior/Processing

1. Validates `emails` and `group_id`.
2. Loads target users and group.
3. Merges each user permission with group permission.
4. Updates users in bulk and updates group member list.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Endpoint data source | ** - Bulk update target |
| `countly.groups` | Endpoint data source | ** - Group member list update target |

---

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
