---
sidebar_label: "Update"
keywords:
  - "/i/groups/update"
  - "update"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Update Group

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/groups/update
```

## Overview

Updates an existing group definition and optionally reprocesses assigned users.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `args` | Object (JSON string) | Yes | Stringified update object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Group ID to update |
| `name` | String | Yes | Group display name |
| `groupID` | String | Yes | Unique group identifier |
| `global_admin` | Boolean | Yes | Global admin flag for group members |
| `users` | Array | No | User IDs for update scope |
| `admin_of` | Array | No | Backward-compatible app admin mapping input |
| `user_of` | Array | No | Backward-compatible app user mapping input |
| `permission` | Object | No | Updated permission object |

## Examples

### Example: Update Group

Endpoint form:

```text
https://your-server.com/i/groups/update?api_key=YOUR_API_KEY&args={"_id":"507f1f77bcf86cd799439011","name":"Marketing Team","groupID":"marketing-team","global_admin":false,"permission":{}}
```

Decoded `args` object:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Marketing Team",
  "groupID": "marketing-team",
  "global_admin": false,
  "permission": {}
}
```

## Response

### Success Response

```json
{
  "result": {
    "status": "Success",
    "group": {
      "name": "Marketing Team",
      "groupID": "marketing-team",
      "global_admin": false,
      "permission": {}
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Update operation result |
| `result.status` | String | Always `Success` when update succeeds |
| `result.group` | Object | Updated payload returned by handler |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{ "result": "Not enough args" }` |
| 200 | `{ "result": "groups.error-unique-group-id" }` |
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from update path |

## Behavior

1. Validates required fields in `args`.
2. Ensures `groupID` uniqueness excluding current group.
3. Updates group document.
4. If `users` is provided, rebuilds user permission state.
5. If `users` is omitted/empty, removes this group from previously linked users.

## Related Endpoints

- [Groups - Create Group](create.md)
- [Groups - Delete Group](delete.md)
- [Groups - Get Group Details](details.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Updated group record |
| `countly.members` | Endpoint data source | ** - Updated during group membership synchronization |

</details>
