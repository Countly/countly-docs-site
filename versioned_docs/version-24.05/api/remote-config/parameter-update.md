---
sidebar_label: "Parameter Update"
keywords:
  - "/i/remote-config/update-parameter"
  - "update-parameter"
  - "remote-config"
last_update:
  date: "2026-03-05"
---

# Remote Config - Parameter Update

## Endpoint

```plaintext
/i/remote-config/update-parameter
```

## Overview

Updates an existing remote config parameter by id.

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
| `parameter_id` | String | Yes | Parameter document id. |
| `parameter` | String (JSON Object) | Yes | Updated parameter payload. |

### Parameter Structure (`parameter`)

| Field | Type | Required | Description |
|---|---|---|---|
| `parameter_key` | String | Yes | Must match `^[a-zA-Z_][a-zA-Z0-9_]*$`. |
| `default_value` | Any | Yes | Updated default value. |
| `status` | String | No | Defaults to `Running` when omitted. |
| `conditions` | Array | No | Updated condition-value list. |

## Examples

### Update parameter default value

```plaintext
/i/remote-config/update-parameter?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&parameter_id=65f1f7b2ad5b9b001f12ab34&parameter={"parameter_key":"button_color","default_value":"#00AA55","conditions":[]}
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
  "result": "Invalid parameter: parameter_key"
}
```

- `400`

```json
{
  "result": "Invalid parameter: default_value"
}
```

- `500`

```json
{
  "result": "The parameter already exists"
}
```

- `500`

```json
{
  "result": "Maximum conditions limit reached"
}
```

## Behavior

- Parses `parameter` JSON string.
- Sets `status` to `Running` when missing.
- Rebuilds `valuesList` and merges with existing `valuesList` using `$addToSet`.
- Emits system log action: `rc_parameter_edited` with before/after snapshot.

## Limitations

- `parameter` must contain both `parameter_key` and `default_value`.

## Related Endpoints

- [Remote Config - Parameter Create](parameter-add.md)
- [Remote Config - Parameter Delete](parameter-remove.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `remote-config.conditions_per_paramaeters` | `20` | Validation limit | Update fails when provided condition list exceeds max. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.remoteconfig_parameters{appId}` | Parameter storage | Validates uniqueness and updates parameter document by id. |
| `countly.systemlogs` | Audit trail | Receives `rc_parameter_edited` action. |

</details>
