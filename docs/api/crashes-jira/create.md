---
sidebar_label: "Create"
keywords:
  - "/i/crashes-jira"
  - "crashes-jira"
---

# Create JIRA issue

## Endpoint

```
/i/crashes-jira?method=create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a JIRA issue for a crash group and stores the issue key mapping in Countly.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `create` |
| `app_id` | String | Yes | Application identifier |
| `crashgroup_id` | String | Yes | Crash group identifier |
| `summary` | String | No | Override default issue summary (defaults to crash group name) |
| `description` | String | No | Override default issue description (defaults to crash error body) |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

## Response

### Success Response

New issue created:

```json
{
  "result": "Success"
}
```

Issue already exists:

```json
{
  "result": "There is already a JIRA issue for this crashgroup"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Create operation result message |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing params" }` |
| 404 | `{ "result": "Could not find crash group" }` |
| 404 | `{ "result": "App does not exist" }` |
| 500 | `{ "result": "Missing access token, please log in to JIRA" }` |
| 500 | `{ "result": "Failed to find JIRA access token" }` |
| 500 | `{ "result": "Failed to find app" }` |
| 500 | `{ "result": "Incomplete jira-crashes app config" }` |
| 500 | `{ "result": "Failed to find crash group: ..." }` |
| 500 | `{ "result": "Failed to connect to JIRA" }` |
| 500 | `{ "result": "Failed to store JIRA issue" }` |
| 500 | `{ "result": "<JIRA validation errors combined>" }` |

## Behavior/Processing

1. Validates app config under `app.plugins["crashes-jira"]` (`project`, `type`).
2. Fetches crash group and checks if a mapping already exists.
3. Creates issue in JIRA (`/rest/api/3/issue`) when missing.
4. Stores mapping in `crashes_jira{app_id}` with `issue.key` and `created` timestamp.

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

### Example 1: Create issue with default summary/description

```text
/i/crashes-jira?method=create&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5f2782c5f5300121a00c1&api_key=YOUR_API_KEY
```

### Example 2: Create issue with custom summary and description

```text
/i/crashes-jira?
method=create&
app_id=5f9c8a3b4d1e2a001f3b4567&
crashgroup_id=65c5f2782c5f5300121a00c1&
summary=Android crash on checkout&
description=Crash reported in v2.3.1; Repro steps included&
api_key=YOUR_API_KEY
```

## Related Endpoints

- [JIRA for Crashes - List](issues.md)
- [JIRA for Crashes - Sync](sync.md)

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
