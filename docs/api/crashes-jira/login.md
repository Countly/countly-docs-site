---
sidebar_label: "Login"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
last_update:
  date: "2026-02-16"
---

# Login to JIRA

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crashes-jira?method=login
```

## Overview

Starts OAuth 1.0a authorization with JIRA and redirects to JIRA authorization page.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires global admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `login` |
| `pretty_callback` | String | No | Use `yes` to make callback redirect to `/crashes-jira/login_callback` UI page |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Start OAuth login flow

```text
/i/crashes-jira?method=login&pretty_callback=yes&api_key=YOUR_API_KEY
```

## Response

### Success Response

On success, endpoint responds with redirect (`302`) to JIRA authorize URL:

```json
{
  "result": "Redirect to JIRA authorization"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Conceptual success message for docs; actual response is HTTP redirect |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `{ "result": "Failed to generate oauth object: ..." }` |
| 500 | `{ "result": "Failed to retrieve oauth token: ..." }` |
| 500 | `{ "result": "Failed to store oauth token: ..." }` |

## Behavior

1. Reads global `crashes-jira` config (`api_url`, `api_consumer_key`, `client_private_key`, `callback_url`).
2. Creates temporary OAuth request token and stores it in `countly.crashes_jira` (`_id: "meta"`).
3. Redirects to JIRA OAuth authorization endpoint.

## Related Endpoints

- [JIRA for Crashes - Callback](callback.md)
- [JIRA for Crashes - Check Login](check-login.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
