---
sidebar_label: "Read"
keywords:
  - "/o/groups/group-users"
  - "group-users"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Get Group Users

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/groups/group-users
```

## Overview

Returns members in a group, or members outside a group when `inverse` is `true`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `args` | Object (JSON string) | Yes | Stringified object containing group query options |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Group ID used for filtering |
| `inverse` | Boolean | No | If `true`, returns users not in the group |

## Examples

### Example 1: Members in a Group

Endpoint form:

```text
https://your-server.com/o/groups/group-users?api_key=YOUR_API_KEY&args={"_id":"507f1f77bcf86cd799439011"}
```

### Example 2: Members Not in a Group

Endpoint form:

```text
https://your-server.com/o/groups/group-users?api_key=YOUR_API_KEY&args={"_id":"507f1f77bcf86cd799439011","inverse":true}
```

## Response

### Success Response

```json
{
  "result": [
    {
      "_id": "507f191e810c19729de860ea",
      "full_name": "Jane Doe",
      "email": "jane.doe@example.com",
      "group_id": ["507f1f77bcf86cd799439011"],
      "global_admin": false
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | Matching members |
| `result[]` | Object | Member object (password is excluded) |
| `result[].group_id` | Array | Member group assignments |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{ "result": "Not enough args" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from members query path |

## Behavior

1. Parses `args` and validates `_id`.
2. Builds query:
   - `inverse=false` or omitted: `{ "group_id": "<group_id>" }`
   - `inverse=true`: `{ "group_id": { "$ne": "<group_id>" } }`
3. Returns members as `{ "result": [...] }`.

## Related Endpoints

- [Groups - Get Group Details](details.md)
- [Groups - Assign User to Groups](save-user-groups.md)
- [Groups - Assign Many Users to a Group](save-many-user-groups.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Endpoint data source | ** - Source of returned member list |

</details>
