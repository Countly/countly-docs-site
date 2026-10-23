---
sidebar_label: "Read App Config"
keywords:
  - "/o/push/app-config"
  - "app-config"
  - "push"
last_update:
  date: "2026-10-23"
---

# /o/push/app-config

## Endpoint

```plaintext
/o/push/app-config
```

Ⓔ Enterprise Only

## Overview

Returns which push platforms have credentials configured for an app, and the app's push test configuration. No credential details are returned.

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

### Read the push configuration of an app

```plaintext
https://your-server.com/o/push/app-config
  ?api_key=YOUR_API_KEY
  &app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "a": {"_id": "67cab1234d1e2a001f3b4501"},
  "i": {"_id": "67cab1234d1e2a001f3b4502"},
  "test": {
    "uids": "user_1,user_2",
    "cohorts": ["67cab1234d1e2a001f3b4503"]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `a` | Object | Android credentials, present only when configured. Contains the credential `_id`. |
| `i` | Object | iOS credentials, present only when configured. Contains the credential `_id`. |
| `h` | Object | Huawei credentials, present only when configured. Contains the credential `_id`. |
| `w` | Object | Web credentials, present only when configured. Contains the credential `_id`. |
| `test` | Object | Test configuration of the app with `uids` and `cohorts`. Present only when set. |

## Behavior

1. Reads the push settings of the app.
2. Lists a platform only if its credential still exists.
3. Returns `{}` when no platform is configured and no test configuration is set.

### Impact on Other Data

This endpoint is read-only and does not modify data.

## Related Endpoints

- [Push Notifications - Message Test](./message-test.md)
- [Push Notifications - Read Dashboard](./dashboard.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose | Key Fields |
|---|---|---|
| `countly.creds` | Checks that the credential of each platform exists | `_id` |

</details>
