---
sidebar_label: "Read"
keywords:
  - "/o/flows"
  - "flows"
last_update:
  date: "2026-02-16"
---

# Get flow events catalog

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/flows?method=events
```

## Overview

Returns internal and custom event lists used in flow setup.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `events`. |
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o/flows?
  method=events&
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
{
  "internal": ["[CLY]_session", "[CLY]_view", "[CLY]_view_update"],
  "custom": ["signup", "purchase"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `internal` | Array | Internal drill events list. |
| `custom` | Array | App custom event keys excluding internal events. |

### Error Responses

This endpoint does not define a dedicated structured error payload; error output can vary by failure path.

## Behavior

- Loads app event list from `countly.events`.
- Builds `internal` from `plugins.internalDrillEvents` and appends `[CLY]_view_update`.
- Removes internal events from custom event list before returning.

## Related Endpoints

- [Flows - Views](views.md)
- [Flows - Crashes](crashes.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `flows.*` | Flows feature defaults | Flows analytics query behavior and result shaping. | Changes to flows settings can affect returned paths, aggregation behavior, and limits. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.events` | Event catalog and schema | Stores app event list/map/segment schema read or updated by this endpoint. |

</details>
