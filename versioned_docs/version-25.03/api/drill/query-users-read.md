---
sidebar_label: "Query Users - Read"
keywords:
  - "/o?method=segmentation_users"
  - "segmentation_users"
  - "drill"
  - "users"
last_update:
  date: "2026-10-15"
---

# Drill - Read Users of a Query

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_users
```

## Overview

Returns the user IDs (`uid`) of the users who match a Drill query for one event in the requested period.

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
| `queryObject` | JSON String (Object) | Yes | Mongo-style Drill filter object. Use `{}` for no additional filters. |
| `period` | String or JSON String (Array) | Yes | `month`, `day`, `yesterday`, `hour`, `prevMonth`, `<number>days` (for example `30days`), or a custom range as a JSON array. |
| `bucket` | String | Yes | `hourly`, `daily`, `weekly`, or `monthly`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read users who ran an event in the last 30 days

```text
/o?method=segmentation_users&
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY&
  event=[CLY]_session&
  queryObject={}&
  period=30days&
  bucket=daily
```

## Response

### Success Response

An array of user IDs:

```json
[
  "a1b2c3d4",
  "e5f6a7b8"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | `uid` values of the matching users. Empty when no user matches. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: event"
}
```

- `400`

```json
{
  "result": "Missing request parameter: queryObject"
}
```

- `400`

```json
{
  "result": "Bad request parameter: queryObject"
}
```

- `400`

```json
{
  "result": "Missing request parameter: period"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

- `400`

```json
{
  "result": "Missing request parameter: bucket"
}
```

- `400`

```json
{
  "result": "Bad request parameter: bucket"
}
```

## Behavior

- The `queryObject` filter is applied to the event data of the period.
- If the query refers to cohorts, the result is limited to users who are in those cohorts.

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Query Metadata - Read](query-metadata-read.md)
