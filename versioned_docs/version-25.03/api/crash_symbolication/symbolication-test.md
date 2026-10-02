---
sidebar_label: "Test"
keywords:
  - "/o/symbolication/test_symbolication_connection"
  - "test_symbolication_connection"
  - "symbolication"
last_update:
  date: "2026-02-16"
---

# Test symbolication server

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/symbolication/test_symbolication_connection
```

## Overview

Checks whether Countly can reach the configured symbolication server.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_url` | String | Yes | Symbolication server base URL |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Test server ping

```text
/o/symbolication/test_symbolication_connection?server_url=https://symbolication.example.com&api_key=YOUR_API_KEY
```

## Response

### Success Response

Connection tests return boolean:

```json
true
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Boolean | Connection status. |

### Error Responses

| HTTP Status | Response |
|---|---|
| Upstream status | `{ "result": "<body.msg>" }` for return-connection test failures |
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior

- Uses sub-action in URL path (not a query `action` parameter).
- Related symbolication test endpoints are documented separately.

## Related Endpoints

- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Return Connection](symbolication-test-return-connection.md)
- [Test Symbolication Endpoints](symbolication-test-endpoints.md)
- [Run Symbolication](crash-symbolicate.md)
- [Symbolication Result Callback](crash-symbolicate-result.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
