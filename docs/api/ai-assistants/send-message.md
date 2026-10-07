---
sidebar_label: "Send Message"
keywords:
  - "/i/ai-assistants/send-message"
  - "send-message"
  - "ai-assistants"
last_update:
  date: "2026-10-07"
---

# AI Assistants - Send Message

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/ai-assistants/send-message
```

## Overview

Sends a user message to AI Assistants and streams assistant output via Server-Sent Events (SSE).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires an authenticated Countly user.
- The thread must belong to the authenticated member.

## Request Parameters

Send the parameters as a JSON request body (`Content-Type: application/json`). `resumeNavigation` must be a JSON boolean and `userState` a JSON object, so they cannot be sent as query string values.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `threadId` | String | Yes | Thread ID |
| `origin` | String | Yes | Base URL of the Countly dashboard (for example `https://your-server.com`), used to build links in assistant answers |
| `message` | String | Conditional | User prompt. Required unless `resumeNavigation` is `true`. |
| `resumeNavigation` | Boolean | No | `true` continues a conversation after the UI has moved to the page the assistant pointed to (`navigationTarget` in an earlier answer). Runs without a new user message. |
| `userState` | Object | No | Optional UI state object |
| `userState.activeAppId` | String | No | App currently open in the UI; used for this turn instead of the thread's app |
| `userState.page` | String | No | Current page identifier |
| `userState.widget` | String | No | Current widget identifier |
| `userState.formData` | Object | No | Optional form data payload |
| `userState.userStages` | Array | No | Stages currently set in the UI (for example funnel steps) |
| `userState.drillResult` | Object | No | Current Drill result passed as context |

## Examples

### Example: Send message and consume SSE

```bash
curl -N "https://your-server.com/i/ai-assistants/send-message?api_key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"threadId":"THREAD_ID","origin":"https://your-server.com","message":"Show top events for last 7 days"}'
```

### Example: Continue after navigation

```bash
curl -N "https://your-server.com/i/ai-assistants/send-message?api_key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"threadId":"THREAD_ID","origin":"https://your-server.com","resumeNavigation":true,"userState":{"page":"cohort","widget":"form"}}'
```

## Response

### Success Response

SSE stream is returned on the same request connection.

Example stream (simplified):

```text
event: user
data: {"_id":"65a7c1e6f1c2a40001abc122","role":"user","content":{"message":"Show top events for last 7 days"},"createdOn":"2026-10-07T10:30:00.000Z"}

event: start
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-10-07T10:30:00.000Z"}

event: progress
data: {"label":"Thinking…"}

event: message
data: {"type":"token","content":"Sure, "}

event: message
data: {"type":"token","content":"here is what I found..."}

event: done
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-10-07T10:30:05.000Z","content":{"message":"...","actions":[]},"streaming":[{"message":"...","actions":[]}]}
```

### Response Fields

| Event | Payload fields | Description |
|---|---|---|
| `user` | `_id`, `role`, `content`, `createdOn` | Echo of the user message (not sent when `resumeNavigation` is `true`) |
| `start` | `_id`, `role`, `createdOn` | Announces assistant message metadata. `_id` is the `promptId` used by [Feedback](feedback.md). |
| `message` | `type`, `content` | Incremental token payload (`type` is `token`) |
| `progress` | `label` | Short status text for the current step (for example while the request is routed or the documentation is searched) |
| `provisional` | `{}` | Sent before the answer tokens when the answer comes from the Drill, Cohort, Funnel or Journey agent. The tokens that follow are a draft until `done`. |
| `verifying` | `{}` | The draft answer's parameters are being checked. If the check fails, the answer can be generated again and more `message` tokens follow. |
| `done` | `_id`, `role`, `createdOn`, `content`, `streaming` | Final complete assistant message. Use `content` as the final answer. `content.navigationTarget` (`page`, `widget`) is set when the answer asks the user to open a page first. |
| `error` | `message` | Stream-time error details |
| `cancel` | `{}` | Stream cancellation notification |

The SSE response includes any custom headers configured in the `api_additional_headers` security setting.

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

- **HTTP 400** - `message` missing (and `resumeNavigation` not `true`):
```json
{
  "result": "Invalid parameters: message is required"
}
```

- **HTTP 400** - No license, or gateway unreachable:
```json
{
  "result": "AI Assistants requires an active license. No license found, or the gateway is unreachable."
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

- **HTTP 404** - Thread not found:
```json
{
  "result": "Thread not found"
}
```

- **HTTP 404** - App not found:
```json
{
  "result": "App not found"
}
```

- **HTTP 500** - Send failed before the stream started. `result` is a provider-specific user-facing error message:
```json
{
  "result": "<error message>"
}
```

- **HTTP 503** - Gateway disabled by the administrator:
```json
{
  "result": "AI Assistants is currently disabled by the administrator (useGateway is false)."
}
```

## Behavior

1. Validates user authentication and request fields (`message` unless `resumeNavigation` is `true`).
2. Requires `useGateway` to be enabled and a gateway API key. On servers with a license, the key is provisioned from the license when needed.
3. Loads the thread and verifies that the authenticated member owns it.
4. Loads the thread's app.
5. Builds the run context (active app, page, widget, enabled agents, `userState` payloads) and runs the assistant on the message. When `resumeNavigation` is `true`, the assistant continues the conversation without a user message.
6. Streams events via SSE and finishes with `done`, `error` or `cancel`.
7. Messages are stored in the thread.

## Limitations

- Requires `useGateway` enabled and a gateway API key (provisioned from an active license).
- Agents use recent messages of the thread as context.
- Agent availability depends on enabled toggles (`drillAgentEnabled`, `cohortAgentEnabled`, `funnelAgentEnabled`, `journeyAgentEnabled`).

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Create Thread](create-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| ClickHouse thread and message store | Thread storage | Reads the thread and stores the new messages. |
| `countly.plugins` | Gateway key and license | Reads the license and the stored gateway API key; stores a newly provisioned key. |
| `countly.apps` | App lookup | Reads the thread's app to check that it exists. |

</details>
