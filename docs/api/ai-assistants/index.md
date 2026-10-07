---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-07"
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
| Public endpoint count | 4 |
| Last updated | 2026-10-07 |

## Overview

AI Assistants provides conversational help inside Countly features.  
It supports conversation threads, streaming assistant responses, and answer feedback.

Each thread belongs to the member who created it and is tied to an app. Threads and their messages are stored in the server's ClickHouse database.

## Quick Links

| Endpoint | Path |
|---|---|
| [AI Assistants - Load Thread](load-thread.md) | `/o/ai-assistants/load-thread` |
| [AI Assistants - Create Thread](create-thread.md) | `/i/ai-assistants/create-thread` |
| [AI Assistants - Feedback](feedback.md) | `/i/ai-assistants/feedback` |
| [AI Assistants - Send Message](send-message.md) | `/i/ai-assistants/send-message` |

## Returned Data Fields

### Thread Endpoints (`load-thread`, `create-thread`)

Both endpoints return a `thread` object. Its shape depends on whether the thread was just created or already existed.

| Field | Type | Description |
|---|---|---|
| `thread` (new thread) | Object | `id`, `title`, `resourceId` (member ID), `createdAt`, `updatedAt`, `metadata.appId` |
| `thread` (existing thread) | Object | `_id`, `memberId`, `appId`, `messages` |

### Feedback Endpoint (`feedback`)

| Field | Type | Description |
|---|---|---|
| `ok` | Number | Success flag (`1`) |
| `tracked` | Boolean | `true` when the feedback was forwarded to Countly; `false` when it was not forwarded |

### Streaming Endpoint (`send-message`)

| Event/Payload | Description |
|---|---|
| `event: user` | Echo of the user message |
| `event: start` | Stream started with assistant message metadata (`_id`, `role`, `createdOn`) |
| `event: message` (`data: {"type":"token","content":"..."}`) | Incremental generated text |
| `event: provisional`, `event: verifying`, `event: progress` (`label`) | Status updates during the run |
| `event: done` | Final complete assistant message payload |
| `event: error` | Stream-time error payload |
| `event: cancel` | Cancellation notification |

## Configuration & Settings

### AI Assistants feature config (`ai-assistants`)

- `useGateway`: Route requests through the Countly AI gateway (default `true`; when `false`, `send-message` returns HTTP 503)
- `gatewayUrl`: Gateway URL. Leave empty to use the default Countly AI gateway. The `AI_GATEWAY_URL` environment variable, when set, takes precedence.
- `gatewayApiKey`: Gateway API key. On servers with a license, the key is provisioned from the license automatically when a message is sent.
- `model`: Model ID (default `google/gemini-3.1-flash-lite`)
- `drillAgentEnabled`: Enable Drill agent (also enables Drill insights)
- `cohortAgentEnabled`: Enable Cohort agent
- `funnelAgentEnabled`: Enable Funnel agent
- `journeyAgentEnabled`: Enable Journey agent

### Security config (`security`)

- `api_additional_headers`: Custom headers (one `Name: Value` pair per line) added to the `send-message` SSE response headers. Lines without a colon or with an invalid header name are skipped.

## Workflows

### 1. Start or Resume a Conversation

1. Call `load-thread` with `app_id` (and a stored `threadId`, if you have one) to load the thread or get a new one.
2. Call `create-thread` to start a fresh thread.
3. Use `send-message` for assistant responses over SSE.

### 2. Stream a Response

1. Send the prompt using `send-message`.
2. Read token chunks in the SSE stream.
3. Consume the `done` event with the final assistant message object.

### 3. Send Feedback

1. Take the assistant message `_id` from the stream's `start` or `done` event. This is the `promptId`.
2. Call `feedback` with `threadId`, `promptId` and a `thumbs_up` or `thumbs_down` rating.

Feedback is not stored on your Countly server. It is forwarded to Countly to help improve the product, including the optional comment text. If the server has no public domain configured, feedback is not forwarded and the response contains `tracked: false`.

## Limitations

- `send-message` requires `useGateway` enabled and a gateway API key (provisioned from an active license).
- Thread storage requires ClickHouse connection settings (`clickhouse.url`, `clickhouse.username`, `clickhouse.password`) in `api/config.js`.
- Agents use recent messages of the thread as context.
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
| ClickHouse thread and message store | Stores threads and message history |
| `countly.apps` | Read to check that the thread's app exists |
| `countly.plugins` | Stores the provisioned gateway API key; the license is read from it |
| `countly_drill.drill_meta` | Metadata source used by assistant agents/tools |

</details>
