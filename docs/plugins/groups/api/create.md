---
sidebar_label: "Create"
---

# Create Group

## Endpoint

```
/i/groups/create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a new group definition and optionally assigns users.

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
| `args` | Object (JSON string) | Yes | Stringified group object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Group display name |
| `groupID` | String | Yes | Unique group identifier |
| `global_admin` | Boolean | Yes | Global admin flag for group members |
| `users` | Array | No | User IDs to assign during creation |
| `admin_of` | Array | No | Backward-compatible app admin mapping input |
| `user_of` | Array | No | Backward-compatible app user mapping input |
| `permission` | Object | No | Group permission object |

## Response

### Success Response

```json
{
  "result": {
    "status": "Success",
    "group": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Marketing Team",
      "groupID": "marketing-team",
      "global_admin": false,
      "permission": {
        "_": { "u": [], "a": [] },
        "c": {},
        "r": {},
        "u": {},
        "d": {}
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Create operation result |
| `result.status` | String | Always `Success` when created |
| `result.group` | Object | Created group payload |
| `result.group._id` | String | New group ID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{ "result": "Not enough args" }` |
| 200 | `{ "result": "groups.error-unique-group-id" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from create path |

## Behavior/Processing

1. Validates required fields in `args`.
2. Validates unique `groupID`.
3. Creates group in `countly.groups`.
4. If `users` is provided, updates matched users and synchronizes group membership fields.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Stores created group record |
| `countly.members` | Endpoint data source | ** - Updated when `users` are passed in create request |

---

## Examples

### Example 1: Create Group

Endpoint form:

```text
https://your-server.com/i/groups/create?api_key=YOUR_API_KEY&args={"name":"Marketing Team","groupID":"marketing-team","global_admin":false,"permission":{"_":{"u":[],"a":[]},"c":{},"r":{},"u":{},"d":{}}}
```

Decoded `args` object:

```json
{
  "name": "Marketing Team",
  "groupID": "marketing-team",
  "global_admin": false,
  "permission": {
    "_": { "u": [], "a": [] },
    "c": {},
    "r": {},
    "u": {},
    "d": {}
  }
}
```

### Example 2: Create Group with Initial Users

Endpoint form:

```text
https://your-server.com/i/groups/create?api_key=YOUR_API_KEY&args={"name":"Support Team","groupID":"support-team","global_admin":false,"users":["507f191e810c19729de860ea","507f191e810c19729de860eb"]}
```

---

## Related Endpoints

- [Groups - Update Group](update.md)
- [Groups - Delete Group](delete.md)
- [Groups - Assign User to Groups](save-user-groups.md)

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
