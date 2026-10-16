---
sidebar_label: "Query Big Metadata - Read"
keywords:
  - "/o?method=segmentation_big_meta"
  - "segmentation_big_meta"
  - "o"
last_update:
  date: "2026-10-16"
---

# Read values of a big-list property

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_big_meta
```

## Overview

Returns the known values of one event segment or user property whose value list is too large to be included in [Query Metadata - Read](query-metadata-read.md). The list can be narrowed with a search string.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on at least one of the `drill`, `funnels`, `cohorts`, `users` or `formulas` features.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation_big_meta`. |
| `app_id` | String | Yes | Target app ID. |
| `event` | String | Yes | Event key the property belongs to. |
| `prop` | String | Yes | Property name. Use the `sg.` prefix for an event segment, for example `sg.source`; any other name is read as a user property. |
| `search` | String | No | Only values that match this text (case-insensitive) are returned. |
| `searchArr` | JSON String (Array) | No | List of texts; values that equal or match any of them are also returned. |
| `options` | JSON String (Object) | No | Set `filterValidSemver` to `true` to return only values that are valid semantic versions. |
| `no_cache` | Boolean | No | If set, the value list is rebuilt from the last 30 days of data instead of using the stored list. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read values of an event segment

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  prop=sg.product
```

### Search values of a user property

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  prop=av&
  search=1.2
```

## Response

### Success Response

```json
[
  "1.2.0",
  "1.2.1"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | Property values. The number of values is limited by the Drill `list_limit` setting. |

If `prop` is not provided, the response is an empty array.

## Behavior

- Values come from a stored list that is refreshed when it is older than one hour or when `no_cache` is set.
- Without a stored list, or with `no_cache`, the refresh looks at the last 30 days of data; otherwise it looks at the days since the last refresh.

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Query Segmentation - Read](query-segmentation-read.md)
