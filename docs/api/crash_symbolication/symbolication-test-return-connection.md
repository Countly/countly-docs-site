---
sidebar_label: "Test Return"
keywords:
  - "/o/symbolication/test_symbolication_return_connection"
  - "test_symbolication_return_connection"
  - "symbolication"
---

# Test symbolication return connection

## Endpoint

```
/o/symbolication/test_symbolication_return_connection
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Checks whether the symbolication server can reach Countly's callback URL.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_url` | String | Yes | Symbolication server base URL. |
| `return_url` | String | Yes | Callback URL to validate reverse reachability. |
| `api_key` | String | Yes (or `auth_token`) | API key authentication. |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication. |

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

## Behavior/Processing

- Calls the remote symbolication server return-connection check endpoint derived from `server_url`.
- Uses sub-action in URL path (not a query `action` parameter).

## Examples

### Test return connection

```text
/o/symbolication/test_symbolication_return_connection?server_url=https://symbolication.example.com&return_url=https://your-server.com/i/crash_symbols/symbolicatation_result?symbolication_test=1&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Test Symbolication Server](symbolication-test.md)
- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Endpoints](symbolication-test-endpoints.md)

## Last Updated

2026-04-13
