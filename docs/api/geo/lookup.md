---
sidebar_label: "Lookup"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# Lookup IP Address

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=lookup
```

## Overview

Looks up location data for an IP address using geoip-lite.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `geo` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application context for permission validation |
| `ip_address` | String | No | IP address to lookup; when omitted, request IP is used |

## Examples

### Example 1: Lookup a Specific IP

```text
https://your-server.com/o?method=lookup&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984&ip_address=8.8.8.8
```

### Example 2: Lookup Request IP

```text
https://your-server.com/o?method=lookup&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984
```

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

## Behavior

1. Resolves IP from `ip_address` or falls back to request IP.
2. Performs lookup with `geoip-lite`.
3. Returns result as `{ "location": ... }`.

## Related Endpoints

- [Geo - List Geo Locations](list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
