---
sidebar_label: "Update Properties"
---

# User Profiles - Update Properties (SDK)

## Endpoint

```text
/i?app_key=YOUR_APP_KEY&device_id=docs_users_device&user_details={"name":"Docs User","custom":{"tier":"pro"}}
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates user properties through SDK ingestion (`/i`) using `user_details` payload.

## Authentication

**Authentication method**:
- App Key (parameter): `app_key=YOUR_APP_KEY`

SDK ingestion route:
- `/sdk/user_properties` (no dashboard auth method; this is SDK ingestion path)

## Permissions

- No dashboard feature permission check in this path; access is controlled by valid `app_key` and SDK ingestion rules.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | App key |
| `device_id` | String | Yes | Device identifier |
| `user_details` | String (JSON Object) | Yes | User properties update payload |

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
| `result` | String | SDK ingestion result |

### Error Responses

- **HTTP 400** - Invalid request (example):
```json
{
  "result": "Missing parameter \"app_key\""
}
```

## Behavior/Processing

- Parses `user_details` JSON.
- Applies update operators (`$set`, `$unset`, `$inc`, `$push`, `$pull`, `$addToSet`, etc.) where supported.
- Enforces limits from User Profiles feature config (`custom_set_limit`, `custom_prop_limit`).
- Persists updates via app users update dispatch.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

---

## Examples

```text
/i?app_key=YOUR_APP_KEY&device_id=docs_users_device&user_details={"name":"Jane Doe","email":"jane@example.com"}
```

```text
/i?app_key=YOUR_APP_KEY&device_id=docs_users_device&user_details={"custom":{"tier":"enterprise","plan":["pro","plus"]}}
```

## Related Endpoints

- [User Profiles - List or Profile](list.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
