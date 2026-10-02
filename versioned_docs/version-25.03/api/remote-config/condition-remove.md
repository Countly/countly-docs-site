---
sidebar_label: "Condition Delete"
keywords:
  - "/i/remote-config/remove-condition"
  - "remove-condition"
  - "remote-config"
last_update:
  date: "2026-03-05"
---

# Remote Config - Condition Delete

## Endpoint

```plaintext
/i/remote-config/remove-condition
```

## Overview

Deletes a condition and removes its references from all parameters.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `remote_config` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | App id. |
| `condition_id` | String | Yes | Condition document id. |

## Examples

### Delete condition

```plaintext
/i/remote-config/remove-condition?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&condition_id=65f1f7b2ad5b9b001f12ab34
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
| `result` | String | `Success` when removal and cleanup complete. |

### Error Responses

- `500`

```json
{
  "result": "Failed to remove condition"
}
```

## Behavior

- Deletes condition record.
- Removes matching `condition_id` entries from `conditions` arrays in all parameters.
- Emits system log action: `rc_condition_removed`.

## Related Endpoints

- [Remote Config - Condition Create](condition-add.md)
- [Remote Config - Condition Update](condition-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.remoteconfig_conditions{appId}` | Condition storage | Deletes condition by id. |
| `countly_out.remoteconfig_parameters{appId}` | Parameter references | Pulls deleted condition id from parameter `conditions` arrays. |
| `countly.systemlogs` | Audit trail | Receives `rc_condition_removed` action. |

</details>
