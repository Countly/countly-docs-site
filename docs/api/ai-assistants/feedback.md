---
sidebar_label: "Feedback"
keywords:
  - "/i/ai-assistants/feedback"
  - "feedback"
  - "ai-assistants"
last_update:
  date: "2026-10-01"
---

# AI Assistants - Feedback

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/ai-assistants/feedback
```

## Overview

Records a thumbs up or thumbs down on an assistant answer, with an optional category and comment.

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
| `threadId` | String | Yes | ID of the thread the answer belongs to |
| `promptId` | String | Yes | ID of the assistant message being rated, as returned by [Send Message](send-message.md) |
| `rating` | String | Yes | `thumbs_up` or `thumbs_down` |
| `category` | String | No | Feedback category |
| `comment` | String | No | Free-text comment |

## Examples

### Example: Rate an answer

```bash
curl "https://your-server.com/i/ai-assistants/feedback" \
  -d "api_key=YOUR_API_KEY" \
  -d "threadId=THREAD_ID" \
  -d "promptId=PROMPT_ID" \
  -d "rating=thumbs_down" \
  -d "comment=The answer missed the date range"
```

## Response

### Success Response

```json
{
  "ok": 1,
  "tracked": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `ok` | Number | Success flag (`1`) |
| `tracked` | Boolean | `true` when the feedback was recorded; `false` when feedback telemetry is disabled and the request was accepted without recording anything |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameters: <details>"
}
```

- **HTTP 400** - Invalid rating:
```json
{
  "result": "rating must be \"thumbs_up\" or \"thumbs_down\""
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

- **HTTP 500** - Recording failed:
```json
{
  "result": "Couldn't record feedback"
}
```

## Behavior

1. Validates user authentication.
2. Validates `threadId`, `promptId` and `rating`.
3. Loads the thread and compares its owner with the authenticated member.
4. Records the feedback as a `[CLY]_llm_interaction_feedback` event tied to the assistant turn through `promptId`, with `thread_id`, `rating` and the optional `category` and `comment`.
5. If feedback telemetry is not available (for example on localhost or without a configured domain), returns `tracked: false` and records nothing.
<!-- REVIEW: the code does not check that `promptId` belongs to the given thread. -->

## Related Endpoints

- [AI Assistants - Send Message](send-message.md)
- [AI Assistants - Load Thread](load-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Reads the thread to check ownership. |

</details>
