---
sidebar_label: "View Segments"
keywords:
  - "/o?method=get_view_segments"
  - "get_view_segments"
  - "views"
last_update:
  date: "2026-10-09"
---

# Views - View Segments

## Endpoint

```text
/o?method=get_view_segments
```

## Overview

Returns the segments recorded for views in an app, the segments that are omitted from view data, and the domains seen in view actions.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `views` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `get_view_segments`. |
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Example 1: Read view segments

```text
/o?method=get_view_segments&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "segments": {
    "platform": ["iOS", "Android"]
  },
  "domains": ["example.com"],
  "omit": ["utm_source"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `segments` | Object | View segments of the app. Each key is a segment name and its value is the list of segment values. Empty array when the app has none. |
| `domains` | Array | Domains seen in view actions. Empty when none are known or when Drill is not available. |
| `omit` | Array | Segments omitted from view data. Only present when some are omitted. |

## Behavior

- Domains are collected from the Drill metadata of the view action event.

## Related Endpoints

- [Views - Omit Segments](./i-views-omit-segments.md)
- [Views - Query](./o-views.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.views` | App-level view configuration | Reads the segment map and omitted segments. |
| `countly_drill.drill_meta{appId}` | Drill metadata | Reads the known domains of view actions. |

</details>
