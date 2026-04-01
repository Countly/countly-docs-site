---
sidebar_label: "API Key Read"
keywords:
  - "/api-key"
  - "api-key"
---

# /api-key

## Endpoint

```plaintext
/api-key
```

## Overview

Returns the dashboard member's API key using HTTP Basic authentication.

## Authentication

- HTTP Basic Auth header with dashboard `username:password`

## Permissions

- Any existing dashboard user account can access this endpoint.
- Locked users are rejected.
- Brute-force protection is applied before password verification.

## Request Parameters

This endpoint does not use query parameters. Provide credentials through the `Authorization: Basic ...` header.

## Response

### Success Response

```text
0123456789abcdef0123456789abcdef
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(raw body)` | String | The member's API key. |

### Error Responses

**Status Code**: `401 Unauthorized`

```text
-1
```

Returned when credentials are missing, invalid, blocked by brute-force protection, or the user is locked.

**Status Code**: `500 Internal Server Error`

```text
Server Error
```

Returned if brute-force status lookup fails.

## Behavior/Processing

- Parses HTTP Basic credentials from the request.
- Checks login brute-force state before password verification.
- Verifies the password hash for the provided username.
- Updates `last_login` for the member on success.
- Returns the raw API key string, not JSON.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Credential validation and API key source | Reads member credentials and returns `api_key`; updates `last_login` on success. |
| `countly.failed_logins` | Brute-force protection state | Reads and resets failed-login state through the brute-force utility flow. |

---

## Examples

### Example 1: Read API key with cURL

```bash
curl -u "admin@example.com:YOUR_PASSWORD" \
  https://your-server.com/api-key
```

### Example 2: Read API key with explicit header

```bash
curl \
  -H "Authorization: Basic BASE64(username:password)" \
  https://your-server.com/api-key
```

## Limitations

- This endpoint only supports HTTP Basic authentication.
- Response body is plain text, not JSON.
- Locked users cannot retrieve their API key through this route.

## Related Endpoints

- [Current User Read](../users/o-users-me.md)
- [Users List](../users/o-users-all.md)

## Last Updated

2026-04-01
