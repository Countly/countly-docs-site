---
sidebar_label: "Check Login"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
last_update:
  date: "2026-02-16"
---

# Check JIRA login

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crashes-jira?method=check_login
```

## Overview

Verifies stored JIRA OAuth credentials by requesting JIRA server info.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires global admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `check_login` |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Validate JIRA login state

```text
/i/crashes-jira?method=check_login&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": "Successfully fetched server info"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Login validation status |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `{ "result": "Missing access token, please log in to JIRA" }` |
| 500 | `{ "result": "Failed to find JIRA access token" }` |
| 500 | `{ "result": "Failed to fetch server info" }` |

## Behavior

1. Loads JIRA access token from `countly.crashes_jira` meta document.
2. Sends authenticated request to `/rest/api/3/serverInfo`.
3. Returns success/failure message.

## Related Endpoints

- [JIRA for Crashes - Login](login.md)
- [JIRA for Crashes - Callback](callback.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
