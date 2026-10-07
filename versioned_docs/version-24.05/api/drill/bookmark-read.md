---
sidebar_label: "Bookmark - Read"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-04-17"
---

# Read single bookmark

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=drill_bookmark
```

## Overview

Returns one bookmark by ID if it is visible to the current member.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission as evaluated by `FEATURE_DEPENDENCIES` (`funnels`, `cohorts`, `users`, `drill`, `formulas`).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `drill_bookmark`. |
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Yes | Bookmark ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o?method=drill_bookmark&
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=67bd31c92e7f0b0012ab4567
```

## Response

### Success Response

```json
{
  "_id": "67bd31c92e7f0b0012ab4567",
  "name": "US iOS Sessions",
  "event_key": "[CLY]_session",
  "desc": "Sessions for iOS users in US",
  "global": false,
  "creator": "64f5bf79f4f7ac0012ab1234",
  "query_obj": "{\"up.cc\":\"US\",\"up.p\":\"ios\"}",
  "query_text": "Country is US and platform is iOS",
  "by_val": "[\"up.p\"]",
  "by_val_text": "Platform",
  "event_app_id": "2c2f0f9a..."
}
```

Or `null` when bookmark is not found / not visible.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object or Null | Bookmark object when found and visible; otherwise `null`. |
| `_id` | String | Bookmark ID. |
| `app_id` | String | App ID the bookmark belongs to. |
| `event_key` | String | Event key the bookmark belongs to. |
| `name` | String | Bookmark name. |
| `desc` | String | Bookmark description. |
| `global` | Boolean | Whether the bookmark is visible beyond its creator. |
| `creator` | String | Member ID of the bookmark creator. |
| `query_obj` | String | Saved Drill query object JSON string. Uses the same shape as segmentation `queryObject`. |
| `query_text` | String | Human-readable query label. |
| `by_val` | String | Saved projection key array JSON string, equivalent to segmentation `projectionKey`. |
| `by_val_text` | String | Human-readable projection label. |
| `namespace` | String | Non-default namespace, when stored. |
| `visualization` | String | Optional visualization hint. |
| `sign` | String | Deterministic duplicate-detection signature. |
| `event_app_id` | String | MD5 hash of `app_id + event_key` used for event-scoped lookup. |

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior

- Reads bookmark by ID from `countly_drill.drill_bookmarks`.
- Applies visibility filter: globally visible bookmark or creator-owned bookmark.
- Does not require `event_key`; lookup is by `_id` plus visibility.

## Related Endpoints

- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Create](bookmark-create.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_bookmarks` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
