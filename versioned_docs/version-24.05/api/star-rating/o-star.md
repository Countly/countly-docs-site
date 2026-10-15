---
sidebar_label: "Ratings Metadata"
keywords:
  - "/o?method=star"
  - "star"
  - "star rating"
last_update:
  date: "2026-10-09"
---

# Star Rating - Ratings Metadata

## Endpoint

```text
/o?method=star
```

## Overview

Returns the platforms and app versions that received star ratings in a period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `star`. |
| `app_id` | String | Yes | Target app ID. |
| `period` | String | Yes | `prevMonth`, `month`, `day`, `yesterday`, `hour`, a number of days such as `30days`, or a date range array. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Example 1: Read ratings metadata

```text
/o?method=star&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  period=30days
```

## Response

### Success Response

```json
{
  "Android": ["3:2", "1:7"],
  "iOS": ["1:1", "2:5"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | One key per platform that received ratings in the period. |
| `<platform>` | Array | Distinct app versions that received ratings on that platform, as stored in the rating data. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing request parameter: period"
}
```

```json
{
  "result": "Bad request parameter: period"
}
```

## Behavior

- Reads the star rating event data of the app for the period and merges the platform and version lists of every day in it.

## Related Endpoints

- [Get Feedback Data](./o-feedback-data.md)
- [Get Ratings Widgets](./o-sdk.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events{hash}` | Star rating event data | Reads the platform and version metadata of `[CLY]_star_rating`. |

</details>
