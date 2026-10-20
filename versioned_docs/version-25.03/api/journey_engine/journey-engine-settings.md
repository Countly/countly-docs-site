---
sidebar_label: "Settings"
keywords:
  - "/o/journey-engine/settings"
  - "settings"
  - "journey-engine"
last_update:
  date: "2026-10-16"
---

# Journey Engine - Settings

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/journey-engine/settings
```

## Overview

Returns the Journey Engine setting that applies to the whole server: the content cooldown in hours.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `journey_engine` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID used for the read permission check. |

## Examples

### Read the settings

```text
/o/journey-engine/settings?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
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
| `cooldown` | Number | Cooldown in hours between content shown to the same user. `24` when no value is set. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Returns the server-wide value. An app can override it with its own cooldown; to read the value that applies to one user, use [User Content](journey-engine-user-content.md).
- Read-only. Nothing is modified.

## Related Endpoints

- [Journey Engine - User Content](journey-engine-user-content.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.plugins` | Configuration | Reads the `journey_engine` configuration. |

</details>
