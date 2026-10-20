---
sidebar_label: "Property Values Count Read"
keywords:
  - "/o/data-manager/property-values-count"
  - "property-values-count"
  - "data-manager"
last_update:
  date: "2026-10-17"
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

Returns how many distinct values are stored for a user property.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `prop` | String | Yes | User property key, for example `custom.subscription_tier`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Count the values of a user property

```text
/o/data-manager/property-values-count?app_id=64f5c0d8f4f7ac0012ab3456&prop=custom.subscription_tier
```

## Response

### Success Response

```json
{
  "count": 4
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `count` | Number | Number of distinct stored values. `0` when nothing is stored for the property. |

### Error Responses

- **HTTP 400** - `prop` is missing:
```json
{
  "result": "Error: ..."
}
```
The message after `Error:` lists the validation errors.

- **HTTP 500**:
```json
{
  "result": "Error"
}
```

## Behavior

- Looks up the stored values of the user property in the drill metadata of the app and counts them.

## Related Endpoints

- [Property Values Read](property-values-read.md)
- [User Properties - Read](user-properties-read.md)

<details>
<summary>Implementation details</summary>

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Property value dictionary source | Counts the `values` keys of the user-property metadata document. |

</details>
