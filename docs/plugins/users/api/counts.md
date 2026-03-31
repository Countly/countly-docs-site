---
sidebar_label: "Counts"
---

# User Profiles - Counts

## Endpoint

```text
/o?method=user_counts
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns total user count and unidentified user count.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- User Profiles: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `method` | String | Yes | Must be `user_counts` |

## Response

### Success Response

```json
{
  "unidentified": 3,
  "total": 245
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `unidentified` | Number | Users without profile info (`hasInfo != true`) |
| `total` | Number | Total estimated users in app users collection |

### Error Responses

- **HTTP 401** - Invalid auth:
```json
{
  "result": "User does not exist"
}
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

---

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_counts
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
