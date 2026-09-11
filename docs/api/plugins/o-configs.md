---
sidebar_label: "Global Config Read"
keywords:
  - "/o/configs"
  - "configs"
last_update:
  date: "2026-02-17"
---

# /o/configs

## Endpoint

```plaintext
/o/configs
```

## Overview

Returns the current global configuration set visible to the dashboard, excluding internal `services` namespace.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: App Admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | Target app ID required by app-admin validation. |

## Examples

### Read global configuration for an app-admin context

```plaintext
/o/configs?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID
```

## Response

### Success Response

```json
{
  "api": {
    "country_data": true,
    "city_data": true
  },
  "frontend": {
    "session_timeout": 30
  },
  "drill": {
    "record_meta": true
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Raw object containing visible configuration namespaces. |
| `{namespace}` | Object | Namespace-level effective configuration. |
| `{namespace}.{setting}` | Varies | Effective setting value. |

### Error Responses

`400 Bad Request`

```json
{
  "result": "No app_id provided"
}
```

`400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

`400 Bad Request`

```json
{
  "result": "Token not valid"
}
```

`401 Unauthorized`

```json
{
  "result": "User does not exist"
}
```

`401 Unauthorized`

```json
{
  "result": "User does not have right"
}
```

`401 Unauthorized`

```json
{
  "result": "User is locked"
}
```

`401 Unauthorized`

```json
{
  "result": "Token is invalid"
}
```

## Behavior

- Validates app-admin access.
- Loads current global configuration set from server runtime.
- Returns full configuration payload as a JSON object.
- Removes `services` from the response before returning data.

## Limitations

- `app_id` is required for this endpoint's permission validator.
- Internal/hidden namespaces are not returned.

## Related Endpoints

- [Features - Global Config Update](i-configs.md)
- [Features - User Config Update](i-userconfigs.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | App-admin validation | Reads authenticated user and app-admin permissions. |
| `countly.apps` | App scope validation | Validates provided `app_id` during app-admin checks. |
| `countly.plugins` | Stores global feature/config namespace data | Reads `_id: "plugins"` document to build effective response payload. |

</details>
