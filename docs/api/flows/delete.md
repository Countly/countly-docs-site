---
sidebar_label: "Delete"
keywords:
  - "/i/flows/delete"
  - "delete"
  - "flows"
last_update:
  date: "2026-02-16"
---

# Delete flow

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/flows/delete
```

## Overview

Deletes a flow schema and all related flow data.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Create` permission for this endpoint.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Yes | Flow ID to delete. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/i/flows/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567
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
| `result` | String | `Success` when schema and data are deleted. |

### Error Responses

- `400`

```json
{
  "result": "Flow not found"
}
```

- `400`

```json
{
  "result": "Data base error. Pleas check logs"
}
```

## Behavior

- Verifies schema exists by `_id` + `app_id`.
- Deletes `flow_data` rows with `_id` prefix `<flow_id>_`.
- Deletes schema row by `_id`.
- Logs `flows_deleted` on success.

## Related Endpoints

- [Flows - List](list.md)
- [Flows - Create](create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.flow_data` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
