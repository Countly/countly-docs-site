---
sidebar_label: "Settings Read"
keywords:
  - "/o/journey-engine/settings"
  - "GET /o/journey-engine/settings"
  - "settings"
  - "journey-engine"
last_update:
  date: "2026-10-23"
---

# Journey Engine - Settings

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/settings
```

## Overview

Return the Journey Engine cooldown setting, in hours.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required for non-global-admin users): App ID

## Examples

```
GET /o/journey-engine/settings?app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "cooldown": 24
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `cooldown` | Number | Cooldown between content deliveries, in hours. `24` when not configured. |

## Behavior

- Returns the global `journey_engine.cooldown` setting.

## Related Endpoints

- [User Content](journey-engine-user-content.md)
