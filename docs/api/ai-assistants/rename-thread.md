---
sidebar_label: "Rename Thread"
keywords:
  - "/i/ai-assistants/rename-thread"
  - "rename-thread"
  - "ai-assistants"
last_update:
  date: "2026-10-01"
---

# AI Assistants - Rename Thread

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/ai-assistants/rename-thread
```

## Overview

Sets the title of one of the authenticated member's own threads.

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
| `threadId` | String | Yes | ID of the thread to rename |
| `title` | String | Yes | New title. Maximum length 80 characters. Surrounding whitespace is trimmed and runs of whitespace are collapsed. |

## Examples

### Example: Rename a thread

```bash
curl "https://your-server.com/i/ai-assistants/rename-thread" \
  -d "api_key=YOUR_API_KEY" \
  -d "threadId=THREAD_ID" \
  -d "title=Retention questions"
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
| `result` | String | `ok` when the thread was renamed |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameters: <details>"
}
```

- **HTTP 400** - Title is empty after normalization:
```json
{
  "result": "Invalid parameters: title is empty"
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

- **HTTP 500** - Rename failed:
```json
{
  "result": "Thread couldn't be renamed"
}
```

## Behavior

1. Validates user authentication.
2. Validates `threadId` and `title` (`title` max length 80).
3. Normalizes the title: trims it, collapses whitespace and cuts it to 80 characters.
4. Loads the thread and compares its owner with the authenticated member.
5. Saves the new title. Automatic title generation only fills empty titles, so it does not overwrite a title set here.
<!-- REVIEW: it is unclear whether a title longer than 80 characters is rejected by the `max-length` validation (400) or cut to 80 characters by normalization. -->

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Delete Thread](delete-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
