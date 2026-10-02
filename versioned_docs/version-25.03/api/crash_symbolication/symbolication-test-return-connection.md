---
sidebar_label: "Test Return"
keywords:
  - "/o/symbolication/test_symbolication_return_connection"
  - "test_symbolication_return_connection"
  - "symbolication"
last_update:
  date: "2026-04-13"
---

# Test symbolication return connection

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/symbolication/test_symbolication_return_connection
```

## Overview

Checks whether the symbolication server can reach Countly's callback URL.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_url` | String | Yes | Symbolication server base URL. |
| `return_url` | String | Yes | Callback URL to validate reverse reachability. |
| `api_key` | String | Yes (or `auth_token`) | API key authentication. |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication. |

## Examples

### Test return connection

```text
/o/symbolication/test_symbolication_return_connection?server_url=https://symbolication.example.com&return_url=https://your-server.com/i/crash_symbols/symbolicatation_result?symbolication_test=1&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
true
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Boolean | Return-connection status. |

### Error Responses

| HTTP Status | Response |
|---|---|
| Upstream status | `{ "result": "<body.msg>" }` for return-connection test failures |
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior

- Calls the remote symbolication server return-connection check endpoint derived from `server_url`.
- Uses sub-action in URL path (not a query `action` parameter).

## Related Endpoints

- [Test Symbolication Server](symbolication-test.md)
- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Endpoints](symbolication-test-endpoints.md)
