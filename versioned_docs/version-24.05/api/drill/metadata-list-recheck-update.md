---
sidebar_label: "Metadata Lists - Recheck"
keywords:
  - "/i/drill/recheck_lists"
  - "recheck_lists"
  - "drill"
last_update:
  date: "2026-04-17"
---

# Recheck metadata lists

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/drill/recheck_lists
```

## Overview

Starts a Drill metadata list recheck for one app or all apps.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Single-app recheck: requires `drill` `Update` permission.
- All-app recheck: requires global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Conditional | Target app ID for single-app recheck. Required when `all_apps` is not set. |
| `all_apps` | Boolean String | No | Set to any truthy value to recheck metadata lists for all apps. Requires global admin permission. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Single app recheck

```text
/i/drill/recheck_lists?
  app_id=64f5c0d8f4f7ac0012ab3456
```

### All apps recheck

```text
/i/drill/recheck_lists?
  all_apps=true
```

## Response

### Success Response

```json
{
  "result": "List recheck started"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Start confirmation message. |

### Error Responses

This endpoint does not define a dedicated structured error payload beyond authentication/authorization errors. Recheck failures are logged and written to system logs.

## Behavior

- Starts asynchronous metadata list recheck work and returns immediately.
- In all-app mode, iterates through all apps and rechecks lists for each app.
- In single-app mode, rechecks lists for the provided `app_id`.
- Writes completion/failure status to system logs with action `lists_rechecked`.

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)
- [Metadata Cleanup - Update](metadata-cleanup-update.md)
- [Metadata Regeneration - Update](metadata-regeneration-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App iteration for all-app mode | Reads app IDs when `all_apps` is set. |
| `countly_drill.drill_meta` | Drill metadata model | Rechecks and updates metadata list structures. |
| `countly.systemlogs` | Audit trail | Stores `lists_rechecked` completion status. |

</details>
