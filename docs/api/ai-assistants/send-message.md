---
sidebar_label: "Send Message"
keywords:
  - "/i/ai-assistants/send-message"
  - "send-message"
  - "ai-assistants"
---

# AI Assistants - Send Message

## Endpoint

```text
/i/ai-assistants/send-message
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Sends a user message to AI Assistants and streams assistant output via Server-Sent Events (SSE).

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires an authenticated Countly user.
- Thread access is owner-restricted.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `threadId` | String | Yes | Thread ID |
| `origin` | String | Yes | Request origin (for example: `drill`, `cohort`, `funnel`) |
| `message` | String | Yes | User prompt |
| `userState` | Object | No | Optional UI state object |
| `userState.page` | String | No | Current page identifier |
| `userState.widget` | String | No | Current widget identifier |
| `userState.formData` | Object | No | Optional form data payload |

## Response

### Success Response

SSE stream is returned on the same request connection.

Example stream (simplified):

```text
event: start
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-02-15T10:30:00.000Z"}

data: {"type":"token","content":"Sure, "}
data: {"type":"token","content":"here is what I found..."}

event: done
data: {"_id":"65a7c1e6f1c2a40001abc123","role":"assistant","createdOn":"2026-02-15T10:30:00.000Z","rating":null,"content":{"message":"...","actions":[],"params":{}},"streaming":[{"message":"...","actions":[],"params":{}}]}
```

### Response Fields

| Event | Payload fields | Description |
|---|---|---|
| `start` | `_id`, `role`, `createdOn` | Announces assistant message metadata |
| default token message (no explicit `event`) | `type`, `content` | Incremental token payload (`type` is `token`) |
| `done` | Assistant message object | Final complete assistant message payload |
| `error` | `message` | Stream-time error details |
| `cancel` | `{}` | Stream cancellation notification |

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

- **HTTP 400** - Provider config missing:
```json
{
  "result": "Please set the API key, the provider base url and the enabled agents in the plugin configuration"
}
```

- **HTTP 401** - User/auth validation failed:
```json
{
  "result": "User does not exist"
}
```

- **HTTP 403** - Not authorized for thread:
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

- **HTTP 500** - Send failed (pre-stream):
```json
{
  "result": "Message couldn't be sent"
}
```

## Behavior/Processing

1. Validates user authentication and required request fields.
2. Requires provider configuration (`apiKey`, `apiProviderBaseURL`).
3. Loads thread and verifies ownership.
4. Loads associated app.
5. Builds assistant run context from thread history and request payload.
6. Streams response tokens via SSE.
7. On completion, saves both user and assistant messages to thread.
8. Records interaction telemetry and tool usage events.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: Send message and consume SSE

```bash
curl "https://your-server.com/i/ai-assistants/send-message?api_key=YOUR_API_KEY&threadId=THREAD_ID&origin=drill&message=Show%20top%20events%20for%20last%207%20days"
```

## Limitations

- Requires configured provider settings (`apiKey`, `apiProviderBaseURL`).
- Thread context load is limited to the last 20 messages.
- Stored thread history is capped at 500 messages.
- Agent availability depends on enabled toggles.

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Create Thread](create-thread.md)
- [AI Assistants - Rate Message](rate-message.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

## Last Updated

2026-02-15
---

## Last Updated

2026-02-16
