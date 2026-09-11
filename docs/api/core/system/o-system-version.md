---
sidebar_label: "Version Read"
keywords:
  - "/o/system/version"
  - "version"
  - "system"
last_update:
  date: "2026-02-17"
---

# System - Version Read

## Endpoint

```plaintext
/o/system/version
```

## Overview

Returns the Countly server version string.

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

### Example 1: Read server version

```plaintext
/o/system/version?api_key=YOUR_API_KEY
```

```json
{
  "version": "24.11.0"
}
```

## Response

### Success Response

```json
{
  "version": "24.11.0"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `version` | String | Countly server version. |

### Error Responses

Authentication and authorization failures are returned by the common auth layer.

## Behavior

### Behavior Modes

| Mode | Trigger | Response Shape |
|---|---|---|
| Version response | Authenticated request | Object with `version` field. |

## Related Endpoints

- [Enabled Features List](./o-system-plugins.md)
- [Observability Read](./o-system-observability.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not directly read or write database collections.

</details>
