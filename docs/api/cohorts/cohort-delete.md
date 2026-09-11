---
sidebar_label: "Delete"
keywords:
  - "/i/cohorts/delete"
  - "delete"
  - "cohorts"
last_update:
  date: "2026-02-16"
---

# Delete Cohort

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/cohorts/delete
```

## Overview

Deletes one or multiple cohorts by ID for the selected app.  
The endpoint also removes related cohort data and profile hash references.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: `Delete` on `cohorts`

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | Authentication credential |
| `auth_token` | String | Yes (or `api_key`) | Authentication credential |
| `app_id` | String | Yes | App identifier |
| `cohort_id` | String | Yes | One ID or comma-separated cohort IDs |
| `ack` | String | No | Expected acknowledgment count for `/cohort/delete` plugin dispatch |

## Examples

### Example 1: Delete One Cohort

```text
https://your-server.com/i/cohorts/delete
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_ID
```

### Example 2: Bulk Delete

```text
https://your-server.com/i/cohorts/delete
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_A,COHORT_B,COHORT_C
```

### Example 3: Delete with Ack Check

```text
https://your-server.com/i/cohorts/delete
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_ID
&ack=2
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

For partial bulk deletion, success still returns `200` with count summary:

```json
{
  "result": "2/3 cohorts deleted"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Deletion outcome (`Success` or partial summary) |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| `400` | `{"result":"Not enough args"}` | Required input missing |
| `404` | `{"result":"Cohort does not exist"}` | No matching cohorts for app |
| `400` | `{"result":"Error deleting cohort. Please check logs."}` | Deletion pipeline failed |

Notes:

- Auth/permission failures are handled by authentication and permission validation.

## Behavior

- Loads target cohorts by app + IDs.
- For each cohort:
  - dispatches `/cohort/delete` for cross-feature cleanup
  - validates `ack` when provided
  - deletes cohort from `cohorts`
  - removes `cohortdata` rows by cohort ID prefix
  - unsets `chr.<cohort_id>` in `app_users{app_id}`
  - removes related widget entries via dashboard endpoint
  - writes system log event
- After loop, runs hash cleanup recheck.

## Limitations

- Deletion is permanent.
- `cohort_id` must belong to the provided `app_id`.
- Bulk operation may end with partial success if some cohorts fail deletion.

## Related Endpoints

- [Cohorts - Read List](read.md)
- [Cohorts - Create](cohort-create.md)
- [Cohorts - Update](cohort-edit.md)
- [Cohorts - Read One](cohort-single-read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohortdata` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_users{app_id}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

</details>
