---
sidebar_label: "Crashes"
keywords:
  - "/o/flows"
  - "flows"
last_update:
  date: "2026-02-16"
---

# Get flow crash groups

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/flows?method=crashes
```

## Overview

Returns crash-group options (`name`, `value`) for crash-based flow definitions.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `crashes`. |
| `app_id` | String | Yes | Target app ID. |
| `query` | String | No | Optional case-insensitive name search. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o/flows?
  method=crashes&
  app_id=64f5c0d8f4f7ac0012ab3456&
  query=exception
```

## Response

### Success Response

```json
{
  "result": [
    {
      "name": "NullReferenceException",
      "value": "67aef9ad7c2f4c0012ab33aa"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array | Crash-group option list. |
| `result[].name` | String | Crash-group display name. |
| `result[].value` | String | Crash-group ID (`_id`). |

### Error Responses

- `400`

```json
{
  "result": "DB error. Please check logs"
}
```

## Behavior

- Reads dynamic collection `countly.app_crashgroups{app_id}`.
- Excludes `_id = "meta"`.
- Optional regex filter on name.
- Sorts by name descending and limits to 100.
- Uses `returnMessage(200, res)` for success.

## Related Endpoints

- [Flows - Events](events.md)
- [Flows - Create](create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
