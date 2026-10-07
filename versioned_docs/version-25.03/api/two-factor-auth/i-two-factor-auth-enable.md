---
sidebar_label: "Enable"
keywords:
  - "/i/two-factor-auth"
  - "two-factor-auth"
last_update:
  date: "2026-03-05"
---

# Two Factor Auth - Enable

## Endpoint

```plaintext
/i/two-factor-auth?method=enable
```

## Overview

Enables 2FA for the authenticated user after validating a 6-digit auth code against the provided secret token.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires authenticated user context.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `enable`. |
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `secret_token` | String | Yes | Secret used for TOTP verification. |
| `auth_code` | String | Yes | 6-digit TOTP code. Must match `^\d{6}$`. |

## Examples

### Enable 2FA

```plaintext
/i/two-factor-auth?api_key=YOUR_API_KEY&method=enable&secret_token=JBSWY3DPEHPK3PXP&auth_code=123456
```

## Response

### Success Response

```json
{
  "result": "Enabled 2FA for user"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Result message. |

### Error Responses

- `400`

```json
{
  "result": "Invalid 2FA code"
}
```

- `401`

```json
{
  "result": "Failed to authenticate"
}
```

- `500`

```json
{
  "result": "Error during verification"
}
```

## Behavior

- Validates code format first (`6` digits).
- Verifies TOTP with `otplib`.
- Stores encrypted secret and sets `two_factor_auth.enabled=true`.
- Emits system log action: `two_factor_auth_enabled`.

## Related Endpoints

- [Two Factor Auth - Disable](i-two-factor-auth-disable.md)
- [Two Factor Auth - Admin Check](i-two-factor-auth-admin-check.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | User account settings | Updates `two_factor_auth.enabled` and encrypted `two_factor_auth.secret_token`. |
| `countly.systemlogs` | Audit trail | Receives `two_factor_auth_enabled` action. |

</details>
