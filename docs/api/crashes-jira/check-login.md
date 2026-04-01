---
sidebar_label: "Check Login"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
---

# Check JIRA login

## Endpoint

```
/i/crashes-jira?method=check_login
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Verifies stored JIRA OAuth credentials by requesting JIRA server info.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Requires global admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `check_login` |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

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

## Behavior/Processing

1. Loads JIRA access token from `countly.crashes_jira` meta document.
2. Sends authenticated request to `/rest/api/3/serverInfo`.
3. Returns success/failure message.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Validate JIRA login state

```text
/i/crashes-jira?method=check_login&api_key=YOUR_API_KEY
```

## Related Endpoints

- [JIRA for Crashes - Login](login.md)
- [JIRA for Crashes - Callback](callback.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
