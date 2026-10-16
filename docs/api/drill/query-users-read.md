---
sidebar_label: "Query Users - Read"
keywords:
  - "/o?method=segmentation_users"
  - "segmentation_users"
  - "o"
last_update:
  date: "2026-10-16"
---

# Read users matching a Drill query

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=segmentation_users
```

## Overview

Returns the list of user IDs (`uid`) that match a Drill filter for an event in a period.

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
| `period` | String or Array | Yes | Period value, for example `30days`, `month`, `day`, `yesterday`, `hour`, `prevMonth`, or a date range array. |
| `bucket` | String | Yes | One of `hourly`, `daily`, `weekly`, `monthly`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Users who triggered an event in the last 30 days

```text
/o?method=segmentation_users&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=purchase&
  queryObject={}&
  period=30days&
  bucket=daily
```

### Users from selected countries

```text
/o?method=segmentation_users&
  app_id=64f5c0d8f4f7ac0012ab3456&
  event=[CLY]_session&
  queryObject={"up.cc":{"$in":["US","CA"]}}&
  period=7days&
  bucket=daily
```

## Response

### Success Response

```json
[
  "1",
  "2",
  "7"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root array)` | Array | `uid` values of the matching users. |

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

- The app, event and period filters are added to `queryObject` from `app_id`, `event` and `period`.
- Filters that use unsafe query operators are rejected with a `400` response.

## Related Endpoints

- [Query Segmentation - Read](query-segmentation-read.md)
- [Query Metadata - Read](query-metadata-read.md)
