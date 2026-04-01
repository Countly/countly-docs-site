---
sidebar_label: "Update"
keywords:
  - "/i/cohorts/edit"
  - "edit"
  - "cohorts"
---

# Update Cohort

## Endpoint

```text
/i/cohorts/edit
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates an existing cohort definition or metadata (name/description/steps/segmentation/visibility/group sharing fields).  
If segmentation-related fields change, existing cohort data is reset and recalculation is triggered.

## Authentication

- API key parameter: `api_key`
- Auth token parameter: `auth_token`
- Auth token header: `countly-token`
## Permissions

- Required permission: `Create` on `cohorts`
- If `type=manual`, required permission is `Create` on `profile groups`

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | Authentication credential |
| `auth_token` | String | Yes (or `api_key`) | Authentication credential |
| `app_id` | String | Yes | App identifier |
| `cohort_id` | String | Yes | Cohort ID to update |
| `cohort_name` | String | No | New cohort name |
| `cohort_desc` | String | No | New cohort description |
| `steps` | Array | No | Updated steps. If sent in query/body text, pass as JSON string |
| `user_segmentation` | Object | No | Updated user segmentation. If sent in query/body text, pass as JSON string |
| `visibility` | String | Yes (current handler behavior) | Allowed values: `global`, `private` |
| `shared_email_edit` | Array | No | Updated shared edit users (JSON string when passed in query/body text) |

At least one updatable field should be provided with `cohort_id`.  
Current handler also validates `visibility` as required, even when only metadata fields are edited.

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
| `result` | String | Operation result string |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| `400` | `{"result":"Not enough args"}` | Required inputs missing |
| `400` | `{"result":"Invalid visibility"}` | `visibility` is not `global`/`private` |
| `400` | `{"result":"All steps must contain event"}` | Step missing `event` |
| `400` | `{"result":"All steps must contain type"}` | Step missing `type` |
| `400` | `{"result":"All steps must contain period"}` | Step missing `period` |
| `400` | `{"result":"Cannot save data"}` | Update operation failed |
| `404` | `{"result":"Cohort not found"}` | Cohort ID not found for app |

Notes:

- Auth/permission failures are handled by authentication and permission validation.

## Behavior/Processing

- Parses `steps`, `user_segmentation`, and `shared_email_edit` from JSON strings when passed as strings.
- Normalizes `cohort_name` to stored field `name`.
- If segmentation changed:
  - clears cohort historical data from `cohortdata`
  - unsets `chr.<cohort_id>` for all `app_users{app_id}` rows
  - triggers recalculation/setup flow
  - marks related reports dirty
- If only metadata changed (for example name/description), recalculation is not forced.
- Writes system log entry with before/update payload.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohortdata` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_users{app_id}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

### Example 1: Rename Cohort

```text
https://your-server.com/i/cohorts/edit
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_ID
&cohort_name=High Intent Users
&visibility=global
```

### Example 2: Update Segmentation Steps

```text
https://your-server.com/i/cohorts/edit
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_ID
&steps=[{"event":"[CLY]_session","type":"did","period":"30days"}]
&visibility=private
```

Decoded payload:

```json
{
  "cohort_id": "COHORT_ID",
  "visibility": "private",
  "steps": [
    {
      "event": "[CLY]_session",
      "type": "did",
      "period": "30days"
    }
  ]
}
```

### Example 3: Update User Segmentation

```text
https://your-server.com/i/cohorts/edit
?api_key=API_KEY
&app_id=APP_ID
&cohort_id=COHORT_ID
&user_segmentation={"query":{"up.country":"DE"}}
&visibility=global
```

## Limitations

- `visibility` must be valid when provided.
- JSON-string parameters must be valid JSON.
- Segmentation changes reset historical cohort data for the cohort.

---

## Related Endpoints

- [Cohorts - Create](cohort-create.md)
- [Cohorts - Delete](cohort-delete.md)
- [Cohorts - Read One](cohort-single-read.md)
- [Cohorts - Recalculate](cohort-recalculate.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
