---
sidebar_label: "Load Thread"
keywords:
  - "/o/ai-assistants/load-thread"
  - "load-thread"
  - "ai-assistants"
last_update:
  date: "2026-10-07"
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

Loads a thread by `threadId`, including its messages. When `threadId` is not provided, or no thread with that ID exists, a new thread is created for the authenticated member and `app_id` and returned instead.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- An existing thread can only be loaded by the member who owns it.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID stored on the thread when a new one is created |
| `threadId` | String | No | Existing thread ID to load |

## Examples

### Example 1: Get a new thread

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

### Example 2: Load an existing thread

```bash
curl "https://your-server.com/o/ai-assistants/load-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&threadId=65a7c1e6f1c2a40001abc123"
```

## Response

### Success Response

Existing thread loaded by `threadId`:

```json
{
  "thread": {
    "_id": "3f6c2a9e-8d41-4b7a-9c35-1e2f4a6b8d90",
    "memberId": "64b0a2a0f1c2a40001def456",
    "appId": "64afe321d5f9b2f77cb2c8ed",
    "messages": [
      {
        "id": "8b1d0c3e-2f4a-4c6d-9e1f-0a2b3c4d5e6f",
        "role": "user",
        "parts": [{ "type": "text", "text": "Show top events for last 7 days" }]
      }
    ]
  }
}
```

New thread (no `threadId`, or no thread with that ID exists):

```json
{
  "thread": {
    "id": "3f6c2a9e-8d41-4b7a-9c35-1e2f4a6b8d90",
    "title": "",
    "resourceId": "64b0a2a0f1c2a40001def456",
    "createdAt": "2026-10-07T10:30:00.000Z",
    "updatedAt": "2026-10-07T10:30:00.000Z",
    "metadata": {
      "appId": "64afe321d5f9b2f77cb2c8ed"
    }
  }
}
```

### Response Fields

Existing thread:

| Field | Type | Description |
|---|---|---|
| `thread` | Object | The loaded thread |
| `thread._id` | String | Thread ID |
| `thread.memberId` | String | Thread owner member ID |
| `thread.appId` | String | App ID tied to the thread |
| `thread.messages` | Array | All messages in the thread, in AI SDK UI message format (`id`, `role`, `parts`, ...) |

New thread:

| Field | Type | Description |
|---|---|---|
| `thread` | Object | The new thread |
| `thread.id` | String | Thread ID. Pass it as `threadId` to the other endpoints. |
| `thread.title` | String | Thread title (empty) |
| `thread.resourceId` | String | Thread owner member ID |
| `thread.createdAt` | String | Creation time (ISO 8601) |
| `thread.updatedAt` | String | Last update time (ISO 8601) |
| `thread.metadata.appId` | String | App ID tied to the thread |

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

- **HTTP 403** - Thread belongs to another member:
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
2. Validates parameters (`app_id` required).
3. If `threadId` is provided and the thread exists, checks that the authenticated member owns it and returns it with its messages.
4. If `threadId` is missing or no thread with that ID exists, creates a new thread for the member and `app_id` and returns it.

## Related Endpoints

- [AI Assistants - Create Thread](create-thread.md)
- [AI Assistants - Send Message](send-message.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| ClickHouse thread and message store | Thread storage | Reads the thread and its messages, or inserts a new thread. |

</details>
