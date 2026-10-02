---
sidebar_label: "Fix UID"
last_update:
  date: "2026-02-16"
---

# Fix Broken UID References in Cohorts

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/i/cohorts/fixuid`

## Overview

Repairs broken or mismatched user ID (UID) references in cohort membership records. Used for fixing data consistency issues when user ID mappings change or become corrupted. Maintenance endpoint for data recovery.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `cohorts` feature (admin-level)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | No | If provided (and `all` not set), scope to one app |
| all | Boolean/String | No | If truthy, run across all apps |

## Examples

### Example 1: Start UID repair

**Request**:
```bash
curl -X POST "https://your-server.com/i/cohorts/fixuid" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

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

## Behavior

- Validates admin or database manager authorization.
- Starts asynchronous fix process per matched app.
- Immediate response is a start message; detailed processing happens in background.

## Limitations

- Runs asynchronously in background after initial response.
- Scoped by `app_id` unless `all` is supplied.

## Related Endpoints

- [Clean up data](cohort-cleanup.md) - POST /i/cohorts/cleanup

## Use Cases

1. **Data integrity check**: Verify and repair UID references after system migration
2. **User merge recovery**: Fix references after user merge operations
3. **Error diagnosis**: Use dry-run to identify cohort data issues
4. **Post-incident recovery**: Repair after system crash or data corruption
5. **Cleanup after deletions**: Remove orphaned references after bulk user deletion

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohortUsers` | Collection: | Repairs UID references; Removes orphaned records |
| `countly.app_users{app_id}` | Collection: | Updates cohort references if needed |
| `countly.cohorts` | Collection: | Recalculates member counts |

**Database Collections**

- `countly.cohortUsers` - Fixes missing user id references in cohort membership
- `countly.app_users{app_id}` - Resolves user ids for cohort membership fixes

</details>
