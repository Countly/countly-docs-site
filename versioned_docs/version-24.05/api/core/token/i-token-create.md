---
sidebar_label: "Token Create"
keywords:
  - "/i/token/create"
  - "create"
  - "token"
last_update:
  date: "2026-02-17"
---

# Token - Token Create

## Endpoint

```plaintext
/i/token/create
```

## Overview

Creates an auth token owned by the authenticated dashboard user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Any authenticated dashboard user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `purpose` | String | No | Optional token description. |
| `ttl` | Number | No | Token lifetime in seconds. Default: `1800`. |
| `multi` | Boolean/String | No | Reuse flag. `false` or `"false"` disables reuse. Default: `true`. |
| `apps` | String | No | Comma-separated app IDs to restrict token scope. |
| `endpoint` | String | No | Comma-separated endpoint regex patterns for token scope. |
| `endpointquery` | JSON String (Array/Object) | No | Structured endpoint restrictions. If parse fails, `endpoint` fallback is used. |

## Examples

### Example 1: Create basic token

```plaintext
/i/token/create?api_key=YOUR_API_KEY&purpose=Mobile Integration
```

### Example 2: Create endpoint-restricted token

```plaintext
/i/token/create?api_key=YOUR_API_KEY&purpose=Read Analytics&endpoint=/o/apps,/o/analytics&ttl=3600&multi=false
```

## Response

### Success Response

```json
{
  "result": "0e1c012f855e7065e779b57a616792fb5bd03834"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Generated token value. |

### Error Responses

**Status Code**: `400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

**Status Code**: `404 Not Found`

```json
{
  "result": "Token must have owner. Please provide correct user id"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Standard create | Authenticated user, token options parsed | Saves token with defaults/overrides. | Wrapped token string. |
| Endpoint query mode | `endpointquery` parsed successfully | Stores parsed endpoint restrictions. | Wrapped token string. |
| Endpoint fallback mode | `endpointquery` parse fails and `endpoint` exists | Stores comma-split `endpoint` patterns. | Wrapped token string. |

## Limitations

- Endpoint regex patterns are stored as provided; invalid regex patterns are not deeply validated during token creation.

## Related Endpoints

- [Token Delete](i-token-delete.md)
- [Token Check](o-token-check.md)
- [Token List](o-token-list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Owner validation | Validates token owner identity before save. |
| `countly.auth_tokens` | Token storage | Removes expired rows, inserts new token row. |

</details>
