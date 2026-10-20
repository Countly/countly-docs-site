---
sidebar_label: "Internal Events Read"
keywords:
  - "/o/data-manager/events/internal"
  - "internal events"
  - "data-manager"
last_update:
  date: "2026-10-17"
---

# Read internal events

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/events/internal
```

## Overview

Returns the stored drill metadata of the internal events that Data Manager exposes. In this release only the view event (`[CLY]_view`) is returned.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read internal events

```text
/o/data-manager/events/internal?app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
[
  {
    "app_id": "64f5c0d8f4f7ac0012ab3456",
    "e": "[CLY]_view"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | One drill metadata document per internal event. Empty when the app has none. |
| `app_id` | String | App ID. |
| `e` | String | Event key. |

The remaining fields of each document are the drill metadata stored for the event.

### Error Responses

- **HTTP 500**:
```json
{
  "result": "Error"
}
```

## Behavior

- Reads the drill metadata of the app and keeps only events whose key is `[CLY]_view`.

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Event Segments - Read](event-segments-read.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Event metadata | Reads the metadata documents of the allowed internal events for the app. |

</details>
