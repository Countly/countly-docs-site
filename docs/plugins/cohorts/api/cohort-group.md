---
sidebar_label: "Group"
---

# Manage Cohort Grouping

## Endpoint

`/i/cohorts/group`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Organizes cohorts into named groups/categories for better organization and discovery. Groups are user-defined collections that help structure and filter cohorts. Supports creating, modifying, and managing group hierarchies.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

---

## Behavior/Processing

- Validates update permission for `cohorts` feature.
- Validates cohort exists for the specified app.
- If `group_remove=true`:
  - Removes cohort from group list
  - Updates cohort document (unsets group membership)
- Applies `$set`/`$unset` updates under `groups.<key>` based on provided map values
- Writes systemlogs entry (`cohort_grouped`) with group information for audit trail.

---

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

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates group membership field |
| `countly.cohort_groups` | Collection: | (optional); Records group metadata if available |

---

## Limitations

- `groups` must be a valid JSON object.
- Endpoint updates `groups.<key>` flags directly on the cohort document.

---

## Database Collections

- `countly.cohorts` - Stores cohort group assignments

## Related Endpoints

- [Get cohorts list](read.md) - GET /o?method=get_cohorts
- [Get cohorts by list](cohort-list-read.md) - GET /o?method=get_cohort_list

---

## Use Cases

1. **Organize by purpose**: Group `email_audiences`, `push_audiences`, `analytics_segments`
2. **Organize by team**: Group cohorts assigned to specific teams (marketing, sales)
3. **Organize by lifecycle**: Group `onboarding`, `retention`, `churn_risk` cohorts
4. **Quick access**: Move frequently used cohorts to organized groups
5. **Campaign management**: Group cohorts related to specific campaigns


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
