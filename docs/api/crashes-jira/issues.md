---
sidebar_label: "List"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-04-18"
---

# List crash JIRA issues

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=crashes-jira
```

## Overview

Returns JIRA issue mappings for one or more crash groups and adds a computed JIRA browse URL.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `crashes-jira` |
| `app_id` | String | Yes | Application identifier |
| `crashgroup_id` | String | No | Single crash group ID |
| `crashgroups` | Array/String | No | Array of crash group IDs |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: List one crash group's issue mapping

```text
/o?method=crashes-jira&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5f2782c5f5300121a00c1&api_key=YOUR_API_KEY
```

### Example 2: List mappings for multiple crash groups

```text
/o?method=crashes-jira&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroups[]=65c5f2782c5f5300121a00c1&crashgroups[]=65c5f27f2c5f5300121a00c2&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  {
    "_id": "65c5f2782c5f5300121a00c1",
    "issue": {
      "key": "MOB-1234"
    },
    "created": 1739629012,
    "lastChecked": 1739630010,
    "url": "https://jira.example.com/browse/MOB-1234"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Crash group ID |
| `issue` | Object | Stored JIRA issue metadata |
| `issue.key` | String | JIRA issue key |
| `created` | Number | Mapping creation timestamp (unix seconds) |
| `lastChecked` | Number | Last sync check timestamp (unix seconds) |
| `url` | String | Computed JIRA browse URL (`api_url + /browse/<key>`) |

### Error Responses

| HTTP Status | Response |
|---|---|
| 401 | `{ "result": "User does not exist" }` or auth validation message |

## Behavior

- Requires `Read` permission on the `crashes` feature.
- Reads the plugin configuration and uses `crashes-jira.api_url` to build returned JIRA browse links.
- Builds the crash group list from `crashgroups` when provided; otherwise uses a single-element list containing `crashgroup_id`.
- Queries `crashes_jira{app_id}` for documents whose `_id` is in that crash group list.
- Adds `url` to each returned mapping as `<api_url>/browse/<issue.key>`.
- The handler does not currently return a custom error body for database read failures in this branch.

## Related Endpoints

- [JIRA for Crashes - Create](create.md)
- [JIRA for Crashes - Sync](sync.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
