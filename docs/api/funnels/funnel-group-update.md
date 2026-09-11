---
sidebar_label: "Update Group"
keywords:
  - "/i/funnels/group"
  - "group"
  - "funnels"
last_update:
  date: "2026-02-16"
---

# Update funnel groups

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/funnels/group
```

## Overview

Updates funnel group flags (including favorite group flags) for a funnel.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `funnels` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `funnel_id` | String | Yes | Funnel ID to update groups for. |
| `groups` | JSON String (Object) | Yes | Group map where truthy values are set and falsy values are unset. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/i/funnels/group?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_id=67f1c22912df5acb8f8d5caaf0f89a31&
  groups={"fav_64f5c0d8f4f7ac0012ab9999":true,"marketing":true}
```

```text
/i/funnels/group?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_id=67f1c22912df5acb8f8d5caaf0f89a31&
  groups={"marketing":false}
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
| `result` | String | Group update result. |

### Error Responses

- `400`

```json
{
  "result": "Not enough args"
}
```

- `400`

```json
{
  "result": "Cannot save data"
}
```

- `404`

```json
{
  "result": "Funnel not found"
}
```

## Behavior

- Parses `groups` JSON object.
- For each key, truthy values are written to `groups.<key> = 1`, falsy values are removed via `$unset`.
- Requires existing funnel match by `_id` and `app_id`.
- Writes `funnel_edited` system log entry with before/update payload.

## Related Endpoints

- [Funnels - Update](funnel-update.md)
- [Funnels - List](read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
