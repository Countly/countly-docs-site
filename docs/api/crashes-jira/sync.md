---
sidebar_label: "Sync"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
---

# Sync crash and JIRA status

## Endpoint

```
/i/crashes-jira?method=sync
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Synchronizes status between Countly crash groups and mapped JIRA issues.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

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

## Behavior/Processing

- Compares Countly crash states (`is_resolved`, `is_resolving`) with JIRA issue status.
- If JIRA status is newer, Countly crash group is updated.
- If Countly status is newer, endpoint tries to transition JIRA issue.
- Updates `lastChecked` timestamp in mapping document.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.app_crashgroups{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.crashes_jira` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.crashes_jira{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Sync one crash group

```text
/i/crashes-jira?method=sync&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5f2782c5f5300121a00c1&api_key=YOUR_API_KEY
```

### Example 2: Trigger sync for all mapped crash groups

```text
/i/crashes-jira?method=sync&app_id=5f9c8a3b4d1e2a001f3b4567&api_key=YOUR_API_KEY
```

## Limitations

- Single-crash sync gives deterministic response.
- All-crashes sync is loop-based and may not return per-crash status details.

## Related Endpoints

- [JIRA for Crashes - Create](create.md)
- [JIRA for Crashes - List](issues.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
