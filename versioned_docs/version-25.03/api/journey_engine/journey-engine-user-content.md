---
sidebar_label: "User Content"
keywords:
  - "/o/journey-engine/user-content"
  - "user-content"
  - "journey-engine"
  - "cooldown"
last_update:
  date: "2026-10-16"
---

# Journey Engine - User Content

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/journey-engine/user-content
```

## Overview

Returns the content cooldown state of one app user and the content items currently queued for that user. Queued items are content blocks or surveys that journeys have scheduled and that have not yet expired.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `journey_engine` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |
| `uid` | String | Yes | App user ID (`uid`). |

## Examples

### Read the content state of a user

```text
/o/journey-engine/user-content?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&uid=12
```

## Response

### Success Response

```json
{
  "cooldown_hours": 24,
  "cooldown_total_ms": 86400000,
  "cooldown_remaining_ms": 3600000,
  "last_view_ts": 1760000000000,
  "queue": [
    {
      "content_id": "65f0cbf8bca6b8e8fbf7f901",
      "name": "Welcome offer",
      "type": "content",
      "source": "content",
      "priority": 5,
      "category": null,
      "created_ts": 1760000000000,
      "expiry_ts": 1760600000000,
      "journey_id": "65f0cbf8bca6b8e8fbf7f902"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `cooldown_hours` | Number | Cooldown that applies to this app, in hours. The app's own setting is used when it has one, otherwise the server-wide setting, otherwise `24`. |
| `cooldown_total_ms` | Number | The cooldown in milliseconds. |
| `cooldown_remaining_ms` | Number | Milliseconds until the user can be shown content again. `0` when the cooldown has passed or is `0`. |
| `last_view_ts` | Number | Timestamp (ms) when the user was last shown content. `0` if never. |
| `queue` | Array | Unexpired queued items for the user, highest priority first, then newest first. Empty when nothing is queued. |
| `queue[].content_id` | String | ID of the queued content block or survey. |
| `queue[].name` | String | Content title or survey name. Empty string if it can no longer be found. |
| `queue[].type` | String | Content or survey type. Falls back to `category`, then an empty string. |
| `queue[].source` | String | `content` for content blocks, `survey` for surveys, empty if not found. |
| `queue[].priority` | Number | Queue priority. |
| `queue[].category` | String | Category of the item, or `null`. |
| `queue[].created_ts` | Number | When the item was queued (ms). |
| `queue[].expiry_ts` | Number | When the item expires (ms). |
| `queue[].journey_id` | String | Journey that queued the item, or `null`. |

### Error Responses

- `400`

```json
{
  "result": "app_id and uid are required"
}
```

- `500`

```json
{
  "result": "Error: <message>"
}
```

## Behavior

- Read-only. Nothing is modified.
- Items whose expiry time has passed are not returned.

## Related Endpoints

- [Journey Engine - Settings](journey-engine-settings.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.apps` | App cooldown setting | Reads the app's `journey_engine` cooldown. |
| `countly.app_users{appId}` | Last content view | Reads the user's last view time. |
| `countly.content_queue` | Queued items | Reads unexpired items for the user. |
| `countly.content_blocks` | Content names | Reads titles and types of queued content blocks. |
| `countly.feedback_widgets` | Survey names | Reads names and types of queued surveys. |

</details>
