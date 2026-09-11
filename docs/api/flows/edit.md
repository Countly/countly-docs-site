---
sidebar_label: "Edit"
keywords:
  - "/i/flows/edit"
  - "edit"
  - "flows"
last_update:
  date: "2026-02-16"
---

# Edit flow

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/flows/edit
```

## Overview

Updates an existing flow schema.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Create` permission for this endpoint.

## Request Parameters

Same schema fields as [Flows - Create](create.md), plus:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Existing flow ID. |

## Examples

```text
/i/flows/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567&
  name=Signup to Purchase (Updated)&
  type=events&
  start={"event":"signup"}&
  end={"event":"purchase"}&
  period=30days
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
| `result` | String | `Success` when flow schema update is applied. |

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
  "result": "Flow not found for update."
}
```

- `400`

```json
{
  "result": "data base error. Please check logs."
}
```

## Behavior

- Parses and normalizes same fields as create.
- Sets `status = edited` and updates `status_changed` timestamp.
- Updates by `_id` and `app_id`.
- Logs `flows_edited` on success.

## Related Endpoints

- [Flows - Create](create.md)
- [Flows - Calculate](calculate.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
