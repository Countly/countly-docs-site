---
sidebar_label: "Delete"
keywords:
  - "/i/groups/delete"
  - "delete"
  - "groups"
---

# Delete Group

## Endpoint

```
/i/groups/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a group and removes its membership references from users.

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
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from delete path |

## Behavior/Processing

1. Validates `_id`.
2. Deletes group from `countly.groups`.
3. Removes group ID from `countly.members.group_id`.
4. Rebuilds permissions for affected users.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Deleted group record |
| `countly.members` | Endpoint data source | ** - Membership and permission rebuild target |

---

## Examples

### Example: Delete Group

Endpoint form:

```text
https://your-server.com/i/groups/delete?api_key=YOUR_API_KEY&args={"_id":"507f1f77bcf86cd799439011"}
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
- [Groups - Get Group Details](details.md)

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
