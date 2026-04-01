---
sidebar_label: "Read"
keywords:
  - "/o/flows"
  - "flows"
---

# Get flow events catalog

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/flows?method=events
```

## Overview

Returns internal and custom event lists used in flow setup.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `flows` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `events`. |
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `flows.*` | Flows feature defaults | Flows analytics query behavior and result shaping. | Changes to flows settings can affect returned paths, aggregation behavior, and limits. |

## Response

### Success Response

```json
{
  "internal": ["[CLY]_session", "[CLY]_view", "[CLY]_view_update"],
  "custom": ["signup", "purchase"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `internal` | Array | Internal drill events list. |
| `custom` | Array | App custom event keys excluding internal events. |

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior/Processing

- Loads app event list from `countly.events`.
- Builds `internal` from `plugins.internalDrillEvents` and appends `[CLY]_view_update`.
- Removes internal events from custom event list before returning.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Event catalog and schema | Stores app event list/map/segment schema read or updated by this endpoint. |

---

## Examples

```text
/o/flows?
  method=events&
  app_id=64f5c0d8f4f7ac0012ab3456
```

---

## Related Endpoints

- [Flows - Views](views.md)
- [Flows - Crashes](crashes.md)

---

## Last Updated

2026-02-16
