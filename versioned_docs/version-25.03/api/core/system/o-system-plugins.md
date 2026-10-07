---
sidebar_label: "Features List"
keywords:
  - "/o/system/plugins"
  - "plugins"
  - "system"
last_update:
  date: "2026-02-17"
---

# System - Enabled Features List

## Endpoint

```plaintext
/o/system/plugins
```

## Overview

Returns enabled feature identifiers for the current server.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires authenticated dashboard user access to management-read endpoints.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |

## Examples

### Example 1: List enabled features

```plaintext
/o/system/plugins?api_key=YOUR_API_KEY
```

```json
[
  "core",
  "events",
  "dashboards"
]
```

## Response

### Success Response

```json
[
  "core",
  "plugins",
  "dashboards",
  "users",
  "events"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array of String | Enabled feature/plugin identifiers. |

### Error Responses

Authentication and authorization failures are returned by the common auth layer.

## Behavior

### Behavior Modes

| Mode | Trigger | Response Shape |
|---|---|---|
| Features list | Authenticated request | Array of feature IDs. |

## Related Endpoints

- [System Version Read](./o-system-version.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not directly read or write database collections.

</details>
