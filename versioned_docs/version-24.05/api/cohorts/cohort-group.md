---
sidebar_label: "Group"
last_update:
  date: "2026-02-16"
---

# Manage Cohort Grouping

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/i/cohorts/group`

## Overview

Organizes cohorts into named groups/categories for better organization and discovery. Groups are user-defined collections that help structure and filter cohorts. Supports creating, modifying, and managing group hierarchies.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| cohort_id | String | Yes | ID of cohort to group |
| groups | Object (JSON) | Yes | Group map, for example `{"doc_audit":1}`; truthy sets, falsy unsets |

## Examples

### Example 1: Assign cohort to a group

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/group" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort_id=COHORT_ID" \
  -d 'groups={"vip_audiences":1}'
```

## Response

### Success Response

```json
{"result": "Success"}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Status string |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Not enough args"}` | Missing required parameters |
| 404 | `{"result": "Cohort not found"}` | Invalid cohort_id |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |
| 400 | `{"result": "Cannot save data"}` | Update failure |

## Behavior

- Validates update permission for `cohorts` feature.
- Validates cohort exists for the specified app.
- If `group_remove=true`:
  - Removes cohort from group list
  - Updates cohort document (unsets group membership)
- Applies `$set`/`$unset` updates under `groups.<key>` based on provided map values
- Writes systemlogs entry (`cohort_grouped`) with group information for audit trail.

## Limitations

- `groups` must be a valid JSON object.
- Endpoint updates `groups.<key>` flags directly on the cohort document.

## Related Endpoints

- [Get cohorts list](read.md) - GET /o?method=get_cohorts
- [Get cohorts by list](cohort-list-read.md) - GET /o?method=get_cohort_list

## Use Cases

1. **Organize by purpose**: Group `email_audiences`, `push_audiences`, `analytics_segments`
2. **Organize by team**: Group cohorts assigned to specific teams (marketing, sales)
3. **Organize by lifecycle**: Group `onboarding`, `retention`, `churn_risk` cohorts
4. **Quick access**: Move frequently used cohorts to organized groups
5. **Campaign management**: Group cohorts related to specific campaigns

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates group membership field |
| `countly.cohort_groups` | Collection: | (optional); Records group metadata if available |

**Database Collections**

- `countly.cohorts` - Stores cohort group assignments

</details>
