---
sidebar_label: "Get Rating Platforms and Versions"
keywords:
  - "/o?method=star"
  - "star"
  - "ratings"
  - "feedback"
last_update:
  date: "2026-10-15"
---

# Star Rating - Get Rating Platforms and Versions

## Endpoint

```plaintext
/o?method=star
```

## Overview

Returns the platforms and app versions for which star ratings were recorded in the requested period. Use it to fill the platform and version filters of [Get Feedback Data](./o-feedback-data.md).

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `star_rating` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `star`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |
| `period` | String/Array | Yes | `prevMonth`, `month`, `day`, `yesterday`, `hour`, `<number>days` (for example `30days`), or a custom range as a JSON array. |

## Examples

### Read platforms and versions of the last 30 days

```plaintext
/o?method=star&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  period=30days
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
| `<platform>` | Array of String | App versions recorded for the platform. The platform name is the key. |

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

Authentication and authorization failures are returned by the common auth layer.

## Behavior

- Returns an empty object when no ratings were recorded in the period.

## Related Endpoints

- [Star Rating - Get Feedback Data](./o-feedback-data.md)
- [Star Rating - List All Widgets](./o-feedback-widgets.md)
