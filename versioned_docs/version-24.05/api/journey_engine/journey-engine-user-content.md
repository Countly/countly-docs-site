---
sidebar_label: "User Content"
keywords:
  - "/o/journey-engine/user-content"
  - "GET /o/journey-engine/user-content"
  - "user-content"
  - "journey-engine"
last_update:
  date: "2026-10-17"
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

Read the content cooldown of one user and the content that is queued for them.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required): Application ID
- `uid` (required): ID of the app user

## Examples

### Read the content state of a user
```
GET /o/journey-engine/user-content?app_id=64afe321d5f9b2f77cb2c8ed&uid=1
```

## Response

### Success Response

```json
{
  "cooldown_hours": 24,
  "cooldown_total_ms": 86400000,
  "cooldown_remaining_ms": 3600000,
  "last_view_ts": 1727101524294,
  "queue": [
    {
      "content_id": "67164f4a1f1bd90d6354430c",
      "name": "Welcome",
      "type": "content",
      "source": "content",
      "priority": 1,
      "category": null,
      "created_ts": 1727101524294,
      "expiry_ts": 1727187924294,
      "journey_id": "67164f4a1f1bd90d6354430a"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `cooldown_hours` | Number | Cooldown in hours that applies to the app: the app's own setting if it has one, otherwise the server-wide setting, otherwise `24`. |
| `cooldown_total_ms` | Number | The same cooldown in milliseconds. |
| `cooldown_remaining_ms` | Number | Milliseconds left until the user can be shown content again. `0` when the cooldown is over or is set to `0`. |
| `last_view_ts` | Number | Timestamp of the last content shown to the user. `0` when none was shown. |
| `queue` | Array | Content queued for the user that has not expired, highest priority first, then newest first. |
| `queue[].content_id` | String | ID of the queued content. |
| `queue[].name` | String | Name of the content. Empty when it cannot be found. |
| `queue[].type` | String | Type of the content; the queue category when the content cannot be found. |
| `queue[].source` | String | `content` or `survey`. Empty when the content cannot be found. |
| `queue[].priority` | Number | Priority of the queued item. |
| `queue[].category` | String or Null | Category of the queued item. |
| `queue[].created_ts` | Number | Time the item was queued. |
| `queue[].expiry_ts` | Number | Time the item expires. |
| `queue[].journey_id` | String or Null | ID of the journey that queued the item. |

### Error Responses

- **400**: `app_id` or `uid` is missing.

```json
{
  "result": "app_id and uid are required"
}
```

- **500**: Failed to read the data. The message starts with `Error:`.

## Related Endpoints

- [Settings](journey-engine-settings.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App settings | Reads the app's own cooldown. |
| `countly.app_users{appId}` | App users | Reads the time content was last shown to the user. |
| `countly.content_queue` | Queued content | Reads the queued items of the user. |
| `countly.content_blocks` | Content | Reads the name and type of queued content. |
| `countly.feedback_widgets` | Surveys | Reads the name and type of queued surveys. |

</details>
