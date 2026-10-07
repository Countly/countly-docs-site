---
sidebar_label: "Create"
keywords:
  - "/i/journey-engine/event"
  - "event"
  - "journey-engine"
last_update:
  date: "2026-02-16"
---

# Create Custom Event

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/event
```

## Overview

Creates a custom event for journey flows and registers it in both event metadata and Drill metadata.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Behavior

1. Parses `event` from query string.
2. Validates and normalizes event key.
3. Writes event metadata into `events` collection.
4. Writes Drill metadata into `drill_meta` collection.
5. Logs creation in system logs.

## Related Endpoints

- [Journey Engine - Stats Summary](journey-engine-stats-summary.md)
- [Journey Engine - Stats Performance](journey-engine-stats-performance.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Endpoint data source | ** - Updates event map/list/segment metadata for the app |
| `countly_drill.drill_meta` | Endpoint data source | ** - Creates Drill event metadata |

</details>
