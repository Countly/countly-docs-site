---
sidebar_label: "Sync"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
last_update:
  date: "2026-02-16"
---

# Sync crash and JIRA status

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crashes-jira?method=sync
```

## Overview

Synchronizes status between Countly crash groups and mapped JIRA issues.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `sync` |
| `app_id` | String | Yes | Application identifier |
| `crashgroup_id` | String | No | Specific crash group to sync; if omitted, plugin attempts to sync all mapped groups |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Sync one crash group

```text
/i/crashes-jira?method=sync&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5f2782c5f5300121a00c1&api_key=YOUR_API_KEY
```

### Example 2: Trigger sync for all mapped crash groups

```text
/i/crashes-jira?method=sync&app_id=5f9c8a3b4d1e2a001f3b4567&api_key=YOUR_API_KEY
```

## Response

### Success Response

Possible success responses for single-crash sync:

```json
{
  "result": "Succesfully updated crash"
}
```

```json
{
  "result": "Success"
}
```

```json
{
  "result": "Crash is already in sync"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Sync operation status |

### Error Responses

| HTTP Status | Response |
|---|---|
| 404 | `{ "result": "Failed to find crashgroup" }` |
| 404 | `{ "result": "Failed to find crashgroup jira issue" }` |
| 500 | `{ "result": "Failed to find app" }` |
| 500 | `{ "result": "Incomplete jira-crashes app config" }` |
| 500 | `{ "result": "Missing access token, please log in to JIRA" }` |
| 500 | `{ "result": "Failed to find JIRA access token" }` |
| 500 | `{ "result": "Ran into an error while connecting to JIRA" }` |
| 500 | `{ "result": "Failed to update crashgroup" }` |
| 500 | `{ "result": "Failed to get JIRA issue transitions" }` |
| 500 | `{ "result": "Failed to transition JIRA issue" }` |
| 500 | `{ "result": "Could not find transition" }` |

## Behavior

- Compares Countly crash states (`is_resolved`, `is_resolving`) with JIRA issue status.
- If JIRA status is newer, Countly crash group is updated.
- If Countly status is newer, endpoint tries to transition JIRA issue.
- Updates `lastChecked` timestamp in mapping document.

## Limitations

- Single-crash sync gives deterministic response.
- All-crashes sync is loop-based and may not return per-crash status details.

## Related Endpoints

- [JIRA for Crashes - Create](create.md)
- [JIRA for Crashes - List](issues.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.app_crashgroups{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.crashes_jira{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
