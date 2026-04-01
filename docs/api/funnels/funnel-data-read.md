---
sidebar_label: "Read Data"
keywords:
  - "/o"
  - "o"
---

# Read funnel overview data

## Endpoint

```text
/o?method=funneldata
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns stored daily funnel summary records for one or more funnel IDs.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `funneldata`. |
| `app_id` | String | Yes | Target app ID. |
| `funnels` | JSON String (Array) | Yes | Funnel ID list. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |
| `funnels.*` | Funnels feature defaults | Funnels query calculation and result shaping behavior. | Changes to funnels settings can affect conversion calculations and output structure. |

## Response

### Success Response

```json
{
  "67f1c22912df5acb8f8d5caaf0f89a31": [
    {
      "_id": "2026-02-14",
      "total_users": 1000,
      "success_users": 290,
      "success_rate": 29,
      "users_in_first_step": 820
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Funnel-ID keyed map of daily summary rows. |
| `<funnel_id>[]` | Array | Daily summary objects for that funnel. |
| `<funnel_id>[]._id` | String | Day key from stored record (`d`). |
| `<funnel_id>[].success_rate` | Number | Daily success percentage. |

### Error Responses

This endpoint does not expose a dedicated custom error message for malformed `funnels` JSON; invalid payloads fall back to an empty list result.

## Behavior/Processing

- Parses `funnels` JSON array.
- Reads matching records from `funneldata` by funnel IDs and app ID.
- Groups rows by `funnel_id` in response.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funneldata` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o?
  method=funneldata&
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnels=["67f1c22912df5acb8f8d5caaf0f89a31","67f1c22912df5acb8f8d5caaf0f89a32"]
```

---

## Related Endpoints

- [Funnels - Analyze](funnel-query-read.md)
- [Funnels - List](read.md)

---

## Last Updated

2026-02-16
