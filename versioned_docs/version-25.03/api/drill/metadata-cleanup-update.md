---
sidebar_label: "Metadata Cleanup - Update"
keywords:
  - "/i/drill/cleanup_meta"
  - "cleanup_meta"
  - "drill"
last_update:
  date: "2026-04-17"
---

# Start metadata cleanup

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/drill/cleanup_meta
```

## Overview

Starts Drill metadata cleanup for one app or all apps.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Single-app cleanup: requires `drill` `Update` permission.
- All-app cleanup: requires global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Conditional | Required for single-app cleanup (`all` not set). |
| `all` | Boolean String | No | Set to any truthy value to run across all apps. Requires global admin permission. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Single app cleanup

```text
/i/drill/cleanup_meta?
  app_id=64f5c0d8f4f7ac0012ab3456
```

### All apps cleanup

```text
/i/drill/cleanup_meta?
  all=true
```

## Response

### Success Response

```json
{
  "result": "Meta cleanup started"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Start confirmation message. |

### Error Responses

- `404`

```json
{
  "result": "Missing parameter app_id"
}
```

## Behavior

- Starts asynchronous cleanup, does not wait for completion.
- For all-app mode, iterates through all apps and runs cleanup per app.
- In single-app mode, `app_id` is required and cleanup is queued for that app only.
- Writes completion/failure status to system logs (`meta_cleanup_finished`).

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly_drill.drill_meta` | Drill metadata model | Stores event/segment/property metadata dictionaries used by this endpoint. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
