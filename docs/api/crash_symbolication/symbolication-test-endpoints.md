---
sidebar_label: "Test Endpoints"
keywords:
  - "/o/symbolication/test_symbolication_endpoints"
  - "test_symbolication_endpoints"
  - "symbolication"
---

# Test symbolication endpoints

## Endpoint

```
/o/symbolication/test_symbolication_endpoints
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Checks the symbolication server's add, check, get, and ack endpoints from Countly.

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
| `api_key` | String | Yes (or `auth_token`) | API key authentication. |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication. |

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

## Behavior/Processing

- Verifies remote add/check/get/ack endpoints on the remote symbolication server.
- Uses sub-action in URL path (not a query `action` parameter).

## Examples

### Test symbolication server endpoints

```text
/o/symbolication/test_symbolication_endpoints?server_url=https://symbolication.example.com&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Test Symbolication Server](symbolication-test.md)
- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Return Connection](symbolication-test-return-connection.md)

## Last Updated

2026-04-13
