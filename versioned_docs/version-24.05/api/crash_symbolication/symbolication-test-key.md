---
sidebar_label: "Test Key"
keywords:
  - "/o/symbolication/test_symbolication_key"
  - "test_symbolication_key"
  - "symbolication"
last_update:
  date: "2026-04-13"
---

# Test symbolication API key

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/symbolication/test_symbolication_key
```

## Overview

Checks whether a symbolication server accepts a provided symbolication API key.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_url` | String | Yes | Symbolication server base URL. |
| `symb_key` | String | Yes | Symbolication server API key to test. |
| `api_key` | String | Yes (or `auth_token`) | API key authentication. |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication. |

## Examples

### Test symbolication API key

```text
/o/symbolication/test_symbolication_key?server_url=https://symbolication.example.com&symb_key=SYMB_KEY_VALUE&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
true
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Boolean | Key validation status. |

### Error Responses

| HTTP Status | Response |
|---|---|
| Upstream status | `{ "result": "<body.msg>" }` for upstream validation failures |
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior

- Calls the remote symbolication server key-check endpoint derived from `server_url`.
- Uses sub-action in URL path (not a query `action` parameter).

## Related Endpoints

- [Test Symbolication Server](symbolication-test.md)
- [Test Symbolication Return Connection](symbolication-test-return-connection.md)
- [Test Symbolication Endpoints](symbolication-test-endpoints.md)
