---
sidebar_label: "Metadata Cleanup - Update"
---
# Start metadata cleanup

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/drill/cleanup_meta
```

## Overview

Starts Drill metadata cleanup for one app or all apps.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`

Validation methods:
-  for single-app mode
-  when `all=true`

## Permissions

- Single-app cleanup: requires `drill` `Update` permission.
- All-app cleanup: requires global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Conditional | Required for single-app cleanup (`all` not set). |
| `all` | Boolean String | No | Set to truthy value to run across all apps (global admin only). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

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

## Behavior/Processing

- Starts asynchronous cleanup, does not wait for completion.
- For all-app mode, iterates through all apps and runs cleanup per app.
- Writes completion/failure status to system logs (`meta_cleanup_finished`).

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly_drill.drill_meta` | Drill metadata model | Stores event/segment/property metadata dictionaries used by this endpoint. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

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

---

## Related Endpoints

- [Query Metadata - Read](query-metadata-read.md)

---

## Last Updated

2026-02-16
