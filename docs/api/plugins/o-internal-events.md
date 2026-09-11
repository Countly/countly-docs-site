---
sidebar_label: "Internal Events Read"
keywords:
  - "/o/internal-events"
  - "internal-events"
last_update:
  date: "2026-02-17"
---

# /o/internal-events

## Endpoint

```plaintext
/o/internal-events
```

## Overview

Returns the deduplicated list of internal Countly event keys available in the running server context.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: `core` `Read`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Conditionally required | Required for non-global users under read-permission validation. |

## Examples

### Read internal event keys

```plaintext
/o/internal-events?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID
```

## Response

### Success Response

```json
[
  "[CLY]_session_begin",
  "[CLY]_session",
  "[CLY]_llm_interaction"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | Raw array of internal event names. |
| `[]` | String | Internal event key prefixed with `[CLY]_`. |

### Error Responses

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
  "result": "No app_id provided"
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
  "result": "App does not exist"
}
```

`401 Unauthorized`

```json
{
  "result": "Token is invalid"
}
```

## Behavior

- Reads internal events from core and drill internal event registries.
- Merges both sets and removes duplicates.
- Returns the resulting array as raw output.

## Limitations

- Returned list depends on currently loaded features and runtime registration.
- Order of event keys is implementation-dependent.

## Related Endpoints

- [Features - Feature List](o-plugins.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Read-permission validation | Reads authenticated user and feature access rights. |
| `countly.apps` | App validation for non-global-admin users | Reads app context for `app_id` validation. |

</details>
