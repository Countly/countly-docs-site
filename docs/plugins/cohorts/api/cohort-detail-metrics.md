---
sidebar_label: "Update Metrics"
---

# Update Cohort Detail Metrics

## Endpoint

`/i/cohorts/detail_metrics`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Recalculates and refreshes detailed metrics for a cohort, including member count, growth trends, demographics, and behavior patterns. Provides deep-dive analytics about cohort composition and engagement characteristics.

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
| cohort_id | String | Yes | ID of cohort to update metrics for |
| detail_metrics | Array (JSON) | Yes | Detail metrics array, passed as JSON string in query/body text |

## Response

### Success Response

```json
{
  "result": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | Boolean | `true` when detail metrics were updated |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Not enough args"}` | Missing args |
| 404 | `{"result": "Cohort not found"}` | Invalid cohort_id |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |
| 400 | `{"result": "Cannot save data"}` | Update failure |

---

## Behavior/Processing

- Validates update permission for `cohorts`.
- Parses `detail_metrics` JSON when passed as string.
- Updates `detail_metrics` field on the cohort document.
- Returns `{"result": true}` on success.
- Writes `cohort_edited` systemlog entry.

---

## Examples

### Example 1: Update detail metrics list

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/detail_metrics" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort_id=COHORT_ID" \
  -d 'detail_metrics=["up.cc","up.p"]'
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates metrics timestamp |
| `countly.cohortdata` | Collection: | Stores detailed metric calculations |
| `countly.app_users{app_id}` | Collection: | Source data for user metrics |

---

## Limitations

- Only updates stored `detail_metrics` configuration on cohort document.
- Does not return computed analytics payload.

---

## Database Collections

- `countly.cohorts` - Stores detail metrics configuration for cohorts

## Related Endpoints

- [Get cohort metrics](cohort-metrics-read.md) - GET /o?method=get_cohort_metrics
- [Get cohort details](cohort-single-read.md) - GET /o?method=get_cohort

---

## Use Cases

1. **Dashboard refresh**: Recalculate metrics for dashboard display
2. **Trend analysis**: Calculate retention and growth over specific time period
3. **Cohort comparison**: Gather metrics for comparing multiple cohorts
4. **Performance reporting**: Generate cohort performance reports
5. **Anomaly detection**: Calculate metrics to identify unusual cohort behavior


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
