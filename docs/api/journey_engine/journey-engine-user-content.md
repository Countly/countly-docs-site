---
sidebar_label: "User Content Read"
keywords:
  - "/o/journey-engine/user-content"
  - "GET /o/journey-engine/user-content"
  - "user-content"
  - "journey-engine"
last_update:
  date: "2026-10-23"
---

# Journey Engine - User Content

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/user-content
```

## Overview

Return the content cooldown state of a user and the content waiting in the user's queue.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required): App ID
- `uid` (required): User ID

## Examples

```
GET /o/journey-engine/user-content?app_id=6991c75b024cb89cdc04efd2&uid=1
```

## Response

### Success Response

```json
{
  "cooldown_hours": 24,
  "cooldown_total_ms": 86400000,
  "cooldown_remaining_ms": 3600000,
  "last_view_ts": 1700000000000,
  "queue": [
    {
      "content_id": "67164f4a1f1bd90d6354430c",
      "name": "Welcome message",
      "type": "content",
      "source": "content",
      "priority": 1,
      "category": null,
      "created_ts": 1700000000000,
      "expiry_ts": 1700086400000,
      "journey_id": "67164f4a1f1bd90d6354430a"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `cooldown_hours` | Number | Cooldown in hours: the app's setting, otherwise the global setting, otherwise `24`. |
| `cooldown_total_ms` | Number | Cooldown in milliseconds. |
| `cooldown_remaining_ms` | Number | Milliseconds until the user can see content again. `0` when the cooldown is over or set to `0`. |
| `last_view_ts` | Number | Timestamp of the last content view of the user. `0` when there is none. |
| `queue` | Array | Queued content that has not expired, highest priority first. |
| `queue[].content_id` | String | Content ID. |
| `queue[].name` | String | Content name. Empty when not found. |
| `queue[].type` | String | Content type. |
| `queue[].source` | String | `content` or `survey`. Empty when not found. |
| `queue[].priority` | Number | Queue priority. |
| `queue[].category` | String or Null | Content category. |
| `queue[].created_ts` | Number | Timestamp when the item was queued. |
| `queue[].expiry_ts` | Number | Timestamp when the item expires. |
| `queue[].journey_id` | String or Null | Journey that queued the item. |

### Error Responses

- **HTTP 400**
```json
{
  "result": "app_id and uid are required"
}
```
- **HTTP 500**
```json
{
  "result": "Error: <message>"
}
```

## Behavior

- Queue items are ordered by priority, then by newest first.

## Related Endpoints

- [Settings](journey-engine-settings.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App cooldown setting | Reads the app's `journey_engine` setting. |
| `countly.app_users{appId}` | Last content view | Reads the user's last view time. |
| `countly.content_queue` | Queue | Reads the user's queued content. |
| `countly.content_blocks` | Content names | Reads content block details. |
| `countly.feedback_widgets` | Survey names | Reads survey widgets. |

</details>
