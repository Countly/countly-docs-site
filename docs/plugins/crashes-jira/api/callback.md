---
sidebar_label: "Callback"
---

# OAuth callback

## Endpoint

```
/i/crashes-jira?method=callback
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Completes OAuth flow by exchanging request token and verifier for an access token.

## Authentication

- No dashboard authentication is validated in this callback handler.
- Route is expected to be invoked by JIRA OAuth callback.

## Permissions

- No feature permission check is applied.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `callback` |
| `oauth_verifier` | String | Yes | OAuth verifier returned by JIRA |
| `pretty_callback` | String | No | If present, redirects to `/crashes-jira/login_callback` page |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

## Response

### Success Response

Standard callback success:

```json
{
  "result": "Success"
}
```

Pretty callback success:

```json
{
  "result": "Redirect to /crashes-jira/login_callback"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Callback result summary (actual response may be redirect) |

### Error Responses

| HTTP Status | Response |
|---|---|
| 302 | Redirect to `/i/crashes-jira/login` when stored request token is older than 10 minutes |
| 500 | `{ "result": "Failed to generate oauth object: ..." }` |
| 500 | `{ "result": "Failed to find oauth token: ..." }` |
| 500 | `{ "result": "Failed to retrieve access token: ..." }` |

## Behavior/Processing

1. Loads temporary OAuth token from `countly.crashes_jira` (`_id: "meta"`).
2. Checks token age (10-minute timeout).
3. Exchanges verifier for access token and stores `oauth.access_token`.
4. Returns success response or UI redirect when `pretty_callback` is used.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: OAuth callback from JIRA

```text
/i/crashes-jira?method=callback&oauth_verifier=OAUTH_VERIFIER_VALUE
```

### Example 2: OAuth callback with UI redirect

```text
/i/crashes-jira?method=callback&oauth_verifier=OAUTH_VERIFIER_VALUE&pretty_callback=yes
```

## Related Endpoints

- [JIRA for Crashes - Login](login.md)
- [JIRA for Crashes - Check Login](check-login.md)

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
