---
sidebar_label: "Query Users - Read"
keywords:
  - "/o?method=segmentation_users"
  - "segmentation_users"
  - "drill"
last_update:
  date: "2026-10-09"
---

# Read users matching a query

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_users
```

## Overview

Returns the list of user IDs (`uid`) that have an event matching a Drill filter within a period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `drill` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `segmentation_users`. |
| `app_id` | String | Yes | Target app ID. |
| `event` | String | Yes | Event key to query. |
| `queryObject` | JSON String (Object) | Yes | Mongo-style Drill filter object. Use `{}` for no additional filters. Filters that use disallowed query operators are rejected. |
| `period` | String or Array | Yes | `month`, `day`, `yesterday`, `hour`, `prevMonth`, a number of days such as `30days`, or a date range array. |
| `bucket` | String | Yes | One of `hourly`, `daily`, `weekly`, `monthly`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Users who completed a purchase in the last 30 days

```text
/o?method=segmentation_users&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={}&
  period=30days&
  bucket=daily
```

## Response

### Success Response

```json
[1, 7, 42]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | Distinct `uid` values of the matching users. Empty when nothing matches. |

### Error Responses

**Status Code**: `400 Bad Request`

```json
{
  "result": "Missing request parameter: event"
}
```

The same status is returned with `Missing request parameter: queryObject`, `Bad request parameter: queryObject`, `Missing request parameter: period`, `Bad request parameter: period`, `Missing request parameter: bucket` and `Bad request parameter: bucket` for the matching problems.

**Status Code**: `500`

Returned when the query fails.

## Behavior

- Adds the app, event and period as filters on top of `queryObject`.
- If the filter refers to cohorts, the result is limited to users that are also in those cohorts.
- Returns every matching user ID in a single response, without pagination.

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Query Metadata - Read](query-metadata-read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_events` | Drill event data | Source of matching user IDs. |
| `countly.app_users{appId}` | User profiles | Used to apply cohort filters. |

</details>
