---
sidebar_label: "Remove Members"
last_update:
  date: "2026-02-16"
---

# Remove Users from Cohort

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/i/cohorts/remove_users`

## Overview

Removes one or more users from a manual cohort (profile group). Supports bulk removal of users and updates cohort membership counters. Used for maintaining dynamic user groups and audience management.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `profile groups` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| cohort | String | Yes | ID of the target manual cohort |
| query | Object (JSON) | One of `query` or `uids` | Query object used to match users to remove |
| uids | Array (JSON) | One of `query` or `uids` | UID array converted to query internally |

## Examples

### Example 1: Remove users using query

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/remove_users" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID" \
  -d 'query={"uid":{"$in":["user_123","user_456"]}}'
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Long-task output status (`Success` or `Failed`) |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Cohort id is missing"}` | Missing `cohort` |
| 400 | `{"result": "App id is missing"}` | Missing `app_id` |
| 400 | `{"result": "There is no data passed to process"}` | No `query` or `uids` |
| 400 | `{"result": "Failed"}` | Long-task output on failure |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |

## Behavior

- Validates update permission for `profile groups` feature.
- For each user in request:
  - Resolves user ID from provided identifier (uid, device_id, or email)
  - Finds user's cohort membership record in `cohortUsers` collection
  - Removes cohort reference from app_user's `chr.{cohort_id}` field
  - Deletes membership record
- Decrements cohort member count in `cohorts` collection
- Records total removed and not found counts
- Writes systemlogs entry (`users_removed_from_cohort`) with removal details for audit trail.

### User Resolution

- `query`: used directly as removal target query.
- `uids`: converted to `{"uid":{"$in":[...]}}` before processing.

### Impact on Other Data

- Updates cohort membership state through cohort processing, including:
  - removing membership rows (`countly.cohortUsers`)
  - unsetting user cohort hashes (`countly.app_users{app_id}` under `chr.<cohort_id>`)
  - decreasing cohort totals (`countly.cohorts`)
- Emits system logs for remove success/failure.

## Limitations

- Intended for manual cohorts (profile groups) workflows.
- Removal runs asynchronously through long-task flow.
- Requests must include either `query` or `uids`.

## Related Endpoints

- [Add users to cohort](cohort-add-users.md) - POST /i/cohorts/add_users
- [Delete cohort](cohort-delete.md) - POST /i/cohorts/delete
- [Get cohort](cohort-single-read.md) - GET /o?method=get_cohort

## Use Cases

1. **Audience cleanup**: Remove users who unsubscribed from campaigns
2. **Campaign completion**: Remove users after targeted campaign ends
3. **User deactivation**: Remove inactive users from engagement groups
4. **Segmentation updates**: Remove users whose characteristics changed
5. **Data maintenance**: Remove duplicate or erroneous user entries

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Decrements member count |
| `countly.cohortUsers` | Collection: | Deletes user membership records |
| `countly.app_users{app_id}` | Collection: | Endpoint-related records used by this endpoint. |
| `chr.{cohort_id}` | Removes | reference |

**Database Collections**

- `countly.cohorts` - Stores cohort definitions for manual cohorts
- `countly.app_users{app_id}` - Resolves users to remove by uid/did query
- `countly.cohortUsers` - Stores cohort membership for manual cohorts

</details>
