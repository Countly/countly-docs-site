---
sidebar_label: "Details"
keywords:
  - "/o/groups/group-details"
  - "group-details"
  - "groups"
---

# Get Group Details

## Endpoint

```
/o/groups/group-details
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns one group by ID.

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
| `args` | Object (JSON string) | Yes | Stringified object containing `_id` |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Group ID |

## Response

### Success Response

```json
{
  "result": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Marketing Team",
    "groupID": "marketing-team",
    "global_admin": false,
    "users": ["507f191e810c19729de860ea"],
    "permission": {
      "_": { "u": [], "a": [] },
      "c": {},
      "r": {},
      "u": {},
      "d": {}
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object or `null` | Matching group document |
| `result.users` | Array | Member IDs in the group |
| `result.permission` | Object | Stored group permission object |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{ "result": "Not enough args" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from details lookup path |

## Behavior/Processing

1. Parses `args` and validates `_id`.
2. Reads group from `countly.groups`.
3. Returns `{ "result": group }`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Group document source |

---

## Examples

### Example: Get one group

Endpoint form:

```text
https://your-server.com/o/groups/group-details?api_key=YOUR_API_KEY&args={"_id":"507f1f77bcf86cd799439011"}
```

Decoded `args` object:

```json
{
  "_id": "507f1f77bcf86cd799439011"
}
```

---

## Related Endpoints

- [Groups - List Groups](list.md)
- [Groups - Update Group](update.md)
- [Groups - Delete Group](delete.md)

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
