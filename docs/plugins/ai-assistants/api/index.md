---
sidebar_position: 1
sidebar_label: "Overview"
---

# AI Assistants

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Feature Metadata

| Field | Value |
|---|---|
| Feature | AI Assistants |
| Type | In-product AI conversation and guidance |
| Public endpoint count | 4 |
| Last updated | 2026-02-15 |

## Overview

AI Assistants provides conversational help inside Countly features.  
It supports thread management, streaming assistant responses, and message feedback.

Conversations are scoped per app and member, with thread history persisted in MongoDB.

## Quick Links

| Endpoint | Path |
|---|---|
| [AI Assistants - Load Thread](load-thread.md) | `/o/ai-assistants/load-thread` |
| [AI Assistants - Create Thread](create-thread.md) | `/i/ai-assistants/create-thread` |
| [AI Assistants - Rate Message](rate-message.md) | `/i/ai-assistants/rate-message` |
| [AI Assistants - Send Message](send-message.md) | `/i/ai-assistants/send-message` |

## Returned Data Fields

### Thread Endpoints (`load-thread`, `create-thread`)

| Field | Type | Description |
|---|---|---|
| `_id` | String | Thread ID |
| `appId` | String | App ID associated with the thread |
| `memberId` | String | Owner member ID |
| `createdOn` | String | Thread creation time |
| `messages` | Array | Most recent messages (last 20 on load) |

### Rate Endpoint (`rate-message`)

| Field | Type | Description |
|---|---|---|
| `ok` | Number | Success flag (`1`) |

### Streaming Endpoint (`send-message`)

| Event/Payload | Description |
|---|---|
| `event: start` | Stream started with assistant message metadata (`_id`, `role`, `createdOn`) |
| token chunks (`data: {"type":"token","content":"..."}`) | Incremental generated text |
| `event: done` | Final complete assistant message payload |
| `event: error` | Stream-time error payload |
| `event: cancel` | Cancellation notification |

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.ai_assistants_threads` | Stores thread metadata and message history |
| `countly.apps` | Validates app existence for thread-bound operations |
| `countly_drill.drill_meta` | Metadata source used by assistant agents/tools |

## Configuration & Settings

### AI Assistants feature config (`ai-assistants`)

- `apiKey`: Provider API key
- `apiProviderBaseURL`: Provider base URL
- `drillAgentEnabled`: Enable Drill agent
- `cohortAgentEnabled`: Enable Cohort agent
- `funnelAgentEnabled`: Enable Funnel agent

### Security config (`security`)

- Optional proxy settings:
  - `proxy_hostname`, `proxy_port`, `proxy_username`, `proxy_password`
- Optional outbound custom headers:
  - `api_additional_headers`

## Workflows

### 1. Start or Resume a Conversation

1. Call `load-thread` with `app_id` to load/create a member thread.
2. If needed, call `create-thread` to reset to a fresh thread.
3. Use `send-message` for assistant responses over SSE.

### 2. Stream a Response

1. Send prompt using `send-message`.
2. Read token chunks in SSE stream.
3. Consume `done` event with final assistant message object.

### 3. Collect Feedback

1. Capture assistant `messageId` from thread/stream.
2. Call `rate-message` with rating value.
3. Use feedback for quality monitoring workflows.

## Limitations

- `send-message` requires configured `apiKey` and `apiProviderBaseURL`.
- Thread load returns last 20 messages.
- Thread storage is capped at 500 messages.
- Agent availability depends on enabled feature toggles.

## Related Features

- [Drill - API Documentation](../../drill/api/index.md)
- [Cohorts - API Documentation](../../cohorts/api/index.md)
- [Funnels - API Documentation](../../funnels/api/index.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

**Last Updated**: 2026-02-15
