---
sidebar_label: "Stats Content Read"
keywords:
  - "/o/journey-engine/stats/content"
  - "GET /o/journey-engine/stats/content"
  - "content"
  - "journey-engine"
  - "stats"
last_update:
  date: "2026-10-23"
---

# Journey Engine - Stats Content

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/stats/content
```

## Overview

Return interaction stats for each in-app content block used in a journey: how many times it was shown, how many times users interacted with it, and the clicks per button.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required for non-global-admin users): App ID
- `journeyDefinitionId` (required): Journey definition ID, a 24-character hexadecimal string
- `journeyVersionId` (optional): Filter by journey version
- `period` (optional): Time period (e.g., "7days", "30days"). Use "0days" or omit for all-time

## Examples

```
GET /o/journey-engine/stats/content?app_id=6991c75b024cb89cdc04efd2&journeyDefinitionId=67164f4a1f1bd90d6354430a&period=30days
```

## Response

### Success Response

```json
{
  "content": [
    {
      "contentId": "67164f4a1f1bd90d6354430c",
      "contentName": "Welcome message",
      "shown": 900,
      "interacted": 320,
      "buttons": [
        { "id": "Get started", "clicks": 250 },
        { "id": "Later", "clicks": 70 }
      ]
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `content` | Array | One entry per content block, most shown first. |
| `content[].contentId` | String | Content block ID. |
| `content[].contentName` | String | Content block title. Empty when not found. |
| `content[].shown` | Number | Number of times the content was shown. |
| `content[].interacted` | Number | Number of interactions. |
| `content[].buttons` | Array | Clicks per button, sorted by button identifier. |
| `content[].buttons[].id` | String | Button label, or its identifier when it has no label. |
| `content[].buttons[].clicks` | Number | Number of clicks. |

### Error Responses

- **HTTP 400**
```json
{
  "result": "Error: Missing journeyDefinitionId"
}
```
- **HTTP 400**
```json
{
  "result": "Error: Invalid journeyDefinitionId"
}
```
- **HTTP 403**
```json
{
  "result": "Error: Journey does not belong to this app"
}
```
- **HTTP 500**
```json
{
  "result": "Error: Failed to retrieve content stats"
}
```

## Behavior

- The journey must belong to the given app.
- Daily stats are added up into one entry per content block.

## Related Endpoints

- [Summary Metrics](journey-engine-stats-summary.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Ownership check | Reads the journey to confirm it belongs to the app. |
| `countly.journey_content_stats` | Endpoint data source | Reads daily content stats. |
| `countly.content_blocks` | Content titles | Reads content block titles. |

</details>
