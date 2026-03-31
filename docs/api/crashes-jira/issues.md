---
sidebar_label: "List"
---

# List crash JIRA issues

## Endpoint

```
/o?method=crashes-jira
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns JIRA issue mappings for one or more crash groups and adds a computed JIRA browse URL.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes-jira.*` | Crashes Jira integration defaults | Jira integration logic and synchronization behavior. | Changes to Jira integration settings can alter authentication, sync behavior, and returned integration state. |

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

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashes_jira{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: List one crash group's issue mapping

```text
/o?method=crashes-jira&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5f2782c5f5300121a00c1&api_key=YOUR_API_KEY
```

### Example 2: List mappings for multiple crash groups

```text
/o?method=crashes-jira&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroups[]=65c5f2782c5f5300121a00c1&crashgroups[]=65c5f27f2c5f5300121a00c2&api_key=YOUR_API_KEY
```

## Related Endpoints

- [JIRA for Crashes - Create](create.md)
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
