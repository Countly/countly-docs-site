---
sidebar_label: "Load Thread"
---

# AI Assistants - Load Thread

## Endpoint

```text
/o/ai-assistants/load-thread
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Loads a thread by `threadId` (when provided) or finds/creates a thread for the authenticated member and app.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires an authenticated Countly user.
- Access to a specific thread is owner-restricted.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID used for find/create flow |
| `threadId` | String | No | Existing thread ID to load directly |

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
| `_id` | String | Thread ID |
| `appId` | String | App ID tied to thread |
| `memberId` | String | Thread owner member ID |
| `createdOn` | String | Thread creation timestamp |
| `messages` | Array | Last 20 messages in the thread |

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

- **HTTP 403** - Not authorized for thread:
```json
{
  "result": "Not authorized"
}
```

- **HTTP 404** - Thread not found:
```json
{
  "result": "Thread not found"
}
```

- **HTTP 500** - Load failed:
```json
{
  "result": "Thread couldn't be loaded"
}
```

## Behavior/Processing

1. Validates user authentication.
2. Validates required parameters (`app_id` required).
3. If `threadId` is provided, loads that thread and checks ownership.
4. If `threadId` is not provided, finds or creates member/app thread.
5. Returns thread projection with the last 20 messages.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Find or create thread for app/member

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

### Example 2: Load an existing thread

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&threadId=65a7c1e6f1c2a40001abc123"
```

## Related Endpoints

- [AI Assistants - Create Thread](create-thread.md)
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
