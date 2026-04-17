---
sidebar_label: "Test"
keywords:
  - "/o/symbolication/test_symbolication_connection"
  - "test_symbolication_connection"
  - "symbolication"
---

# Test symbolication server

## Endpoint

```
/o/symbolication/test_symbolication_connection
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Checks whether Countly can reach the configured symbolication server.

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
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

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

## Behavior/Processing

- Uses sub-action in URL path (not a query `action` parameter).
- Related symbolication test endpoints are documented separately.

---

## Database Collections

This endpoint does not read or write database collections.

---

## Examples

### Example 1: Test server ping

```text
/o/symbolication/test_symbolication_connection?server_url=https://symbolication.example.com&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Test Symbolication API Key](symbolication-test-key.md)
- [Test Symbolication Return Connection](symbolication-test-return-connection.md)
- [Test Symbolication Endpoints](symbolication-test-endpoints.md)
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
