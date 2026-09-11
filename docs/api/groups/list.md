---
sidebar_label: "List"
keywords:
  - "/o/groups"
  - "groups"
last_update:
  date: "2026-02-16"
---

# List Groups

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/groups
```

## Overview

Returns all groups with computed member counts.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required access**: global admin

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example: List all groups

```text
https://your-server.com/o/groups?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": [
    {
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
      },
      "users": ["507f191e810c19729de860ea"],
      "matched_users_count": 1
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | List of group documents |
| `result[].matched_users_count` | Number | Computed user count via lookup on `members` |
| `result[].users` | Array | Group member IDs |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing parameter \"api_key\" or \"auth_token\"" }` |
| 400 | Error object from database read path |

## Behavior

1. Loads groups from `countly.groups`.
2. Performs lookup into `countly.members` to compute `matched_users_count`.
3. Returns groups as `{ "result": [...] }`.

## Related Endpoints

- [Groups - Get Group Details](details.md)
- [Groups - Get Group Users](users.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.groups` | Endpoint data source | ** - Primary source collection |
| `countly.members` | Endpoint data source | ** - Lookup source for `matched_users_count` |

</details>
