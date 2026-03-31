---
sidebar_label: "Recalculate"
---

# Recalculate Cohort Membership

## Endpoint

`/i/cohorts/recalculate`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Manually triggers recalculation of a dynamic cohort's membership based on current behavioral steps or segmentation query. Useful for forcing immediate cohort data refresh or when `realtime_cohorts` is disabled and manual recalculation is needed.

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
| cohort_id | String | Yes | ID of cohort to recalculate |

## Response

### Success Response

```json
{"result": "Cohort update started"}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Status message |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Not enough args"}` | Missing required args |
| 404 | `{"result": "Cohort does not exist"}` | Invalid cohort_id |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |

---

## Behavior/Processing

- Validates update permission for `cohorts` feature.
- Validates cohort exists.
- Responds immediately with `Cohort update started`.
- Triggers async recalculation via `setUpDataForCohort(..., {force: true})`.

---

## Examples

### Example 1: Trigger cohort recalculation

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/recalculate" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort_id=COHORT_ID"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates cohort state |
| `countly.cohortdata` | Collection: | Cleared if full recalculation requested |
| `countly.app_users{app_id}` | Collection: | Updated with new cohort membership data |

---

## Limitations

- Large cohorts with complex queries may take significant time to recalculate.
- Response is immediate; calculation continues in background.

---

## Database Collections

- `countly.cohorts` - Stores cohort definitions and calculation state

## Related Endpoints

- [Update cohort](cohort-edit.md) - POST /i/cohorts/edit
- [Get cohort](cohort-single-read.md) - GET /o?method=get_cohort
- [Get cohort state](cohort-state-read.md) - GET /o?method=cohortstate

---

## Use Cases

1. **Fix stale data**: When cohort membership appears incorrect, force recalculation
2. **After configuration change**: Recalculate after updating event tracking or user properties
3. **Manual update cycle**: When realtime mode is disabled, trigger batch recalculation on demand
4. **Performance testing**: Benchmark recalculation duration for large cohorts
5. **Data recovery**: Force recalculation after data inconsistency issues


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
