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

Starts a fresh thread for the authenticated member and app. Existing threads are kept. If the member already has an empty thread for the app, that thread is reused instead of creating another one.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- The member must be able to read the app in `app_id` (otherwise HTTP 403).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID for thread scope |
| `excludeThreadId` | String | No | Thread the client is leaving; it is never reused as the "fresh" thread |
| `demo` | String | No | `true` to create a demo thread (used by the demo chat). Demo conversations are deleted after 14 days without activity. |

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
| `thread` | Object | The new or reused empty thread |
| `thread._id` | String | Thread ID |
| `thread.memberId` | String | Thread owner member ID |
| `thread.appId` | String | App ID tied to the thread |
| `thread.demo` | Boolean | Whether this is a demo thread |
| `thread.messages` | Array | Thread messages (empty) |
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

- **HTTP 403** - Member cannot read the app:
```json
{
  "result": "Not authorized"
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
2. Validates required input (`app_id`) and checks that the member can read the app.
3. Looks for an existing empty thread of the same kind (demo/real) for the member and app, skipping `excludeThreadId` and threads touched in the last minute.
4. Returns that thread, or creates and returns a new one, with `capabilities`.

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Send Message](send-message.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Threads and their messages are kept in Mastra memory, stored in ClickHouse. |

</details>
