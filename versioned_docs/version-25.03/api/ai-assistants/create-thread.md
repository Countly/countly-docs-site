---
sidebar_label: "Create Thread"
keywords:
  - "/i/ai-assistants/create-thread"
  - "create-thread"
  - "ai-assistants"
last_update:
  date: "2026-02-16"
---

# AI Assistants - Create Thread

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/ai-assistants/create-thread
```

## Overview

Creates a fresh thread for the authenticated member and app.  
If an existing thread is present for the same member/app, it is deleted first.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID for thread scope |

## Examples

### Example: Create a fresh thread

```bash
curl "https://your-server.com/i/ai-assistants/create-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

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

## Behavior

1. Validates user authentication.
2. Validates required input (`app_id`).
3. Deletes existing member/app thread (if present).
4. Creates and returns a new thread.

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Send Message](send-message.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
