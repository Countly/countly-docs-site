---
sidebar_label: "App Update Plugins"
keywords:
  - "/i/apps/update/plugins"
  - "update"
  - "plugins"
  - "apps"
last_update:
  date: "2026-10-07"
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

- Global admins, or users with admin access to the target app.

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

Always send `args`, and make sure it is a valid JSON object (not an array or a plain string), URL-encoded when passed in the query string. Include only the plugins or settings sections you want to change.

## Examples

### Example 1: Update a settings section that is not a plugin

```plaintext
/i/apps/update/plugins?api_key=YOUR_API_KEY&app_id=64b0ac10c2c3ce0012dd1001&args={"my_section":{"enabled":true}}
```

### Example 2: Update a plugin that handles its own config

```plaintext
/i/apps/update/plugins?api_key=YOUR_API_KEY&app_id=64b0ac10c2c3ce0012dd1001&args={"push":{"rate":{"rate":100,"period":60}}}
```

## Response

### Success Response

Example 1 (key is stored as sent and echoed back):

```json
{
  "_id": "64b0ac10c2c3ce0012dd1001",
  "plugins": {
    "my_section": {
      "enabled": true
    }
  }
}
```

Example 2 (the push plugin stores the config itself and returns no value, so `plugins` is empty and `result` is an empty string):

```json
{
  "_id": "64b0ac10c2c3ce0012dd1001",
  "plugins": {},
  "result": ""
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
| `plugins` | Object | For each updated key: the value as stored, or, for a plugin that handles its own config, the object that plugin returned. |
| `result` | String | Present only when a plugin that handles its own config returned a non-object value; contains those values joined by newlines. It is an empty string when the plugin returned no value (for example push). |

### Error Responses

**Status Code**: `400 Bad Request` (`app_id` shorter than 24 characters)
```json
{
  "result": "Error: Length of app_id is lower than min length value"
}
```

**Status Code**: `400 Bad Request` (`app_id` longer than 24 characters)
```json
{
  "result": "Error: Length of app_id is greater than max length value"
}
```

**Status Code**: `400 Bad Request` (`app_id` missing)
```json
{
  "result": "No app id provided"
}
```

**Status Code**: `400 Bad Request` (a plugin rejected its configuration; the plugin's validation messages, comma-separated)
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

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

**Status Code**: `401 Unauthorized`
```json
{
  "result": "User does not exist"
}
```

**Status Code**: `401 Unauthorized` (user is not an admin of the app)
```json
{
  "result": "User does not have right"
}
```

## Behavior

- Loads the app by `app_id`; returns `404` if it does not exist.
- For every key in `args` that is an installed plugin, the update is first offered to that plugin, which can validate or transform the config.
- If a plugin handles the update, it stores the config itself and the generic `app_config_updated` log is not written (the plugin may write its own; for example, push writes `plugin_push_config_updated` when its config changes). Push only acts on its known keys (such as `rate`); unknown keys are ignored.
- If no plugin handles the update, or the key is not an installed plugin, the value is stored in the app document under `plugins.<name>` and an `app_config_updated` system log entry is written with the config before and after.

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
