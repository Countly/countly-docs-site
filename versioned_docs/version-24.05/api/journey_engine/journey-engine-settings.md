---
sidebar_label: "Settings"
keywords:
  - "/o/journey-engine/settings"
  - "GET /o/journey-engine/settings"
  - "settings"
  - "journey-engine"
last_update:
  date: "2026-10-17"
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

Read the Journey Engine settings of the server.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required): Application ID

## Examples

### Read the settings
```
GET /o/journey-engine/settings?app_id=64afe321d5f9b2f77cb2c8ed
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
| `cooldown` | Number | Cooldown in hours between content deliveries to the same user. Defaults to `24`. |

## Behavior

- Returns the server-wide `journey_engine.cooldown` setting. A per-app value, if one is set, is not part of this response.

## Related Endpoints

- [User Content](journey-engine-user-content.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint reads the server configuration and does not read a collection.

</details>
