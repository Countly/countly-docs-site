---
sidebar_label: "Lookup"
keywords:
  - "/o"
  - "o"
---

# Lookup IP Address

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```
/o?method=lookup
```

## Overview

Looks up location data for an IP address using geoip-lite.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `geo` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application context for permission validation |
| `ip_address` | String | No | IP address to lookup; when omitted, request IP is used |

## Response

### Success Response

```json
{
  "location": {
    "country": "US",
    "region": "CA",
    "city": "San Francisco",
    "ll": [37.7749, -122.4194]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `location` | Object or `null` | GeoIP lookup result for the provided/request IP |
| `location.country` | String | Country code (when available) |
| `location.region` | String | Region code (when available) |
| `location.city` | String | City name (when available) |
| `location.ll` | Array | `[latitude, longitude]` coordinates |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | Validation/auth error from  (for example missing required params) |

## Behavior/Processing

1. Resolves IP from `ip_address` or falls back to request IP.
2. Performs lookup with `geoip-lite`.
3. Returns result as `{ "location": ... }`.

---

## Database Collections

This endpoint does not read or write database collections.

---

## Examples

### Example 1: Lookup a Specific IP

```text
https://your-server.com/o?method=lookup&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984&ip_address=8.8.8.8
```

### Example 2: Lookup Request IP

```text
https://your-server.com/o?method=lookup&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984
```

## Related Endpoints

- [Geo - List Geo Locations](list.md)

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
