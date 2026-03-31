---
sidebar_position: 1
sidebar_label: "Overview"
---

# Groups - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Groups helps you manage access in Countly by assigning users to reusable access profiles. A group can carry permissions, app scopes, restrictions, and optional global admin access, then apply them to one or many members.

## Quick Links

- [List Groups](list.md)
- [Get Group Details](details.md)
- [Get Group Users](users.md)
- [Create Group](create.md)
- [Update Group](update.md)
- [Delete Group](delete.md)
- [Assign User to Groups](save-user-groups.md)
- [Assign Many Users to a Group](save-many-user-groups.md)
- [Remove User from Group](remove-user.md)

## Key Features

- Create, update, and delete access groups.
- Assign one user to multiple groups in one request.
- Assign multiple users to one group in one request.
- Merge permissions from multiple group memberships.
- Rebuild user permissions after group updates/deletes.
- Keep group membership and user permission fields synchronized.

## Group Configuration Fields

These fields are used in create and update operations.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Group display name |
| `groupID` | String | Yes | Unique group identifier |
| `global_admin` | Boolean | Yes | If `true`, group membership grants global admin |
| `users` | Array | No | Member user IDs to include in operation |
| `admin_of` | Array | No | Backward-compatible app admin list |
| `user_of` | Array | No | Backward-compatible app user list |
| `permission` | Object | No | Permission object used for merged effective access |

## Permission Structure

Groups store access as a structured permission object. A common baseline looks like:

```json
{
  "_": { "u": [], "a": [] },
  "c": {},
  "r": {},
  "u": {},
  "d": {}
}
```

Field meaning:

- `_`: global-level access buckets
- `c`: create access by scope
- `r`: read access by scope
- `u`: update/user-level access by scope
- `d`: delete/data-level access by scope

## Workflows

### Create and assign a group

1. Create group with `/i/groups/create`.
2. Assign users during create (`users`) or via `/i/groups/save-user-group`.
3. Validate result with `/o/groups/group-details` and `/o/groups/group-users`.

### Bulk onboarding

1. Prepare user email list.
2. Call `/i/groups/save-many-user-group`.
3. Confirm membership with `/o/groups/group-users`.

## Use Cases

### Use Case 1: Department-Based Access Control

Organize users by department with specific application access:

```json
{
  "name": "Marketing Team",
  "groupID": "marketing_team",
  "global_admin": false,
  "users": ["user_id_1", "user_id_2", "user_id_3"],
  "admin_of": ["marketing_app"],
  "user_of": ["crm_app", "analytics_app"],
  "restrict": [],
  "permission": {
    "_": { "u": [], "a": [] },
    "c": { "marketing_app": { "all": true, "allowed": {} } },
    "r": { "crm_app": { "all": true, "allowed": {} }, "analytics_app": { "all": true, "allowed": {} } },
    "u": {},
    "d": {}
  }
}
```

Result: All marketing team members can create campaigns in `marketing_app`, read data from `crm_app` and `analytics_app`, and cannot modify other apps.

### Use Case 2: Global Administrator Group

Create a group whose members become global admins:

```json
{
  "name": "Global Admins",
  "groupID": "global_admins",
  "global_admin": true,
  "users": ["executive_1", "executive_2"],
  "admin_of": [],
  "user_of": [],
  "restrict": [],
  "permission": {
    "_": { "u": ["all"], "a": ["all"] },
    "c": {},
    "r": {},
    "u": {},
    "d": {}
  }
}
```

Result: Members have unrestricted access to all applications and features.

### Use Case 3: Readonly Analyst Access

Create a read-only group for analysts across multiple apps:

```json
{
  "name": "Data Analysts",
  "groupID": "data_analysts",
  "global_admin": false,
  "users": ["analyst_1", "analyst_2", "analyst_3"],
  "admin_of": [],
  "user_of": ["app_1", "app_2", "app_3"],
  "restrict": [],
  "permission": {
    "_": { "u": [], "a": [] },
    "r": {
      "app_1": { "all": true, "allowed": {} },
      "app_2": { "all": true, "allowed": {} },
      "app_3": { "all": true, "allowed": {} }
    },
    "c": {},
    "u": {},
    "d": {}
  }
}
```

Result: Analysts can only view data and cannot create, edit, or delete.

### Use Case 4: IP-Restricted Support Group

Create a group with IP-based restrictions for a support team:

```json
{
  "name": "Support Team (Office Only)",
  "groupID": "support_office",
  "global_admin": false,
  "users": ["support_1", "support_2", "support_3"],
  "admin_of": [],
  "user_of": ["support_app"],
  "restrict": ["IP:203.0.113.0/24"],
  "permission": {
    "_": { "u": [], "a": [] },
    "r": { "support_app": { "all": true, "allowed": {} } },
    "c": { "support_app": { "all": true, "allowed": {} } },
    "u": {},
    "d": {}
  }
}
```

Result: Support team access is limited to `support_app` and can be constrained by office IP policy.

### Use Case 5: Multi-Group User Permissions

A user can belong to multiple groups and receive merged permissions.

Example:
- User `john@example.com` is assigned to `sales_team` (`admin_of: ["app_123"]`) and `report_viewers` (`user_of: ["app_456"]`).
- Effective result: admin access on `app_123`, read access on `app_456`.

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.groups` | Stores group definitions, permissions, and member references |
| `countly.members` | Stores effective user permissions and group memberships (`group_id`) |

## Performance Considerations

- `save-many-user-group` is preferred for onboarding many users to one group.
- Group update/delete operations trigger permission synchronization for affected users.
- Large membership changes can increase write volume to `countly.members`.

## Troubleshooting

| API Result | Meaning | Action |
|---|---|---|
| `Not enough args` | Missing required fields in `args` | Validate request payload against endpoint docs |
| `groups.error-unique-group-id` | Group ID already exists | Use a unique `groupID` value |
| `User Not found` / `Users not found` | One or more user emails do not exist | Validate target users before assignment |
| `Group not found` | Target group ID is invalid | Confirm group exists via `list`/`details` endpoints |
| `Cannot add Global Admin to group` | Non-global-admin group assignment for global admin user | Use a global-admin group or skip that user |

## Limitations and Notes

- All endpoints are guarded by `validateGlobalAdmin`; global admin access is required.
- Some validation failures intentionally return HTTP `200` with `{ "result": "..." }` messages (for example `Not enough args`).
- Group assignment endpoints use live permission merging, so resulting user permission is based on all assigned groups.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

_Last Updated: 2026-02-15_
