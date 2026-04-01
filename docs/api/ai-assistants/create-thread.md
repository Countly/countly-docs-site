---
sidebar_label: "Create Thread"
keywords:
  - "/i/ai-assistants/create-thread"
  - "create-thread"
  - "ai-assistants"
---

# AI Assistants - Create Thread

## Endpoint

```text
/i/ai-assistants/create-thread
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a fresh thread for the authenticated member and app.  
If an existing thread is present for the same member/app, it is deleted first.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires an authenticated Countly user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID for thread scope |

## Response

### Success Response

```json
{
  "_id": "65a7c1e6f1c2a40001abc123",
  "appId": "64afe321d5f9b2f77cb2c8ed",
  "memberId": "64b0a2a0f1c2a40001def456",
  "createdOn": "2026-02-15T10:30:00.000Z",
  "messages": []
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | New thread ID |
| `appId` | String | App ID tied to thread |
| `memberId` | String | Thread owner member ID |
| `createdOn` | String | Thread creation timestamp |
| `messages` | Array | Thread messages (empty on creation) |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameters: <details>"
}
```

- **HTTP 400** - Missing auth parameters:
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- **HTTP 401** - User/auth validation failed:
```json
{
  "result": "User does not exist"
}
```

- **HTTP 500** - Creation failed:
```json
{
  "result": "Thread couldn't be created"
}
```

## Behavior/Processing

1. Validates user authentication.
2. Validates required input (`app_id`).
3. Deletes existing member/app thread (if present).
4. Creates and returns a new thread.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example: Create a fresh thread

```bash
curl "https://your-server.com/i/ai-assistants/create-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Send Message](send-message.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

## Last Updated

2026-02-15
---

## Last Updated

2026-02-16
