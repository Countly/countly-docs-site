---
sidebar_label: "App Update Plugins"
keywords:
  - "/i/apps/update/plugins"
  - "update"
  - "plugins"
  - "apps"
last_update:
  date: "2026-10-01"
---

# /i/apps/update/plugins

## Endpoint

```plaintext
/i/apps/update/plugins
```

## Overview

Update the app-level configuration of one or more plugins. Each key in `args` is a plugin (or settings section) name and its value is the configuration to store for that app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- App admin permission for the target app (route-level app-admin validation).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. Must be exactly 24 characters. |
| `args` | JSON String (Object) | Yes | Map of plugin name to its new app-level configuration. |

### `args` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `[pluginName]` | Object | Yes (at least one) | New configuration for that plugin. Use one key per plugin to update. |

<!-- REVIEW: `args` is not validated by the handler; a request without `args` appears to fail on `Object.keys` instead of returning a validation error. The required status above is inferred. -->

## Examples

### Example 1: Update one plugin's config

```plaintext
/i/apps/update/plugins?api_key=YOUR_API_KEY&app_id=64b0ac10c2c3ce0012dd1001&args={"push":{"gateway":"fcm"}}
```

## Response

### Success Response

```json
{
  "_id": "64b0ac10c2c3ce0012dd1001",
  "plugins": {
    "push": {
      "gateway": "fcm"
    }
  }
}
```

If no keys were supplied in `args`:

```json
{
  "result": "Nothing changed"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | App ID. |
| `plugins` | Object | Applied configuration for each updated plugin. |
| `result` | String | Present only when some plugin updates returned a non-object value; contains those messages joined by newlines. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Error: Validation error details"
}
```

**Status Code**: `400 Bad Request` (a plugin rejected its configuration)
```json
{
  "errors": "Error details"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Couldn't update plugin: <reason>"
}
```

**Status Code**: `404 Not Found`
```json
{
  "result": "App not found"
}
```

## Behavior

- Loads the app by `app_id`; returns `404` if it does not exist.
- For every key in `args` that is an installed plugin, the update is first offered to that plugin through its `/i/apps/update/plugins/<name>` hook, which can validate or transform the config.
- If the plugin does not handle the update itself, or the key is not an installed plugin, the value is stored in the app document under `plugins.<name>`.
- Each stored update writes an `app_config_updated` system log entry with the config before and after.

## Related Endpoints

- [Apps - App Read Plugins](o-apps-plugins.md)
- [Apps - App Update](i-apps-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App plugin config | Reads the app and sets `plugins.<name>`. |

</details>
