---
sidebar_label: "Send Message"
keywords:
  - "/i/ai-assistants/send-message"
  - "send-message"
  - "ai-assistants"
last_update:
  date: "2026-02-16"
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
- Thread access is owner-restricted.
- The member must be able to read the thread's app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `threadId` | String | Yes | Thread ID |
| `origin` | String | Yes | Request origin (for example: `drill`, `cohort`, `funnel`) |
| `message` | String | Conditional | User prompt. Required unless `resumeNavigation` is `true`. |
| `resumeNavigation` | Boolean | No | `true` resumes a navigation flow after the UI has moved to a new page; runs without a new user message |
| `effort` | String | No | `deep` requests deep analysis (when allowed by configuration); anything else runs standard effort |
| `userState` | Object | No | Optional UI state object |
| `userState.activeAppId` | String | No | App currently open in the UI; used for this turn when the member can access it, otherwise the thread's app is used |
| `userState.page` | String | No | Current page identifier |
| `userState.widget` | String | No | Current widget identifier |
| `userState.formData` | Object | No | Optional form data payload |
| `userState.userStages` | Array | No | Stages currently set in the UI (for example funnel steps) |
| `userState.drillResult` | Object | No | Current Drill result passed as context |
| `userState.exploreResult` | Object | No | Current explore result passed as context. Maximum 256 KB serialized. |
| `userState.demo` | Boolean | No | `true` for a demo turn. Requires a demo thread and a demo project in `userState.activeAppId`. |
| `userState.demoCatalog` | Object | No | Demo-mode data catalog sent by the UI (demo turns only, maximum 512 KB serialized) |
| `userState.demoWorld` | String | No | Demo data version of the UI, used to detect a mismatch with the server |

## Examples

### Example: Send message and consume SSE

```bash
curl "https://your-server.com/i/ai-assistants/send-message?api_key=YOUR_API_KEY&threadId=THREAD_ID&origin=drill&message=Show%20top%20events%20for%20last%207%20days"
```

## Response

### Success Response

SSE stream is returned on the same request connection.

Example stream (simplified):

```text
event: user
data: {"_id":"65a7c1e6f1c2a40001abc122","role":"user","content":{"message":"Show top events for last 7 days"},"createdOn":"2026-02-15T10:30:00.000Z"}

event: start
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-02-15T10:30:00.000Z"}

event: message
data: {"type":"token","content":"Sure, "}

event: message
data: {"type":"token","content":"here is what I found..."}

event: done
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-02-15T10:30:05.000Z","content":{"message":"...","actions":[]},"streaming":[{"message":"...","actions":[]}]}
```

### Response Fields

| Event | Payload fields | Description |
|---|---|---|
| `user` | `_id`, `role`, `content`, `createdOn` | Echo of the user message (not sent when `resumeNavigation` is `true`) |
| `start` | `_id`, `role`, `createdOn` | Announces assistant message metadata. `_id` is the `promptId` used by [Feedback](feedback.md). |
| `message` | `type`, `content` | Incremental token payload (`type` is `token`) |
| `provisional` | `{}` | The text streamed so far is provisional |
| `verifying` | `{}` | The answer is being verified |
| `progress` | `label` | Progress label for a running step |
| `intent` | `handoff_reasoning` | Why the request was routed to a specific agent |
| `done` | `_id`, `role`, `createdOn`, `content`, `streaming` | Final complete assistant message |
| `error` | `message` | Stream-time error details |
| `cancel` | `{}` | Stream cancellation notification |

<!-- REVIEW: the meaning of `provisional` and `verifying` is inferred from event names in lib/chat-context.ts; confirm wording. -->

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

- **HTTP 400** - `userState.exploreResult` larger than 256 KB:
```json
{
  "result": "Invalid parameters: exploreResult is too large"
}
```

- **HTTP 400** - Demo turn on a real thread, or real turn on a demo thread:
```json
{
  "result": "Invalid parameters: demo turns require a demo thread"
}
```
(or `"Invalid parameters: this thread belongs to a demo session"`). Other demo-mode validation errors also return HTTP 400 with an `Invalid parameters: ...` message.

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

- **HTTP 403** - Thread belongs to another member, or member cannot read the thread's app:
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

1. Validates user authentication and request fields (`message` unless `resumeNavigation` is `true`, size limits, demo-mode rules).
2. Requires `useGateway` to be enabled and a gateway API key provisioned from the license.
3. Loads the thread, verifies ownership, read access to the thread's app and that the demo flag matches.
4. Loads the associated app.
5. Starts thread title generation for the first message.
6. Builds the run context (accessible apps, active app, page, enabled agents, effort, `userState` payloads) and runs the message workflow, or the arrival workflow when `resumeNavigation` is `true`.
7. Streams events via SSE and finishes with `done`, `error` or `cancel`.
8. Messages are kept in the thread's Mastra memory.

## Limitations

- Requires `useGateway` enabled and an active license.
- Agents use the last 20 messages of the thread as context (Mastra `lastMessages: 20`).
- Agent availability depends on enabled toggles (`drillAgentEnabled`, `cohortAgentEnabled`, `funnelAgentEnabled`, `journeyAgentEnabled`).

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Create Thread](create-thread.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| Mastra memory store (ClickHouse, `ClickhouseStore`) | Thread storage | Threads and their messages are kept in Mastra memory, stored in ClickHouse. |
| `countly.apps` | App lookup | Reads the thread's app to check that it exists. |

</details>
