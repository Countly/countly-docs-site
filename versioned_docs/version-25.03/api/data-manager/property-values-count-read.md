---
sidebar_label: "Property Values Count Read"
keywords:
  - "/o/data-manager/property-values-count"
  - "property-values-count"
  - "data-manager"
last_update:
  date: "2026-10-15"
---

# Read property value count

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/data-manager/property-values-count
```

## Overview

Returns the number of known values of a user property.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `prop` | String | Yes | User property key. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Count values of a user property

```text
/o/data-manager/property-values-count?
  app_id=64f5c0d8f4f7ac0012ab3456&
  api_key=YOUR_API_KEY&
  prop=subscription_tier
```

## Response

### Success Response

```json
{
  "count": 12
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `count` | Number | Number of known values of the property. `0` if none are recorded. |

### Error Responses

- `400`

```json
{
  "result": "Error: <validation errors>"
}
```

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Counts the values stored in the Drill metadata of the user property.

## Related Endpoints

- [Property Values - Read](property-values-read.md)
- [User Properties - Read](user-properties-read.md)
