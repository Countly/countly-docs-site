---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-15"
---

# AI Assistants

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Feature Metadata

| Field | Value |
|---|---|
| Feature | AI Assistants |
| Type | In-product AI conversation and guidance |
| Public endpoint count | 7 |
| Last updated | 2026-02-15 |

## Overview

AI Assistants provides conversational help inside Countly features.  
It supports thread management, streaming assistant responses, and message feedback.

Conversations are scoped per app and member. Threads and their messages are kept in Mastra memory, stored in ClickHouse.

Thread endpoints accept `demo=true` for the demo chat. Demo threads are kept apart from real ones and are deleted after 14 days without activity (fixed, not a setting).

## Quick Links

| Endpoint | Path |
|---|---|
| [AI Assistants - Load Thread](load-thread.md) | `/o/ai-assistants/load-thread` |
| [AI Assistants - List Threads](list-threads.md) | `/o/ai-assistants/list-threads` |
| [AI Assistants - Create Thread](create-thread.md) | `/i/ai-assistants/create-thread` |
| [AI Assistants - Rename Thread](rename-thread.md) | `/i/ai-assistants/rename-thread` |
| [AI Assistants - Delete Thread](delete-thread.md) | `/i/ai-assistants/delete-thread` |
| [AI Assistants - Feedback](feedback.md) | `/i/ai-assistants/feedback` |
| [AI Assistants - Send Message](send-message.md) | `/i/ai-assistants/send-message` |

## Returned Data Fields

### Thread Endpoints (`load-thread`, `create-thread`)

| Field | Type | Description |
|---|---|---|
| `thread` | Object | Thread object (`_id`, `memberId`, `appId`, `demo`, `messages`) |
| `capabilities` | Object | Server capabilities (`demo: true` when demo mode is supported) |

### List Endpoint (`list-threads`)

| Field | Type | Description |
|---|---|---|
| `threads` | Array | Member's threads with messages for the app (`id`, `title`, `pending`, `updatedAt`), newest first, up to 30 |

### Feedback Endpoint (`feedback`)

| Field | Type | Description |
|---|---|---|
| `ok` | Number | Success flag (`1`) |
| `tracked` | Boolean | Whether the feedback was recorded |

### Streaming Endpoint (`send-message`)

| Event/Payload | Description |
|---|---|
| `event: user` | Echo of the user message |
| `event: start` | Stream started with assistant message metadata (`_id`, `role`, `createdOn`) |
| `event: message` (`data: {"type":"token","content":"..."}`) | Incremental generated text |
| `event: provisional`, `event: verifying`, `event: progress` (`label`), `event: intent` (`handoff_reasoning`) | Status updates during the run |
| `event: done` | Final complete assistant message payload |
| `event: error` | Stream-time error payload |
| `event: cancel` | Cancellation notification |

## Configuration & Settings

### AI Assistants feature config (`ai-assistants`)

- `useGateway`: Route requests through the Countly AI gateway (default `true`; when `false`, `send-message` returns HTTP 503)
- `gatewayUrl`: Gateway URL
- `gatewayApiKey`: Gateway API key (provisioned from the license)
- `model`: Model ID (default `google/gemini-3.1-flash-lite`)
- `drillAgentEnabled`: Enable Drill agent
- `cohortAgentEnabled`: Enable Cohort agent
- `funnelAgentEnabled`: Enable Funnel agent
- `journeyAgentEnabled`: Enable Journey agent

### Security config (`security`)

- Optional proxy settings:
  - `proxy_hostname`, `proxy_port`, `proxy_username`, `proxy_password`
- Optional outbound custom headers:
  - `api_additional_headers`

## Workflows

### 1. Start or Resume a Conversation

1. Call `load-thread` with `app_id` to load/create a member thread.
2. If needed, call `create-thread` to start a fresh thread, or `list-threads` to show earlier conversations.
3. Use `send-message` for assistant responses over SSE.

### 2. Stream a Response

1. Send prompt using `send-message`.
2. Read token chunks in SSE stream.
3. Consume `done` event with final assistant message object.

### 3. Collect Feedback

1. Capture the assistant message ID (`promptId`) from the stream.
2. Call `feedback` with `threadId`, `promptId` and a `thumbs_up` or `thumbs_down` rating.
3. Use feedback for quality monitoring workflows.

## Limitations

- `send-message` requires `useGateway` enabled and an active license.
- Agents use the last 20 messages of a thread as context.
- `list-threads` returns up to 30 threads.
- Agent availability depends on enabled feature toggles.

## Related Features

- [Drill - API Documentation](../drill/index.md)
- [Cohorts - API Documentation](../cohorts/index.md)
- [Funnels - API Documentation](../funnels/index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| Mastra memory store (ClickHouse) | Stores threads and message history |
| `countly.apps` | Read to check that the thread's app exists |
| `countly_drill.drill_meta` | Metadata source used by assistant agents/tools |

</details>
