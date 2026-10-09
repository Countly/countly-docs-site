---
sidebar_label: "View Segments Read"
keywords:
  - "/o?method=get_view_segments"
  - "get_view_segments"
  - "views"
last_update:
  date: "2026-10-09"
---

# Views - View Segments Read

## Endpoint

```text
/o?method=get_view_segments
```

## Overview

Returns the segment keys recorded for views of an app, the omitted segments, and the domains seen in view actions.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `views` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `get_view_segments`. |
| `app_id` | String | Yes | Application ID. |
| `skip_domains` | Boolean/String | No | When set, `domains` is not looked up and is returned empty. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read view segments

```text
/o?method=get_view_segments&
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "segments": {
    "platform": ["iOS", "Android"]
  },
  "domains": ["example.com"],
  "omit": ["platform"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `segments` | Object | Map of segment key to the list of values recorded for it. Empty when the app has no segments. |
| `domains` | Array | Domains found in view actions. |
| `omit` | Array | Omitted segments. Present only when segments have been omitted for the app. |

## Behavior

- Returns empty `segments` and `domains` when the app has no stored view data.

## Related Endpoints

- [Views - Query](o-views.md)
- [Views - Omit Segments](i-views-omit-segments.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.views` | Segments and omitted segments | Reads the app's views configuration document. |
| `countly_drill` metadata | Domains | Reads domain values of view actions. |

</details>
