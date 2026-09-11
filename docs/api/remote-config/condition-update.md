---
sidebar_label: "Condition Update"
keywords:
  - "/i/remote-config/update-condition"
  - "update-condition"
  - "remote-config"
last_update:
  date: "2026-03-05"
---

# Remote Config - Condition Update

## Endpoint

```plaintext
/i/remote-config/update-condition
```

## Overview

Updates an existing condition document by id.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `remote_config` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | App id. |
| `condition_id` | String | Yes | Condition document id. |
| `condition` | String (JSON Object) | Yes | Updated condition payload. |

### Condition Structure (`condition`)

| Field | Type | Required | Description |
|---|---|---|---|
| `condition_name` | String | Yes | Must match `^[a-zA-Z0-9 ]+$`. |
| `condition_color` | Number | Yes | Color index used by dashboard. |
| `condition` | Object/String | Yes | Condition query definition. |
| `seed_value` | String | No | Seed used in rollout percentile logic. |

## Examples

### Update condition

```plaintext
/i/remote-config/update-condition?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&condition_id=65f1f7b2ad5b9b001f12ab34&condition={"condition_name":"iOS New Users","condition_color":2,"condition":{"up._os":{"$eq":"iOS"},"up.nc":{"$eq":1}},"seed_value":"button_color"}
```

## Response

### Success Response

```json
{}
```

### Response Fields

No fields are returned on success for this endpoint.

### Error Responses

- `400`

```json
{
  "result": "Invalid parameter: condition_name"
}
```

- `400`

```json
{
  "result": "Invalid parameter: condition_color"
}
```

- `400`

```json
{
  "result": "Invalid parameter: condition"
}
```

- `500`

```json
{
  "result": "The condition already exists"
}
```

## Behavior

- Serializes `condition.condition` to JSON string before update.
- Emits system log action: `rc_condition_edited` with before/after payload.

## Related Endpoints

- [Remote Config - Condition Create](condition-add.md)
- [Remote Config - Condition Delete](condition-remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.remoteconfig_conditions{appId}` | Condition storage | Validates uniqueness and updates condition by id. |
| `countly.systemlogs` | Audit trail | Receives `rc_condition_edited` action. |

</details>
