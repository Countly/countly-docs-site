---
sidebar_label: "Load Thread"
keywords:
  - "/o/ai-assistants/load-thread"
  - "load-thread"
  - "ai-assistants"
last_update:
  date: "2026-02-16"
---

# AI Assistants - Load Thread

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/ai-assistants/load-thread
```

## Overview

Loads a thread by `threadId` (when provided). Otherwise, or when the given thread no longer exists, it resumes the member's most recent conversation for the app, or returns a new (or reusable empty) thread.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- The member must be able to read the app in `app_id` (otherwise HTTP 403).
- Access to a specific thread is owner-restricted.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID used for find/create flow |
| `threadId` | String | No | Existing thread ID to load directly |
| `demo` | String | No | `true` to work with demo threads (used by the demo chat). Demo and real threads are kept apart; demo conversations are deleted after 14 days without activity. |

## Examples

### Example 1: Find or create thread for app/member

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

### Example 2: Load an existing thread

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&threadId=65a7c1e6f1c2a40001abc123"
```

## Response

### Success Response

```json
{
  "thread": {
    "_id": "65a7c1e6f1c2a40001abc123",
    "memberId": "64b0a2a0f1c2a40001def456",
    "appId": "64afe321d5f9b2f77cb2c8ed",
    "demo": false,
    "messages": []
  },
  "capabilities": {
    "demo": true
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `thread` | Object | The loaded thread |
| `thread._id` | String | Thread ID |
| `thread.memberId` | String | Thread owner member ID |
| `thread.appId` | String | App ID tied to the thread |
| `thread.demo` | Boolean | Whether this is a demo thread |
| `thread.messages` | Array | All messages in the thread, in AI SDK UI message format |
| `capabilities` | Object | Server capabilities. `capabilities.demo` is `true` when the server supports demo mode. |

<!-- REVIEW: when a brand-new thread is created, `thread` is the raw Mastra thread object (fields such as `id`, `resourceId`, `metadata`, `createdAt`) rather than the `_id`/`memberId`/`appId`/`demo`/`messages` shape returned for existing threads. Confirm whether to document both shapes. -->

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

- **HTTP 403** - Member cannot read the app, or thread belongs to another member:
```json
{
  "result": "Not authorized"
}
```

- **HTTP 500** - Load failed:
```json
{
  "result": "Thread couldn't be loaded"
}
```

## Behavior

1. Validates user authentication.
2. Validates parameters (`app_id` required) and checks that the member can read the app.
3. If `threadId` is provided and the thread exists (and its demo flag matches `demo`), checks ownership and returns it.
4. If `threadId` is missing, unknown or of the other kind (demo/real), returns the member's most recent thread with messages for the app; if none exists, reuses an empty thread or creates a new one.
5. Adds `capabilities` to the response.

## Related Endpoints

- [AI Assistants - Create Thread](create-thread.md)
- [AI Assistants - Send Message](send-message.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Threads and their messages are kept in Mastra memory, stored in ClickHouse. |

</details>
