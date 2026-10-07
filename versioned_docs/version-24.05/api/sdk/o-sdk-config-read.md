---
sidebar_label: "Config Read"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-03-05"
---

# SDK - Config Read

## Endpoint

```plaintext
/o?method=sdk-config
```

## Overview

Returns stored SDK config for dashboard/admin usage.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `sdk-config`. |
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | App id. |

## Examples

### Read stored SDK config

```plaintext
/o?method=sdk-config&api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "tracking": true,
  "crt": true,
  "vt": true,
  "bom": true,
  "bom_at": 10,
  "bom_rqp": 50
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Object | Stored config object for the app (`config`). |

### Error Responses

- `400`

```json
{
  "result": "Error: undefined"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Config exists | App has `sdk_configs` document with `config` object | Reads and returns stored `config`. | Raw SDK config object. |
| No config doc | No matching document for app | Returns empty object fallback. | `{}` |
| Read failure | Read operation rejects/errors | Returns wrapped error response. | Wrapped error in `result`. |

## Related Endpoints

- [SDK - SDK Config Read](o-sdk-config.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.sdk_configs` | SDK config source | Reads per-app SDK config document. |

</details>
