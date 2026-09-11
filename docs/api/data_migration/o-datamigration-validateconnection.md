---
sidebar_label: "Connection Validate"
keywords:
  - "/o/datamigration/validateconnection"
  - "validateconnection"
  - "datamigration"
last_update:
  date: "2026-02-17"
---

# Data Migration - Validate Remote Connection

## Endpoint

```text
/o/datamigration/validateconnection
```

## Overview

Validates whether a target Countly server and import token are usable for remote migration import.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_migration` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `server_address` | String | Yes | Target Countly server base URL. |
| `server_token` | String | Yes | Target server import token. |
| `args` | JSON String (Object) | No | Optional JSON-stringified helper args. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Validate target migration endpoint

```text
/o/datamigration/validateconnection?
  server_address=http://target-countly.example.com&
  server_token=2fc9d68f6f284f9fa95b93b7d598
```

## Response

### Success Response

```json
{
  "result": "data-migration.connection-is-valid"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Validation outcome key. |

### Error Responses

- `404`

```json
{
  "result": "data-migration.token_missing"
}
```

- `404`

```json
{
  "result": "data-migration.address_missing"
}
```

- `404`

```json
{
  "result": "data-migration.invalid-server-path"
}
```

- `404`

```json
{
  "result": "data-migration.target-server-not-valid"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Connection valid | Remote `/i/datamigration/import?test_con=1` returns `valid` | Confirms target token/path usability. | Wrapped success key |
| Connection invalid | Remote returns non-valid response or 4xx | Maps response to migration error key. | Wrapped error key |
| Request failure | Network/request failure | Returns request error message. | Wrapped error message |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Data Migration - Export](i-datamigration-export.md)
- [Data Migration - Send Existing Export](i-datamigration-sendexport.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `security.*` (global security config) | Server-defined | Outbound HTTP request behavior | This endpoint uses `countly-request` initialized with `plugins.getConfig("security")`; TLS/proxy/request options can change validation success/failure. |

**Database Collections**

This endpoint does not read or write database collections directly.

</details>
