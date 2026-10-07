---
sidebar_label: "Permissions Metadata Read"
keywords:
  - "/o/users/permissions"
  - "permissions"
  - "users"
last_update:
  date: "2026-02-17"
---

# Users Management - Permissions Metadata Read

## Endpoint

```plaintext
/o/users/permissions
```

## Overview

Returns feature permission dependency metadata used when building permission matrices.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires `core` read permission for the selected app scope.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes for non-global-admin users | App id used by read-permission validation. |

## Examples

### Example 1: Read permission dependency metadata

```plaintext
/o/users/permissions?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "features": [
    "core",
    "events"
  ],
  "featuresPermissionDependency": {
    "data_manager": {
      "u": {
        "data_manager": ["r", "u"]
      }
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `features` | Array of String | Base feature list used in dependency calculation. |
| `featuresPermissionDependency` | Object | Dependency graph populated by installed modules. |
| `featuresPermissionDependency.featureKey.crudKey.dependencyFeatureKey` | Array of String | Required CRUD permissions for dependency feature. |

### Error Responses

Authentication and authorization failures are returned by the common auth layer.

## Behavior

### Behavior Modes

| Mode | Trigger | Response Shape |
|---|---|---|
| Dependency graph returned | Permissions check passes | Object containing `features` and `featuresPermissionDependency`. |

## Limitations

- Output is metadata for permission dependency, not a per-user effective-permissions result.
- Content depends on installed modules that contribute dependency rules.

## Related Endpoints

- [User Update](i-users-update.md)
- [Current User Read](o-users-me.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not directly read or write database collections.

</details>
