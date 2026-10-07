---
sidebar_label: "Delete Thread"
keywords:
  - "/i/ai-assistants/delete-thread"
  - "delete-thread"
  - "ai-assistants"
last_update:
  date: "2026-10-01"
---

# AI Assistants - Delete Thread

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/ai-assistants/delete-thread
```

## Overview

Deletes one of the authenticated member's own threads, including its messages.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- The thread must belong to the authenticated member.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `threadId` | String | Yes | ID of the thread to delete |

## Examples

### Example: Delete a thread

```bash
curl "https://your-server.com/i/ai-assistants/delete-thread?api_key=YOUR_API_KEY&threadId=THREAD_ID"
```

## Response

### Success Response

```json
{
  "result": "ok"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `ok` when the thread was deleted |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameters: <details>"
}
```

- **HTTP 403** - Thread belongs to another member:
```json
{
  "result": "Not authorized"
}
```

- **HTTP 404** - Thread does not exist:
```json
{
  "result": "Thread not found"
}
```

- **HTTP 500** - Deletion failed:
```json
{
  "result": "Thread couldn't be deleted"
}
```

## Behavior

1. Validates user authentication.
2. Validates `threadId`.
3. Loads the thread and compares its owner with the authenticated member.
4. Deletes the thread when the member owns it.

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Create Thread](create-thread.md)
- [AI Assistants - Rename Thread](rename-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Threads and their messages are kept in Mastra memory, stored in ClickHouse. |

</details>
