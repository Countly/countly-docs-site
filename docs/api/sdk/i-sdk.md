---
sidebar_label: "SDK Fetch Write"
keywords:
  - "/i/sdk"
  - "sdk"
last_update:
  date: "2026-10-09"
---

# SDK Fetch - Write

## Endpoint

```plaintext
/i/sdk
```

## Overview

Accepts an SDK request on the write path. The app and user are resolved, the checksum is verified, and the request is then handled in the same way as [SDK Fetch Read](o-sdk.md): installed feature methods process it and return their own payload.

## Authentication

- SDK app key: `app_key`
- SDK device id: `device_id`

## Permissions

- No dashboard-user permission model. Access is controlled by valid `app_key` and SDK request validation logic.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key. |
| `device_id` | String | Yes | Device identifier. Used with app key to derive app-user hash. |
| `method` | String | Usually | Feature-specific method name handled by installed SDK listeners. |
| `metrics` | Object/JSON String | No | Optional metrics object. String values are parsed when possible. |
| `checksum` | String | Conditionally | Required when app checksum salt is configured and SHA-1 checksum mode is used. |
| `checksum256` | String | Conditionally | Required when app checksum salt is configured and SHA-256 checksum mode is used. |
| `ip_address` | String | No | Optional explicit IP used instead of request IP. |

## Examples

### Example 1: SDK request

```plaintext
/i/sdk?app_key=YOUR_APP_KEY&device_id=DEVICE_ID&method=sc
```

### Example 2: Missing required params

```plaintext
/i/sdk?method=sc
```

```json
{
  "result": "Missing parameter \"app_key\" or \"device_id\""
}
```

## Response

### Success Response

The payload is method-specific.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Any JSON type | Method-specific payload returned by the feature handling the request. |

### Error Responses

**Status Code**: `400 Bad Request`

```json
{
  "result": "Missing parameter \"app_key\" or \"device_id\""
}
```

**Status Code**: `400 Bad Request`

```json
{
  "result": "App does not exist"
}
```

**Status Code**: `400 Bad Request`

```json
{
  "result": "Invalid method"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Response Shape |
|---|---|---|
| Method handled | Installed feature handles the requested SDK method | Any JSON payload shape. |
| Unhandled method | No feature handles the method | Wrapped `Invalid method` error. |
| Checksum gate fail | App has a checksum salt and the checksum is missing or invalid | Wrapped error string. |

## Limitations

- There is no single fixed success schema for this endpoint.

## Related Endpoints

- [SDK Fetch Read](o-sdk.md)
- [SDK Ingestion](../core/bulk/ingestion.md)
