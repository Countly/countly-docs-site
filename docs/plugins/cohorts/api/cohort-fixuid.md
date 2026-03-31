---
sidebar_label: "Fix UID"
---

# Fix Broken UID References in Cohorts

## Endpoint

`/i/cohorts/fixuid`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Repairs broken or mismatched user ID (UID) references in cohort membership records. Used for fixing data consistency issues when user ID mappings change or become corrupted. Maintenance endpoint for data recovery.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `cohorts` feature (admin-level)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | No | If provided (and `all` not set), scope to one app |
| all | Boolean/String | No | If truthy, run across all apps |

## Response

### Success Response

```json
{"result": "Started fixing u_id1 apps"}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Async start message with app count |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |

---

## Behavior/Processing

- Validates admin or database manager authorization.
- Starts asynchronous fix process per matched app.
- Immediate response is a start message; detailed processing happens in background.

---

## Examples

### Example 1: Start UID repair

**Request**:
```bash
curl -X POST "https://your-server.com/i/cohorts/fixuid" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohortUsers` | Collection: | Repairs UID references; Removes orphaned records |
| `countly.app_users{app_id}` | Collection: | Updates cohort references if needed |
| `countly.cohorts` | Collection: | Recalculates member counts |

---

## Limitations

- Runs asynchronously in background after initial response.
- Scoped by `app_id` unless `all` is supplied.

---

## Database Collections

- `countly.cohortUsers` - Fixes missing user id references in cohort membership
- `countly.app_users{app_id}` - Resolves user ids for cohort membership fixes

## Related Endpoints

- [Clean up data](cohort-cleanup.md) - POST /i/cohorts/cleanup

---

## Use Cases

1. **Data integrity check**: Verify and repair UID references after system migration
2. **User merge recovery**: Fix references after user merge operations
3. **Error diagnosis**: Use dry-run to identify cohort data issues
4. **Post-incident recovery**: Repair after system crash or data corruption
5. **Cleanup after deletions**: Remove orphaned references after bulk user deletion


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
