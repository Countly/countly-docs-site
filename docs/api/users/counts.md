---
sidebar_label: "Counts"
keywords:
  - "/o"
  - "o"
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

- Requires `Read` permission on the User Profiles feature.
- Reads from `app_users{app_id}`.
- `total` is returned from MongoDB `estimatedDocumentCount()`, so it is intended as a fast estimate of total user documents.
- `unidentified` is returned from `count({"hasInfo": {"$ne": true}})`, so it counts users where `hasInfo` is missing or not exactly `true`.
- The endpoint does not apply query, segment, cohort, or date filters.
- The handler returns only `{unidentified, total}`.

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

2026-04-18
