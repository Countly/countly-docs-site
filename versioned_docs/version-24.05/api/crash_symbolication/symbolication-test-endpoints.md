---
sidebar_label: "Test Endpoints"
keywords:
  - "/o/symbolication/test_symbolication_endpoints"
  - "test_symbolication_endpoints"
  - "symbolication"
last_update:
  date: "2026-04-13"
---

# Test symbolication endpoints

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/symbolication/test_symbolication_endpoints
```

## Overview

Checks the symbolication server's add, check, get, and ack endpoints from Countly.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_url` | String | Yes | Symbolication server base URL. |
| `api_key` | String | Yes (or `auth_token`) | API key authentication. |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication. |

## Examples

### Test symbolication server endpoints

```text
/o/symbolication/test_symbolication_endpoints?server_url=https://symbolication.example.com&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  {
    "value": "ok"
  },
  {
    "error": "Error 404 from https://symbolication.example.com/symbolication/get_job_result?..."
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[].value` | String | `ok` for a successful endpoint check. |
| `[].error` | String | Error description for a failed endpoint check. |

### Error Responses

| HTTP Status | Response |
|---|---|
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior

- Verifies remote add/check/get/ack endpoints on the remote symbolication server.
- Uses sub-action in URL path (not a query `action` parameter).

## Related Endpoints

- [Test Symbolication Server](symbolication-test.md)
- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Return Connection](symbolication-test-return-connection.md)
