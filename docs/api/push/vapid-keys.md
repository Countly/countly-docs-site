---
sidebar_label: "Generate VAPID Keys"
keywords:
  - "/o/push/vapid_keys"
  - "vapid_keys"
  - "push"
last_update:
  date: "2026-10-23"
---

# /o/push/vapid_keys

## Endpoint

```plaintext
/o/push/vapid_keys
```

Ⓔ Enterprise Only

## Overview

Generates a new VAPID public and private key pair for web push credentials. The keys are only returned, not saved. They are stored only when you save them as the app's push credentials.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission for Push Notifications.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes* | API key authentication |
| `auth_token` | String | Yes* | Session token authentication |
| `app_id` | ObjectID | Yes | App ID |

`*` Provide either `api_key` or `auth_token`.

## Examples

### Generate a key pair

```plaintext
https://your-server.com/o/push/vapid_keys
  ?api_key=YOUR_API_KEY
  &app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "publicKey": "BPublicKeyBase64Url",
  "privateKey": "PrivateKeyBase64Url"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `publicKey` | String | VAPID public key, base64-url encoded. |
| `privateKey` | String | VAPID private key, base64-url encoded. |

### Error Responses

`500 Internal Server Error`

```json
{
  "result": {
    "errors": ["Failed to generate VAPID keypair"]
  }
}
```

## Behavior

1. Generates a new key pair on every call.
2. Does not save the keys.

### Impact on Other Data

This endpoint does not modify data.

## Related Endpoints

- [Push Notifications - Read App Config](./app-config.md)
