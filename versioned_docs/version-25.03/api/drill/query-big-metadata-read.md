---
sidebar_label: "Query Big Metadata - Read"
keywords:
  - "/o?method=segmentation_big_meta"
  - "segmentation_big_meta"
  - "drill"
  - "metadata"
last_update:
  date: "2026-10-15"
---

# Drill - Read Big Metadata Values

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_big_meta
```

## Overview

Returns the known values of one event segment or user property. Use it to look up values of properties that have too many values to be returned in full by [Query Metadata - Read](query-metadata-read.md). The values can be narrowed down with a search term.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission as evaluated by `FEATURE_DEPENDENCIES` (`funnels`, `cohorts`, `users`, `drill`, `formulas`).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation_big_meta`. |
| `app_id` | String | Yes | Target app ID. |
| `prop` | String | Yes | Property to read values of. A name starting with `sg.` is an event segment of `event`; any other name is a user property. If missing, an empty array is returned. |
| `event` | String | Conditional | Event key. Required when `prop` starts with `sg.`. |
| `search` | String | No | Only values matching this text (case-insensitive, used as a regular expression) are returned. A value that equals the text exactly is returned even if the value list limit is reached. |
| `searchArr` | JSON String (Array) | No | List of texts. Values equal to, or matching, any of them are returned in addition to the values matched by `search`. |
| `options` | JSON String (Object) | No | `{"filterValidSemver": true}` returns only values that are valid semantic versions (for example app versions). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read values of an event segment

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY&
  event=purchase&
  prop=sg.product
```

### Search user property values

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY&
  prop=email&
  search=example
```

## Response

### Success Response

An array of values:

```json
[
  "shoes",
  "hat",
  "bag"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | Known values of the property, converted to numbers where possible. At most the configured Drill `list_limit` values are returned, apart from exact matches of `search`. |

## Behavior

- Without `prop`, an empty array is returned.
- Values are read from the stored Drill metadata of the property.
- An invalid `options`, `searchArr` or `search` expression is ignored.

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Query Segmentation - Read](query-segmentation-read.md)
