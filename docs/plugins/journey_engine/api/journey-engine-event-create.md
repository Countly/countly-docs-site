---
sidebar_label: "Create"
---

# Create Custom Event

## Endpoint

```
/i/journey-engine/event
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a custom event for journey flows and registers it in both event metadata and Drill metadata.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application identifier |
| `event` | Object (JSON string) | Yes | Stringified custom event definition |

### `event` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Event key (normalized by `common.fixEventKey`) |
| `name` | String | Yes | Event display name |
| `description` | String | No | Event description |
| `segments` | Array | Yes | Segment definitions used for event metadata |
| `segments[].name` | String | Yes | Segment key |

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| (root value) | String | Operation status |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `{ "result": "Error" }` |

## Behavior/Processing

1. Parses `event` from query string.
2. Validates and normalizes event key.
3. Writes event metadata into `events` collection.
4. Writes Drill metadata into `drill_meta` collection.
5. Logs creation in system logs.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Endpoint data source | ** - Updates event map/list/segment metadata for the app |
| `countly_drill.drill_meta` | Endpoint data source | ** - Creates Drill event metadata |

---

## Examples

Endpoint form:

```text
https://your-server.com/i/journey-engine/event?api_key=YOUR_API_KEY&app_id=64afe321d5f9b2f77cb2c8ed&event={"key":"purchase","name":"Purchase","description":"Order completed","segments":[{"name":"amount","type":"number"}]}
```

Decoded `event` object:

```json
{
  "key": "purchase",
  "name": "Purchase",
  "description": "Order completed",
  "segments": [
    {
      "name": "amount",
      "type": "number"
    }
  ]
}
```

---

## Related Endpoints

- [Journey Engine - Stats Summary](journey-engine-stats-summary.md)
- [Journey Engine - Stats Performance](journey-engine-stats-performance.md)

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
