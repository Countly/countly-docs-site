---
sidebar_label: "Internal Events Read"
keywords:
  - "/o/data-manager/events/internal"
  - "events"
  - "internal"
  - "data-manager"
last_update:
  date: "2026-10-15"
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

Returns the Drill metadata of the internal events that Data Manager can manage. At present this is the view event (`[CLY]_view`).

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
/o/data-manager/events/internal?
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY
```

## Response

### Success Response

An array with one Drill metadata document for each internal event that has metadata in the app:

```json
[
  {
    "e": "[CLY]_view",
    "app_id": "64f5c0d8f4f7ac0012ab3456"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | Drill metadata documents of the internal events. Empty if the app has none. |
| `e` | String | Event key. |
| `app_id` | String | App ID. |

### Error Responses

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Only the `[CLY]_view` event is returned.

## Related Endpoints

- [Events Extended - Read](events-extended-read.md)
- [Event Segments - Read](event-segments-read.md)
