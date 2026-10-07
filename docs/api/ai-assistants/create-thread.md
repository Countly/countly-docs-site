---
sidebar_label: "Create Thread"
keywords:
  - "/i/ai-assistants/create-thread"
  - "create-thread"
  - "ai-assistants"
last_update:
  date: "2026-10-07"
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

Creates a new, empty thread for the authenticated member and app. Existing threads are kept.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID stored on the new thread |

## Examples

### Example: Create a fresh thread

```bash
curl "https://your-server.com/i/ai-assistants/create-thread?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Response

### Success Response

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

- **HTTP 500** - Creation failed:
```json
{
  "result": "Thread couldn't be created"
}
```

## Behavior

1. Validates user authentication.
2. Validates required input (`app_id`).
3. Creates a new thread owned by the authenticated member, with `app_id` stored on the thread, and returns it.

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Send Message](send-message.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| ClickHouse thread store | Thread storage | Inserts the new thread. |

</details>
