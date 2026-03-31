---
sidebar_label: "Test"
---

# Test symbolication server

## Endpoint

```
/o/symbolication/test_symbolication_connection
/o/symbolication/test_symbolication_key
/o/symbolication/test_symbolication_return_connection
/o/symbolication/test_symbolication_endpoints
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Checks connectivity and integration between Countly and the configured symbolication server.

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
| `server_url` | String | Yes | Symbolication server base URL |
| `symb_key` | String | Required for `test_symbolication_key` | Symbolication server API key |
| `return_url` | String | Required for `test_symbolication_return_connection` | Callback URL to validate reverse reachability |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Response

### Success Response

Connection / key / return tests return boolean:

```json
true
```

Endpoint test returns a reflected results array:

```json
[
  {
    "value": "ok"
  },
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
| `(root value)` | Boolean | Connection/key/return connection status |
| `[].value` | String | `ok` for endpoint checks |
| `[].error` | String | Error description for a failed endpoint check |

### Error Responses

| HTTP Status | Response |
|---|---|
| Upstream status | `{ "result": "<body.msg>" }` for return-connection test failures |
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior/Processing

- Uses sub-action in URL path (not a query `action` parameter).
- `test_symbolication_endpoints` verifies add/check/get/ack endpoints on the remote server.

---

## Database Collections

This endpoint does not read or write database collections.

---

## Examples

### Example 1: Test server ping

```text
/o/symbolication/test_symbolication_connection?server_url=https://symbolication.example.com&api_key=YOUR_API_KEY
```

### Example 2: Test symbolication API key

```text
/o/symbolication/test_symbolication_key?server_url=https://symbolication.example.com&symb_key=SYMB_KEY_VALUE&api_key=YOUR_API_KEY
```

### Example 3: Test return connection

```text
/o/symbolication/test_symbolication_return_connection?server_url=https://symbolication.example.com&return_url=https://your-server.com/i/crash_symbols/symbolicatation_result?symbolication_test=1&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Run Symbolication](crash-symbolicate.md)
- [Symbolication Result Callback](crash-symbolicate-result.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
