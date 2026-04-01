---
sidebar_label: "Rate Message"
keywords:
  - "/i/ai-assistants/rate-message"
  - "rate-message"
  - "ai-assistants"
---

# AI Assistants - Rate Message

## Endpoint

```text
/i/ai-assistants/rate-message
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Rates one assistant message in a thread and records feedback telemetry.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires an authenticated Countly user.
- Thread rating is owner-restricted.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID (required by validation) |
| `threadId` | String | Yes | Thread ID |
| `messageId` | String | Yes | Message ID in thread |
| `rating` | String | Yes | Rating value (typically `thumbs_up` or `thumbs_down`) |

## Response

### Success Response

```json
{
  "ok": 1
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `ok` | Number | Request processed successfully |

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

- **HTTP 500** - Rating failed:
```json
{
  "result": "Couldn't rate the message"
}
```

## Behavior/Processing

1. Validates user authentication and required parameters.
2. Loads thread and verifies ownership.
3. Validates associated app exists.
4. Writes message rating to thread.
5. Emits feedback tracking event.
6. Returns `{ "ok": 1 }`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.ai_assistants_threads` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: Rate a message

```bash
curl "https://your-server.com/i/ai-assistants/rate-message?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&threadId=THREAD_ID&messageId=MESSAGE_ID&rating=thumbs_up"
```

## Related Endpoints

- [AI Assistants - Load Thread](load-thread.md)
- [AI Assistants - Send Message](send-message.md)

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
