---
sidebar_label: "List Threads"
keywords:
  - "/o/ai-assistants/list-threads"
  - "list-threads"
  - "ai-assistants"
last_update:
  date: "2026-10-07"
---

# AI Assistants - List Threads

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/ai-assistants/list-threads
```

## Overview

Lists the authenticated member's conversations for an app, newest first. Threads that have never received a message are not listed.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- The member must be able to read the app in `app_id`.
- Only the member's own threads are returned.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID whose threads are listed |
| `demo` | String | No | `true` to list demo threads instead of real ones. Demo conversations are deleted after 14 days without activity. |

## Examples

### Example: List threads for an app

```bash
curl "https://your-server.com/o/ai-assistants/list-threads?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Response

### Success Response

```json
{
  "threads": [
    {
      "id": "65a7c1e6f1c2a40001abc123",
      "title": "Retention questions",
      "pending": false,
      "updatedAt": "2026-02-15T10:30:00.000Z"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `threads` | Array | Up to 30 threads, most recently updated first |
| `threads[].id` | String | Thread ID |
| `threads[].title` | String | Thread title, or a preview of the first message while no title exists. Empty while a title is being generated. |
| `threads[].pending` | Boolean | `true` while an automatic title is being generated |
| `threads[].updatedAt` | String or null | Last update time (ISO 8601) |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameters: <details>"
}
```

- **HTTP 403** - Member cannot read the app:
```json
{
  "result": "Not authorized"
}
```

- **HTTP 500** - Listing failed:
```json
{
  "result": "Threads couldn't be listed"
}
```

## Behavior

1. Validates user authentication.
2. Validates parameters (`app_id` required) and checks that the member can read the app.
3. Lists the member's threads for the app of the requested kind (demo or real), newest first, up to 30.
4. Skips threads with no title and no first-message preview (threads that never received a message).

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Rename Thread](rename-thread.md)
- [AI Assistants - Delete Thread](delete-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Reads the member's threads for the app. |

</details>
