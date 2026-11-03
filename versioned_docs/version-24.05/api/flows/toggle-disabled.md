---
sidebar_label: "Toggle Disabled"
keywords:
  - "/i/flows/toggleDisabled"
  - "toggleDisabled"
  - "flows"
last_update:
  date: "2026-10-31"
---

# Toggle flow disabled status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/flows/toggleDisabled
```

## Overview

Enables or disables a single flow.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Create` permission for this endpoint.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Yes | Flow ID to update. |
| `disabled` | Boolean | No | `true` disables the flow. Any other value, or leaving it out, enables it. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Disable a flow

```text
/i/flows/toggleDisabled?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567&
  disabled=true
```

### Re-enable a flow

```text
/i/flows/toggleDisabled?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567&
  disabled=false
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when the flow is updated. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: _id"
}
```

- `400`

```json
{
  "result": "data base error. Please chack logs."
}
```

## Behavior

- Updates the `disabled` field of the flow with the given `_id` and `app_id`.
- Sets `disabled=true` only when the value is boolean `true` or the string `"true"`; otherwise sets `false`.
- A disabled flow cannot be calculated until it is enabled again.

## Related Endpoints

- [Flows - List](list.md)
- [Flows - Calculate](calculate.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
