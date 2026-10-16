---
sidebar_label: "Get Ratings Metadata"
keywords:
  - "/o?method=star"
  - "star"
  - "ratings"
last_update:
  date: "2026-10-16"
---

# Star Rating - Get Ratings Metadata

## Endpoint

```plaintext
/o?method=star
```

## Overview

Returns the platforms and platform version and rating combinations for which star ratings were recorded in a period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `star`. |
| `app_id` | String | Yes | App id. |
| `period` | String or Array | Yes | Period value: `month`, `day`, `yesterday`, `hour`, `prevMonth`, `{number}days` such as `30days`, or a date range array. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read rating metadata for 30 days

```plaintext
/o?method=star&api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days
```

## Response

### Success Response

```json
{
  "Android": [
    "3:2",
    "1:7"
  ],
  "iOS": [
    "1:1",
    "2:5"
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `<platform>` | Array | Platform name as the key. The array lists the platform version and rating combinations recorded for that platform in the period. |

### Error Responses

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

## Behavior

- Permission is checked before the parameters are validated.
- Returns an empty object when no ratings were recorded in the period.

## Related Endpoints

- [Star Rating - Get Feedback Data](o-feedback-data.md)
- [Star Rating - List All Widgets](o-feedback-widgets.md)
