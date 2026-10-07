---
sidebar_label: "Delete"
keywords:
  - "/i/groups/delete"
  - "delete"
  - "groups"
last_update:
  date: "2026-02-16"
---

# Delete Group

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/groups/delete
```

## Overview

Deletes a group and removes its membership references from users.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Behavior

1. Validates `_id`.
2. Deletes group from `countly.groups`.
3. Removes group ID from `countly.members.group_id`.
4. Rebuilds permissions for affected users.

## Related Endpoints

- [Groups - List Groups](list.md)
- [Groups - Get Group Details](details.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Deleted group record |
| `countly.members` | Endpoint data source | ** - Membership and permission rebuild target |

</details>
