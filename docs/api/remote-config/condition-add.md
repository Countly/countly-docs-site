---
sidebar_label: "Condition Create"
keywords:
  - "/i/remote-config/add-condition"
  - "add-condition"
  - "remote-config"
last_update:
  date: "2026-03-05"
---

# Remote Config - Condition Create

## Endpoint

```plaintext
/i/remote-config/add-condition
```

## Overview

Creates a condition document used for targeting parameter values.

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
| `condition` | String (JSON Object) | Yes | Condition payload. |

### Condition Structure (`condition`)

| Field | Type | Required | Description |
|---|---|---|---|
| `condition_name` | String | Yes | Must match `^[a-zA-Z0-9 ]+$`. |
| `condition_color` | Number | Yes | Color index used by dashboard. |
| `condition` | Object/String | Yes | Condition query definition. |
| `seed_value` | String | No | Seed used in rollout percentile logic. |

## Examples

### Create condition

```plaintext
/i/remote-config/add-condition?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&condition={"condition_name":"iOS Users","condition_color":1,"condition":{"up._os":{"$eq":"iOS"}},"seed_value":"button_color"}
```

## Response

### Success Response

```json
"65f1f7b2ad5b9b001f12ab34"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | String | Newly created condition id. |

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

- Parses `condition` JSON string.
- Serializes nested `condition.condition` object to JSON string before storing.
- Emits system log action: `rc_condition_created`.

## Related Endpoints

- [Remote Config - Condition Update](condition-update.md)
- [Remote Config - Condition Delete](condition-remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.remoteconfig_conditions{appId}` | Condition storage | Validates duplicates and inserts condition document. |
| `countly.systemlogs` | Audit trail | Receives `rc_condition_created` action. |

</details>
