---
sidebar_label: "Counts"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-04-18"
---

# User Profiles - Counts

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=user_counts
```

## Overview

Returns total user count and unidentified user count.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- User Profiles: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `method` | String | Yes | Must be `user_counts` |

## Examples

```text
/o?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&method=user_counts
```

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

## Behavior

- Requires `Read` permission on the User Profiles feature.
- Reads from `app_users{app_id}`.
- `total` is returned from MongoDB `estimatedDocumentCount()`, so it is intended as a fast estimate of total user documents.
- `unidentified` is returned from `count({"hasInfo": {"$ne": true}})`, so it counts users where `hasInfo` is missing or not exactly `true`.
- The endpoint does not apply query, segment, cohort, or date filters.
- The handler returns only `{unidentified, total}`.

## Related Endpoints

- [User Profiles - List or Profile](list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

</details>
