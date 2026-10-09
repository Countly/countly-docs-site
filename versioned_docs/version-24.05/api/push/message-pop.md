---
sidebar_label: "Remove Users"
keywords:
  - "/i/push/message/pop"
  - "push"
  - "message"
last_update:
  date: "2026-10-09"
---

# /i/push/message/pop

## Overview

Removes notifications from a message with an API trigger, for the users that match a filter. It is the counterpart of [Send](./message-push.md), which adds notifications to such a message. Only works for messages with an API trigger.

## Endpoint

```plaintext
/i/push/message/pop
```

## Authentication

- **Required Permission**: Delete access to `push` feature
- **HTTP Method**: POST
- **Content-Type**: application/x-www-form-urlencoded or JSON

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes | API authentication key |
| `app_id` | String | Yes | Application ID |
| `_id` | ObjectID | Yes | Message ID (message with API trigger) |
| `filter` | Object | Yes | User filter that selects the users whose notifications are removed. Must not be empty. |
| `filter.user` | String | No | JSON with a filter on the app users collection |
| `filter.drill` | String | No | Drill plugin filter in JSON format |
| `filter.geos` | Array | No | Array of geo IDs |
| `filter.cohorts` | Array | No | Array of cohort IDs |

**Parameter Constraints**:
- **`_id`**: The message must exist in the app and have an API trigger.
- **`filter`**: Filters that contain disallowed query operators are rejected.

## Examples

### Example 1: Remove notifications for one user

**Request** (POST):
```bash
curl -X POST "https://your-server.com/i/push/message/pop" \
  -H "Content-Type: application/json" \
  -d '{
    "api_key": "YOUR_API_KEY",
    "app_id": "507f1f77bcf86cd799439012",
    "_id": "507f1f77bcf86cd799439011",
    "filter": {
      "user": "{\"uid\": {\"$eq\": \"12345\"}}"
    }
  }'
```

**Response** (200):
```json
{
  "removed": 1
}
```

## Response

### Success Response

**Status Code**: `200 OK`

```json
{
  "removed": 1
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `removed` | Number | Number of notifications removed. |

### Error Responses

**Status Code**: `400 Bad Request`

```json
{
  "errors": ["No such message or it doesn't have API trigger"]
}
```

```json
{
  "errors": ["Message is not api"]
}
```

Request validation problems (for example a missing `_id` or `filter`) are returned as `{"kind": "ValidationError", "errors": [...]}`.

## Permissions

- Required Permission: Delete access to push feature

## Related Endpoints

- [Send](./message-push.md) - Add notifications to an API-triggered message
- [Message Create](./message-create.md) - Create API-triggered message
- [Message Remove](./message-remove.md) - Remove a message

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `messages` | Push/message records | Reads the message to check its API trigger. |

</details>
