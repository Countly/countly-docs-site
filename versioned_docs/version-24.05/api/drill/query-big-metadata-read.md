---
sidebar_label: "Query Big Metadata - Read"
keywords:
  - "/o?method=segmentation_big_meta"
  - "segmentation_big_meta"
  - "drill"
last_update:
  date: "2026-10-09"
---

# Read values of a property with many values

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_big_meta
```

## Overview

Returns the known values of one user property or event segment. Use it for properties that have too many values to be listed by [Query Metadata - Read](query-metadata-read.md), and search within them.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on at least one of the `funnels`, `cohorts`, `users`, `drill` or `formulas` features.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation_big_meta`. |
| `app_id` | String | Yes | Target app ID. |
| `prop` | String | Yes | Property to read. Prefix with `sg.` for an event segment (for example `sg.plan`); any other value is read as a user property (for example `cc`). When missing, an empty array is returned. |
| `event` | String | Conditional | Event key. Needed for `sg.` properties. |
| `search` | String | No | Text to search for. Matching is case-insensitive and treats the text as a regular expression. |
| `searchArr` | JSON String (Array) | No | List of values or patterns to look for; matching values are always included in the result. |
| `options` | JSON String (Object) | No | Set `{"filterValidSemver": true}` to return only values that are valid semantic versions. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Search app versions

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  prop=av&
  search=2.1
```

### Search event segment values

```text
/o?method=segmentation_big_meta&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  prop=sg.plan
```

## Response

### Success Response

```json
["2.1.0", "2.1.1", "2.10.0"]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | Matching values. Numbers and booleans are returned in their own type. |

## Behavior

- The number of values returned is limited by the Drill `list_limit` setting. When `search` is given, an exact match of the searched text is still returned once the limit is reached.
- Returns an empty array when no metadata is stored for the property.

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Query Segmentation - Read](query-segmentation-read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Drill metadata model | Source of the stored property values. |

</details>
